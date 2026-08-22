import LegalPage from "@/components/LegalPage";

export const metadata = {
  title: "Cookie Policy",
  description: "How GrindSpot uses cookies and similar technologies.",
  alternates: {
    canonical: "/cookies",
  },
};

export default function CookiesPage() {
  return (
    <LegalPage title="Cookie Policy" lastUpdated="August 9, 2026">
      <p>
        This Cookie Policy explains how <strong>GrindSpot</strong> (“we,”
        “us,” or “our”) uses cookies and similar technologies (such as
        local storage) when you visit our web application at{" "}
        <code>grind-spot.com</code>.
      </p>

      <hr />

      <h2>1. What Are Cookies?</h2>
      <p>
        Cookies are small text files stored on your device (computer,
        tablet, or mobile) by your web browser when you visit a website.
        They allow the site to remember your actions, login status, and
        preferences over time.
      </p>

      <h2>2. Types of Cookies We Use</h2>
      <p>
        We use cookies and local storage for essential operations,
        analytics, and marketing purposes:
      </p>

      <h3>A. Strictly Necessary / Essential Cookies</h3>
      <p>
        These cookies are required for the website to function properly.
        Without them, core features such as authentication cannot be
        provided.
      </p>
      <ul>
        <li>
          <strong>Auth.js (NextAuth / Google OAuth):</strong> Used to
          maintain your authenticated login session securely across pages.
        </li>
        <li>
          <strong>Duration:</strong> Session or Persistent (up to 30 days).
        </li>
      </ul>

      <h3>B. Analytical and Performance Cookies</h3>
      <p>
        These cookies collect information about how visitors use our
        website, enabling us to measure traffic, popular spots, and
        performance.
      </p>
      <ul>
        <li>
          <strong>Datafast Analytics:</strong> Collects privacy-focused
          usage metrics without profiling individual users across external
          sites.
        </li>
        <li>
          <strong>Duration:</strong> Persistent.
        </li>
      </ul>

      <h3>C. Marketing &amp; Advertising Cookies (Third-Party)</h3>
      <p>
        We may place tracking pixels or marketing cookies (e.g., Meta
        Pixel, Google Tag Manager) to measure the effectiveness of social
        media ad campaigns and display relevant ads for GrindSpot to
        prospective users.
      </p>
      <ul>
        <li>
          <strong>Duration:</strong> Varies by provider (typically 30 days
          to 2 years).
        </li>
      </ul>

      <h2>3. How to Manage and Disable Cookies</h2>
      <p>
        You have the right to accept or decline non-essential cookies. You
        can control cookie preferences in the following ways:
      </p>

      <h3>3.1 Browser Settings</h3>
      <p>
        Most browsers allow you to block or delete cookies through their
        settings:
      </p>
      <ul>
        <li>
          <strong>Chrome:</strong> Settings &gt; Privacy and Security &gt;
          Cookies and other site data
        </li>
        <li>
          <strong>Firefox:</strong> Options &gt; Privacy &amp; Security
          &gt; Cookies and Site Data
        </li>
        <li>
          <strong>Safari:</strong> Preferences &gt; Privacy &gt; Cookies
          and website data
        </li>
      </ul>
      <p>
        <em>
          Note: Disabling essential authentication cookies (Auth.js) will
          prevent you from signing in to your GrindSpot account.
        </em>
      </p>

      <h2>4. Updates to This Cookie Policy</h2>
      <p>
        We may update this Cookie Policy from time to time to reflect
        changes in the cookies we use or for operational, legal, or
        regulatory reasons.
      </p>

      <h2>5. Contact Us</h2>
      <ul>
        <li>
          <strong>Email:</strong>{" "}
          <a href="mailto:leonelfr212@gmail.com" className="cursor-pointer">
            leonelfr212@gmail.com
          </a>
        </li>
        <li>
          <strong>Location:</strong> Guadalajara, Jalisco, Mexico
        </li>
      </ul>
    </LegalPage>
  );
}
