import React from "react";

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto p-6 text-gray-800">
      <h1 className="text-3xl font-bold mb-2">Privacy Policy</h1>
      <p className="mb-4">
        <strong>Effective Date:</strong> Sep 9, 2025
      </p>
      <p className="mb-6">
        At <strong>Study Spot</strong> (“we,” “our,” or “us”), your privacy is
        important to us. This Privacy Policy explains how we collect, use, and
        protect your information when you use our website and services
        (“Services”).
      </p>
      <p className="mb-6">
        By using Study Spot, you agree to the practices described in this
        Privacy Policy.
      </p>

      <Section title="1. Information We Collect">
        <p>When you create an account or use our Services, we may collect:</p>
        <ul className="list-disc pl-6">
          <li>Name</li>
          <li>Email address</li>
          <li>Profile picture</li>
          <li>Uploaded documents (such as notes, study guides, and school materials)</li>
        </ul>
        <p>
          We do not collect sensitive information such as government IDs,
          financial data (beyond payment processing), or biometric data.
        </p>
      </Section>

      <Section title="2. How We Use Your Information">
        <p>We use your information to:</p>
        <ul className="list-disc pl-6">
          <li>Provide, maintain, and improve the Services.</li>
          <li>Authenticate and manage your account.</li>
          <li>Process payments through Stripe.</li>
          <li>Allow you to upload, view, and share documents.</li>
          <li>Provide context for AI-powered responses.</li>
          <li>Ensure platform safety and prevent misuse.</li>
        </ul>
      </Section>

      <Section title="3. Uploaded Documents">
        <p>Uploaded documents are used only for:</p>
        <ul className="list-disc pl-6">
          <li>Sharing with other Study Spot users.</li>
          <li>Contextual understanding for AI responses.</li>
        </ul>
        <p>
          We do <strong>not</strong> share uploaded documents with any
          third-party AI providers or sell your content.
        </p>
      </Section>

      <Section title="4. Third-Party Services">
        <p>We use trusted third-party providers to operate Study Spot:</p>
        <ul className="list-disc pl-6">
          <li>Clerk for authentication and billing.</li>
          <li>Stripe for secure payment processing.</li>
          <li>Cloudflare for hosting and infrastructure.</li>
        </ul>
        <p>
          These providers may process limited data necessary to deliver their
          services, subject to their own privacy policies.
        </p>
      </Section>

      <Section title="5. Data Sharing">
        <p>
          We do <strong>not</strong> sell, rent, or share your personal
          information with advertisers, partners, or external organizations
          outside of Study Spot.
        </p>
      </Section>

      <Section title="6. Data Retention & Deletion">
        <ul className="list-disc pl-6">
          <li>You may request deletion of your account and data at any time.</li>
          <li>
            When requested, we will permanently remove your profile, uploaded
            documents, and personal information from our systems (subject to
            legal or regulatory retention requirements).
          </li>
        </ul>
      </Section>

      <Section title="7. Security">
        <p>
          We use <strong>Cloudflare servers</strong> and industry-standard
          security practices to protect your data. However, no system is 100%
          secure, and we cannot guarantee absolute security.
        </p>
      </Section>

      <Section title="8. International Users">
        <p>
          Our Services are hosted in the <strong>United States</strong>. If you
          are accessing Study Spot from outside the US, you consent to the
          transfer and storage of your information in the US.
        </p>
      </Section>

      <Section title="9. Children’s Privacy">
        <p>
          Study Spot is not directed to children under 13. Users must be at
          least 13 years old to use our Services.
        </p>
      </Section>

      <Section title="10. Updates to This Privacy Policy">
        <p>
          We may update this Privacy Policy periodically. When we make changes,
          we will revise the “Effective Date” at the top. Your continued use of
          the Services after updates means you accept the revised Privacy
          Policy.
        </p>
      </Section>

      <Section title="11. Contact Us">
        <p>
          If you have questions about this Privacy Policy or your data, contact
          us at: <br />
          📧{" "}
          <a href="mailto:tim@waldin.net" className="text-blue-600">
            tim@waldin.net
          </a>
        </p>
      </Section>
    </div>
  );
};

interface SectionProps {
  title: string;
  children: React.ReactNode;
}

const Section: React.FC<SectionProps> = ({ title, children }) => (
  <section className="mb-6">
    <h2 className="text-xl font-semibold mb-2">{title}</h2>
    {children}
  </section>
);

export default PrivacyPolicy;
