import LegalPage from "@/components/LegalPage";

export const metadata = {
  title: "Privacy Policy",
  description: "How GrindSpot collects, uses, and protects your data.",
  alternates: {
    canonical: "/privacy",
  },
};

export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy Policy" lastUpdated="August 9, 2026">
      <p>
        This Privacy Policy describes how <strong>GrindSpot</strong> (“we,”
        “us,” or “our”), operated by <strong>Leonel Flores Ruiz</strong>{" "}
        (based in Guadalajara, Jalisco, Mexico), collects, uses, and
        discloses your personal information when you use our web
        application located at <code>grind-spot.com</code> (the “Service”).
      </p>
      <p>
        We are committed to complying with applicable data protection laws,
        including the <strong>General Data Protection Regulation (GDPR)</strong>{" "}
        for European Union users, the{" "}
        <strong>California Consumer Privacy Act (CCPA)</strong> for
        California residents, and Mexico’s{" "}
        <strong>
          Ley Federal de Protección de Datos Personales en Posesión de los
          Particulares (LFPDPPP)
        </strong>
        .
      </p>

      <hr />

      <h2>1. Information We Collect</h2>

      <h3>1.1 Personal Information You Provide Directly</h3>
      <p>
        When you sign in to GrindSpot using Google OAuth, we collect:
      </p>
      <ul>
        <li>
          <strong>Full Name</strong>
        </li>
        <li>
          <strong>Email Address</strong>
        </li>
        <li>
          <strong>Google Profile Picture URL</strong>
        </li>
      </ul>

      <h3>1.2 Automatically Collected Information</h3>
      <p>
        When you access the Service, our infrastructure (e.g., Railway,
        CDN/Edge services) and analytics tools may collect non-direct
        identifiers:
      </p>
      <ul>
        <li>
          <strong>Technical Log Data:</strong> IP address (processed
          temporarily for server security, routing, and traffic
          management), browser type, operating system, and device
          information.
        </li>
        <li>
          <strong>Usage Data:</strong> Pages visited, interaction data
          (such as spots liked or requested), and referral sources.
        </li>
      </ul>

      <h3>1.3 Payment Information</h3>
      <p>
        Payments are handled entirely by <strong>Stripe</strong>. We do not
        collect, store, or process your credit card numbers or banking
        details. Stripe provides us only with confirmation of payment
        completion and basic transactional metadata.
      </p>

      <h2>2. How We Use Your Information</h2>
      <p>We process your data for the following lawful purposes:</p>
      <ul>
        <li>
          <strong>Account Creation and Authentication:</strong> To verify
          your identity via Google OAuth and grant access to lifetime
          features.
        </li>
        <li>
          <strong>Service Operation:</strong> To allow you to interact with
          the app (e.g., saving preferences, liking spots, requesting new
          spots).
        </li>
        <li>
          <strong>Customer Support &amp; Communication:</strong> To process
          refund requests, send transaction receipts, or respond to legal
          and support inquiries.
        </li>
        <li>
          <strong>Analytics &amp; Improvements:</strong> To understand
          platform usage and optimize performance using privacy-focused
          analytics tools (Datafast).
        </li>
        <li>
          <strong>Security &amp; Fraud Prevention:</strong> To protect our
          platform from abuse or unauthorized activity.
        </li>
      </ul>

      <h2>3. Third-Party Service Providers</h2>
      <p>
        We share data with trusted third-party service providers necessary
        to operate the Service:
      </p>
      <div className="overflow-x-auto">
        <table>
          <thead>
            <tr>
              <th>Provider</th>
              <th>Purpose</th>
              <th>Data Shared / Processed</th>
              <th>Location / Link</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <strong>Google OAuth</strong>
              </td>
              <td>Authentication &amp; Login</td>
              <td>Name, Email, Profile Picture</td>
              <td>USA</td>
            </tr>
            <tr>
              <td>
                <strong>Stripe</strong>
              </td>
              <td>Payment Processing</td>
              <td>Email, Transaction Data</td>
              <td>USA</td>
            </tr>
            <tr>
              <td>
                <strong>Railway</strong>
              </td>
              <td>Web Application Hosting</td>
              <td>Server Logs, IP Addresses</td>
              <td>USA</td>
            </tr>
            <tr>
              <td>
                <strong>Datafast</strong>
              </td>
              <td>Privacy-focused Analytics</td>
              <td>Anonymized Usage Data, Device Info</td>
              <td>EU / USA</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p>
        <em>
          Note: All service providers are bound by strict confidentiality
          and data protection obligations.
        </em>
      </p>

      <h2>4. International Data Transfers</h2>
      <p>
        Your personal data may be transferred to and processed in countries
        outside your country of residence (including the United States and
        Mexico), where data protection laws may differ. We take necessary
        steps to ensure that adequate safeguards are in place to protect
        your data.
      </p>

      <h2>5. Your Rights &amp; Data Choices</h2>
      <p>
        Depending on your jurisdiction (e.g., GDPR, CCPA, ARCO rights under
        Mexican law), you have the following rights regarding your
        personal data:
      </p>
      <ul>
        <li>
          <strong>Access:</strong> Request a copy of the personal data we
          hold about you.
        </li>
        <li>
          <strong>Rectification:</strong> Request correction of inaccurate
          personal data.
        </li>
        <li>
          <strong>Deletion (Right to be Forgotten):</strong> Request the
          deletion of your personal account and associated data.
        </li>
        <li>
          <strong>Objection &amp; Restriction:</strong> Request that we
          restrict or stop processing your data.
        </li>
        <li>
          <strong>Data Portability:</strong> Request your personal data in
          a structured, machine-readable format.
        </li>
        <li>
          <strong>Non-Discrimination:</strong> (CCPA) We will not
          discriminate against you for exercising your privacy rights.
        </li>
      </ul>
      <p>
        To exercise any of these rights, please email us at{" "}
        <a href="mailto:leonelfr212@gmail.com">leonelfr212@gmail.com</a>. We
        will respond within 30 days.
      </p>

      <h2>6. Data Retention</h2>
      <p>
        We retain your personal data (Name, Email, Profile Picture, and
        purchase history) for as long as your account remains active or as
        needed to maintain your lifetime access privileges, fulfill legal
        requirements, or resolve disputes. You may request account
        deletion at any time.
      </p>

      <h2>7. Security</h2>
      <p>
        We take reasonable technical and organizational measures to protect
        your personal data against loss, theft, misuse, and unauthorized
        access. However, no internet transmission or electronic storage
        method is 100% secure.
      </p>

      <h2>8. Children’s Privacy</h2>
      <p>
        GrindSpot is not intended for children under the age of 16 (or 13
        in the United States). We do not knowingly collect personal data
        from children. If you believe a child has provided us with
        personal information, please contact us immediately for deletion.
      </p>

      <h2>9. Contact Us</h2>
      <p>
        If you have questions, concerns, or requests regarding this
        Privacy Policy or ARCO/GDPR/CCPA compliance, please contact:
      </p>
      <ul>
        <li>
          <strong>Data Controller:</strong> Leonel Flores Ruiz
        </li>
        <li>
          <strong>Address:</strong> Guadalajara, Jalisco, Mexico
        </li>
        <li>
          <strong>Email:</strong>{" "}
          <a href="mailto:leonelfr212@gmail.com">leonelfr212@gmail.com</a>
        </li>
      </ul>
    </LegalPage>
  );
}
