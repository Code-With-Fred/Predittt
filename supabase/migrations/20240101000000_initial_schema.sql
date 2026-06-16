-- Enable pgcrypto for gen_random_uuid()
create extension if not exists "pgcrypto";

-- ============================================================
-- ENUMS
-- ============================================================
create type prediction_source as enum ('ai', 'manual', 'hybrid');
create type prediction_status as enum ('pending', 'won', 'lost', 'void');
create type visibility as enum ('free', 'vip', 'premium');
create type fixture_status as enum ('scheduled', 'live', 'finished');
create type subscription_status as enum ('active', 'cancelled', 'expired', 'trialing');
create type tip_purchase_status as enum ('pending', 'success', 'failed');
create type payment_provider as enum ('paystack', 'stripe');

-- ============================================================
-- TABLES
-- ============================================================

create table if not exists profiles (
  id            uuid primary key references auth.users on delete cascade,
  email         text not null,
  display_name  text not null,
  avatar_url    text,
  is_vip        boolean not null default false,
  saved_fixture_ids text[] default '{}',
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create table if not exists leagues (
  id               uuid primary key default gen_random_uuid(),
  name             text not null,
  logo_url         text not null default '',
  api_football_id  integer unique,
  country          text,
  season           integer,
  created_at       timestamptz not null default now()
);

create table if not exists teams (
  id               uuid primary key default gen_random_uuid(),
  name             text not null,
  logo_url         text not null default '',
  api_football_id  integer unique,
  created_at       timestamptz not null default now()
);

create table if not exists fixtures (
  id               uuid primary key default gen_random_uuid(),
  league_id        uuid not null references leagues on delete cascade,
  home_team_id     uuid not null references teams on delete cascade,
  away_team_id     uuid not null references teams on delete cascade,
  kickoff_at       timestamptz not null,
  status           fixture_status not null default 'scheduled',
  home_score       integer,
  away_score       integer,
  stats            jsonb,
  api_football_id  integer unique,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

create table if not exists tipsters (
  id              uuid primary key default gen_random_uuid(),
  display_name    text not null,
  is_ai           boolean not null default false,
  avatar_url      text not null default '',
  user_id         uuid references profiles on delete set null,
  win_rate        numeric(5,2) not null default 0,
  roi_units       numeric(8,2) not null default 0,
  settled         integer not null default 0,
  avg_odds        numeric(6,2) not null default 0,
  avg_confidence  numeric(5,2) not null default 0,
  markets         jsonb,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create table if not exists predictions (
  id           uuid primary key default gen_random_uuid(),
  fixture_id   uuid not null references fixtures on delete cascade,
  tipster_id   uuid not null references tipsters on delete cascade,
  source       prediction_source not null,
  market       text not null,
  pick         text not null,
  odds         numeric(6,2) not null,
  confidence   integer not null check (confidence between 0 and 100),
  reasoning    text not null default '',
  visibility   visibility not null default 'free',
  price_ngn    integer,
  status       prediction_status not null default 'pending',
  published_at timestamptz not null default now(),
  settled_at   timestamptz,
  created_at   timestamptz not null default now()
);

create table if not exists subscription_plans (
  id                  uuid primary key default gen_random_uuid(),
  name                text not null,
  currency            text not null check (currency in ('NGN', 'USD')),
  amount_kobo         integer not null,
  plan_interval       text not null check (plan_interval in ('monthly', 'yearly')),
  features            text[] not null default '{}',
  is_popular          boolean not null default false,
  paystack_plan_code  text,
  stripe_price_id     text,
  created_at          timestamptz not null default now()
);

create table if not exists subscriptions (
  id                          uuid primary key default gen_random_uuid(),
  user_id                     uuid not null references profiles on delete cascade,
  plan_id                     uuid not null references subscription_plans,
  status                      subscription_status not null default 'trialing',
  paystack_subscription_code  text,
  paystack_customer_code      text,
  stripe_subscription_id      text,
  current_period_start        timestamptz not null,
  current_period_end          timestamptz not null,
  cancel_at_period_end        boolean not null default false,
  created_at                  timestamptz not null default now(),
  updated_at                  timestamptz not null default now()
);

create table if not exists tip_purchases (
  id                  uuid primary key default gen_random_uuid(),
  user_id             uuid not null references profiles on delete cascade,
  prediction_id       uuid not null references predictions on delete cascade,
  amount_kobo         integer not null,
  currency            text not null default 'NGN',
  status              tip_purchase_status not null default 'pending',
  paystack_reference  text,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now(),
  unique (user_id, prediction_id)
);

create table if not exists payment_events (
  id           uuid primary key default gen_random_uuid(),
  provider     payment_provider not null,
  event_id     text not null,
  event_type   text not null,
  payload      jsonb not null,
  processed_at timestamptz not null default now(),
  created_at   timestamptz not null default now(),
  unique (provider, event_id)
);

create table if not exists bookmakers (
  id            uuid primary key default gen_random_uuid(),
  name          text not null,
  logo_url      text not null default '',
  affiliate_url text not null,
  is_active     boolean not null default true,
  sort_order    integer not null default 0,
  created_at    timestamptz not null default now()
);

-- ============================================================
-- INDEXES
-- ============================================================
create index if not exists predictions_fixture_id_idx on predictions (fixture_id);
create index if not exists predictions_tipster_id_idx on predictions (tipster_id);
create index if not exists predictions_status_idx on predictions (status);
create index if not exists predictions_visibility_idx on predictions (visibility);
create index if not exists predictions_published_at_idx on predictions (published_at desc);
create index if not exists fixtures_kickoff_at_idx on fixtures (kickoff_at);
create index if not exists fixtures_status_idx on fixtures (status);
create index if not exists subscriptions_user_id_idx on subscriptions (user_id);
create index if not exists subscriptions_status_idx on subscriptions (status);
create index if not exists tip_purchases_user_id_idx on tip_purchases (user_id);

-- ============================================================
-- FUNCTIONS
-- ============================================================

-- Returns true when the user has an active VIP subscription
create or replace function is_vip(user_id uuid)
returns boolean
language sql
stable
security definer
as $$
  select exists (
    select 1 from subscriptions
    where subscriptions.user_id = $1
      and status = 'active'
      and current_period_end > now()
  );
$$;

-- Recomputes win_rate, roi_units, settled for a tipster and writes them back
create or replace function tipster_accuracy(p_tipster_id uuid)
returns void
language plpgsql
security definer
as $$
declare
  v_settled   integer;
  v_wins      integer;
  v_roi       numeric;
  v_avg_odds  numeric;
  v_avg_conf  numeric;
begin
  select
    count(*),
    count(*) filter (where status = 'won'),
    sum(case when status = 'won' then odds - 1 when status = 'lost' then -1 else 0 end),
    avg(odds),
    avg(confidence)
  into v_settled, v_wins, v_roi, v_avg_odds, v_avg_conf
  from predictions
  where tipster_id = p_tipster_id
    and status in ('won', 'lost');

  update tipsters
  set
    settled        = coalesce(v_settled, 0),
    win_rate       = case when coalesce(v_settled, 0) > 0 then round(v_wins::numeric / v_settled * 100, 2) else 0 end,
    roi_units      = coalesce(round(v_roi, 2), 0),
    avg_odds       = coalesce(round(v_avg_odds, 2), 0),
    avg_confidence = coalesce(round(v_avg_conf, 2), 0),
    updated_at     = now()
  where id = p_tipster_id;
end;
$$;

-- ============================================================
-- TRIGGERS
-- ============================================================

-- Auto-create profile on signup
create or replace function handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, display_name, avatar_url)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    new.raw_user_meta_data->>'avatar_url'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();

-- Sync is_vip on profiles whenever a subscription changes
create or replace function sync_is_vip()
returns trigger
language plpgsql
security definer
as $$
begin
  update profiles
  set is_vip = is_vip(coalesce(new.user_id, old.user_id)),
      updated_at = now()
  where id = coalesce(new.user_id, old.user_id);
  return coalesce(new, old);
end;
$$;

drop trigger if exists on_subscription_change on subscriptions;
create trigger on_subscription_change
  after insert or update or delete on subscriptions
  for each row execute procedure sync_is_vip();

-- Update updated_at automatically
create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger set_profiles_updated_at
  before update on profiles
  for each row execute procedure set_updated_at();

create trigger set_fixtures_updated_at
  before update on fixtures
  for each row execute procedure set_updated_at();

create trigger set_tipsters_updated_at
  before update on tipsters
  for each row execute procedure set_updated_at();

create trigger set_subscriptions_updated_at
  before update on subscriptions
  for each row execute procedure set_updated_at();

create trigger set_tip_purchases_updated_at
  before update on tip_purchases
  for each row execute procedure set_updated_at();

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
alter table profiles enable row level security;
alter table leagues enable row level security;
alter table teams enable row level security;
alter table fixtures enable row level security;
alter table tipsters enable row level security;
alter table predictions enable row level security;
alter table subscription_plans enable row level security;
alter table subscriptions enable row level security;
alter table tip_purchases enable row level security;
alter table payment_events enable row level security;
alter table bookmakers enable row level security;

-- profiles: users can read/update their own row only
create policy "profiles: own read"   on profiles for select using (auth.uid() = id);
create policy "profiles: own update" on profiles for update using (auth.uid() = id);

-- public read for reference tables
create policy "leagues: public read"   on leagues            for select using (true);
create policy "teams: public read"     on teams              for select using (true);
create policy "fixtures: public read"  on fixtures           for select using (true);
create policy "tipsters: public read"  on tipsters           for select using (true);
create policy "bookmakers: public read" on bookmakers        for select using (true);
create policy "plans: public read"     on subscription_plans for select using (true);

-- predictions: free picks are public; locked picks are readable but
-- the reasoning column is gated in application code (lib/gating.ts), not in RLS.
-- RLS is the backstop — it ensures the row is at least reachable.
create policy "predictions: public read" on predictions for select using (true);

-- subscriptions: own only
create policy "subscriptions: own read"   on subscriptions for select using (auth.uid() = user_id);
create policy "subscriptions: own insert" on subscriptions for insert with check (auth.uid() = user_id);

-- tip_purchases: own only
create policy "tip_purchases: own read"   on tip_purchases for select using (auth.uid() = user_id);
create policy "tip_purchases: own insert" on tip_purchases for insert with check (auth.uid() = user_id);

-- payment_events: no direct client access (service role only)
-- (no policies = deny all for authenticated + anon roles)
