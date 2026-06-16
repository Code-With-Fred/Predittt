import type { Metadata } from 'next';
import ContentPage, { Section } from '@/components/ContentPage';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'Terms of Service for Predicta.ng — read before using our predictions platform.',
};

export default function TermsPage() {
  return (
    <ContentPage
      title="Terms of Service"
      subtitle="Last updated: June 2026"
    >
      <Section title="1. Acceptance of terms">
        <p>By accessing or using Predicta.ng (&quot;the Platform&quot;), you agree to be bound by these Terms of Service. If you do not agree, please do not use the Platform. You must be at least 18 years old to use this service.</p>
      </Section>

      <Section title="2. Nature of our service">
        <p>Predicta.ng provides statistical football analysis and predictions for informational and entertainment purposes only. Content on this Platform is not financial advice, investment advice, or a recommendation to engage in gambling. All predictions are opinions based on data — they are not guaranteed outcomes.</p>
        <p>Past performance of any tipster or model does not guarantee future results.</p>
      </Section>

      <Section title="3. Eligibility">
        <p>To use this Platform you must: (a) be 18 years of age or older; (b) reside in a jurisdiction where online sports prediction services are legal; (c) not be listed on any self-exclusion register operated by a gambling regulator.</p>
      </Section>

      <Section title="4. Subscriptions and payments">
        <p>VIP subscriptions are billed in advance on a monthly or annual basis. You may cancel at any time; your access continues until the end of the current billing period. No refunds are issued for partial periods. Premium pay-per-tip purchases are non-refundable once the content has been unlocked.</p>
      </Section>

      <Section title="5. Prohibited conduct">
        <p>You may not: resell or redistribute our predictions; use automated tools to scrape content; attempt to reverse-engineer our models; create multiple accounts to circumvent access restrictions; use the Platform in any way that violates applicable law.</p>
      </Section>

      <Section title="6. Intellectual property">
        <p>All content on this Platform — including predictions, analysis, model outputs, and design — is the property of Predicta.ng. You may not reproduce or distribute it without written permission.</p>
      </Section>

      <Section title="7. Disclaimer of warranties">
        <p>The Platform is provided &quot;as is&quot; without warranties of any kind. We do not warrant that predictions will be accurate, that the service will be uninterrupted, or that any particular outcome will occur.</p>
      </Section>

      <Section title="8. Limitation of liability">
        <p>To the fullest extent permitted by law, Predicta.ng shall not be liable for any indirect, incidental, or consequential damages arising from your use of the Platform or reliance on any prediction. Our total liability to you shall not exceed the amount you paid us in the 30 days preceding the claim.</p>
      </Section>

      <Section title="9. Changes to these terms">
        <p>We may update these Terms from time to time. Continued use of the Platform after changes constitutes acceptance of the new Terms. Material changes will be notified by email or prominent notice on the Platform.</p>
      </Section>

      <Section title="10. Contact">
        <p>Questions about these Terms: <a href="mailto:legal@predicta.ng" className="text-[#AAFF00] hover:underline">legal@predicta.ng</a></p>
      </Section>
    </ContentPage>
  );
}
