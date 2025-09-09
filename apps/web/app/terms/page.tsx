import React from "react";

const TermsAndConditions: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto p-6 text-gray-800">
      <h1 className="text-3xl font-bold mb-2">Terms and Conditions</h1>
      <p className="mb-4">
        <strong>Effective Date:</strong> Sep 9, 2025
      </p>
      <p className="mb-4">
        Welcome to <strong>Study Spot</strong>. These Terms and Conditions govern
        your use of our website and services, including uploading, viewing, and
        interacting with school-related documents and AI-powered tools
        (“Services”). By accessing or using Study Spot, you agree to be bound by
        these Terms.
      </p>
      <p className="mb-6">
        If you do not agree to these Terms, please do not use our Services.
      </p>

      <Section title="1. Eligibility">
        <p>
          You must be at least 13 years old to use Study Spot. By using our
          platform, you represent that you meet this requirement and agree to
          comply with all applicable laws and regulations.
        </p>
      </Section>

      <Section title="2. User Accounts">
        <p>To use certain features of Study Spot, you may be required to create an account. You agree to:</p>
        <ul className="list-disc pl-6">
          <li>Provide accurate and complete information.</li>
          <li>Keep your login credentials secure.</li>
          <li>Accept responsibility for all activities under your account.</li>
        </ul>
        <p>
          We reserve the right to suspend or terminate your account for
          violations of these Terms.
        </p>
      </Section>

      <Section title="3. User Content">
        <p>
          You may upload documents such as notes, study guides, and other
          academic materials (“User Content”). By uploading content, you confirm
          that:
        </p>
        <ul className="list-disc pl-6">
          <li>You own or have permission to share the content.</li>
          <li>
            It does not violate intellectual property laws or any applicable
            regulations.
          </li>
          <li>It is not harmful, misleading, or inappropriate.</li>
        </ul>
        <p>
          You retain ownership of your content but grant Study Spot a worldwide,
          non-exclusive, royalty-free license to store, process, display, and
          use it to provide and improve the Services, including enhancing our AI
          systems.
        </p>
      </Section>

      <Section title="4. Content Sharing and Viewing">
        <p>Uploaded content may be viewable by other users. You agree not to:</p>
        <ul className="list-disc pl-6">
          <li>Redistribute or plagiarize content without permission.</li>
          <li>Misuse or misrepresent documents authored by others.</li>
        </ul>
        <p>We are not responsible for the accuracy or quality of user-submitted content.</p>
      </Section>

      <Section title="5. Use of AI">
        <p>Study Spot uses artificial intelligence to analyze uploaded content and improve response quality. By using the platform, you consent to:</p>
        <ul className="list-disc pl-6">
          <li>The processing of your documents by our AI tools.</li>
          <li>Their use in generating contextualized responses for all users.</li>
          <li>Internal improvements to our machine learning models.</li>
        </ul>
        <p>We do not share your content with external AI services without your explicit permission.</p>
      </Section>

      <Section title="6. Prohibited Conduct">
        <p>You agree not to use Study Spot to:</p>
        <ul className="list-disc pl-6">
          <li>Upload or distribute copyrighted material without authorization.</li>
          <li>Post offensive, illegal, or misleading content.</li>
          <li>Engage in scraping, reverse-engineering, or unauthorized data collection.</li>
          <li>Disrupt or harm the platform or its users.</li>
        </ul>
      </Section>

      <Section title="7. Content Moderation">
        <p>
          We reserve the right to remove, edit, or restrict access to any
          content that violates these Terms or poses a risk to users or the
          platform.
        </p>
      </Section>

      <Section title="8. Privacy">
        <p>
          Your privacy matters to us. Please review our Privacy Policy for
          information on how we collect, use, and protect your personal data.
        </p>
      </Section>

      <Section title="9. Termination">
        <p>
          We may suspend or terminate your access to Study Spot at our sole
          discretion, with or without notice, especially for violations of these
          Terms or misuse of the platform.
        </p>
      </Section>

      <Section title="10. Disclaimers">
        <p>Study Spot is provided "as is" without warranties of any kind. We do not guarantee that:</p>
        <ul className="list-disc pl-6">
          <li>Uploaded content is accurate or helpful.</li>
          <li>The AI will always provide correct or complete responses.</li>
        </ul>
        <p>Use of the platform is at your own risk.</p>
      </Section>

      <Section title="11. Limitation of Liability">
        <p>
          To the maximum extent permitted by law, Study Spot and its team are
          not liable for any indirect, incidental, or consequential damages
          resulting from your use of our Services.
        </p>
      </Section>

      <Section title="12. Changes to These Terms">
        <p>
          We may revise these Terms periodically. Your continued use of Study
          Spot after any changes means you accept the updated Terms.
        </p>
      </Section>

      <Section title="13. Contact Us">
        <p>
          For questions about these Terms, please contact us at: <br />
          📧 <a href="mailto:tim@waldin.net" className="text-blue-600">tim@waldin.net</a>
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

export default TermsAndConditions;
