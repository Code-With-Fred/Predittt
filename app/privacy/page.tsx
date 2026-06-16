import type { Metadata } from 'next';
import ContentPage, { Section } from '@/components/ContentPage';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'How Predicta.ng collects, uses, and protects your personal data.',
};

export default function PrivacyPage() {
  return (
    <ContentPage
      title="Privacy Policy"
      subtitle="Last updated: June 2026"
    >
      <Section title="1. Who we are">
        <p>Predicta.ng is a football predictions platform. This policy explains how we collect and use your data when you use our services. For questions, contact <a href="mailto:privacy@predicta.ng" className="text-[#AAFF00] hover:underline">privacy@predicta.ng</a>.</p>
      </Section>

      <Section title="2. Data we collect">
        <p><strong className="text-white/80">Account data:</strong> email address, display name, and password (hashed) when you register.</p>
        <p><strong className="text-white/80">Payment data:</strong> payment is processed by Paystack; we do not store card numbers. We receive a transaction reference and subscription status.</p>
        <p><strong className="text-white/80">Usage data:</strong> pages visited, predictions viewed, features used. This is collected in aggregate to improve the Platform.</p>
        <p><strong className="text-white/80">Device data:</strong> browser type, OS, screen resolution, and IP address for security and analytics.</p>
        <p><strong className="text-white/80">Cookies:</strong> we use a session cookie (essential) and optional analytics cookies. You can manage these in your browser settings.</p>
      </Section>

      <Section title="3. How we use your data">
        <p>We use your data to: provide and personalise the service; process payments; send account and pick notifications (if opted in); prevent fraud and abuse; improve our models and product. We do not sell your personal data to third parties.</p>
      </Section>

      <Section title="4. Affiliate links">
        <p>Our bookmaker links are affiliate links. When you click them, the bookmaker may set their own cookies and collect data under their own privacy policy. We receive an anonymised commission signal when you register or deposit. We do not share your identity with bookmakers.</p>
      </Section>

      <Section title="5. Data retention">
        <p>We retain your account data for as long as your account is active, plus 2 years thereafter for legal and audit purposes. Prediction history is retained indefinitely as part of our public track record (it contains no personal data).</p>
      </Section>

      <Section title="6. Your rights">
        <p>You may request access to, correction of, or deletion of your personal data at any time by emailing <a href="mailto:privacy@predicta.ng" className="text-[#AAFF00] hover:underline">privacy@predicta.ng</a>. We will respond within 30 days.</p>
      </Section>

      <Section title="7. Security">
        <p>We use industry-standard security measures including TLS encryption in transit and encrypted storage at rest. Passwords are hashed using bcrypt. We conduct regular security reviews.</p>
      </Section>

      <Section title="8. Changes to this policy">
        <p>We may update this policy. Material changes will be communicated by email or prominent in-app notice. Continued use after changes constitutes acceptance.</p>
      </Section>
    </ContentPage>
  );
}
