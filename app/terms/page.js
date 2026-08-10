import LegalPage from "@/components/LegalPage";

export const metadata = {
  title: "Terms of Service",
  description: "The terms that govern your use of GrindSpot.",
  alternates: {
    canonical: "/terms",
  },
};

export default function TermsPage() {
  return (
    <LegalPage title="Terms of Service" lastUpdated="August 9, 2026">
      <p>
        Welcome to <strong>GrindSpot</strong> (“we,” “us,” or “our”),
        operated by <strong>Leonel Flores Ruiz</strong>, an individual
        residing in Guadalajara, Jalisco, Mexico. These Terms of Service
        (“Terms”) govern your access to and use of our web application
        located at <code>grind-spot.com</code> (the “Service”).
      </p>
      <p>
        By accessing or using GrindSpot, you agree to be bound by these
        Terms. If you do not agree, do not access or use the Service.
      </p>

      <hr />

      <h2>1. Description of Service</h2>
      <p>
        GrindSpot is a curated repository and discovery platform for remote
        work locations (e.g., coffee shops, libraries, restaurants,
        coworking spaces).
      </p>
      <ul>
        <li>Public users can view listed locations.</li>
        <li>
          Unlocking advanced features—such as applying location filters,
          viewing detailed venue metadata (operating hours, direct links,
          noise levels, quality/price ratios, and user-generated scores)—
          requires a one-time lifetime access purchase.
        </li>
      </ul>

      <h2>2. Accounts and Authentication</h2>
      <p>
        To access paid features or interact with the platform (e.g., liking
        spots or submitting spot suggestions), you must authenticate using
        your Google account via Google OAuth. You are responsible for
        maintaining the confidentiality of your account credentials and for
        all activities that occur under your account.
      </p>

      <h2>3. Payments, Lifetime Access, and Refund Policy</h2>

      <h3>3.1 One-Time Payment</h3>
      <p>
        Access to GrindSpot’s premium features requires a one-time payment
        of $350 MXN (or equivalent in your local currency as calculated at
        checkout). Payment processing is securely handled by our
        third-party payment processor, <strong>Stripe</strong>. We do not
        store or process your financial or credit card information
        directly.
      </p>

      <h3>3.2 Lifetime Access Definition</h3>
      <p>
        “Lifetime Access” grants you access to premium features for as long
        as GrindSpot remains commercially operational and available. We
        reserve the right to modify, update, or discontinue features of the
        Service at our discretion.
      </p>

      <h3>3.3 7-Day Money-Back Guarantee</h3>
      <p>
        We offer a 100% money-back guarantee within the first{" "}
        <strong>7 calendar days</strong> following your initial purchase.
      </p>
      <ul>
        <li>
          <strong>Refund Process:</strong> To request a refund, contact us
          at{" "}
          <a href="mailto:leonelfr212@gmail.com">leonelfr212@gmail.com</a>{" "}
          within 7 days of purchase.
        </li>
        <li>
          <strong>Access Revocation:</strong> Upon issuing a refund, your
          access to paid features will be revoked immediately.
        </li>
      </ul>

      <h2>4. User Interactions &amp; Spot Submissions</h2>
      <ul>
        <li>
          <strong>Liking Spots:</strong> Users may “like” spots. This data
          is aggregated to generate popularity scores across the platform.
        </li>
        <li>
          <strong>Submitting Requests:</strong> Users may request or suggest
          new spots to be added. GrindSpot reserves absolute discretion over
          whether to review, approve, or publish any requested spot.
          Submitting a suggestion does not grant you intellectual property
          rights or ownership over any published listing.
        </li>
      </ul>

      <h2>5. Intellectual Property &amp; Content</h2>
      <p>
        All text, graphics, user interfaces, visual interfaces,
        photographs, trademarks, logos, and computer code contained on the
        Service are owned, controlled, or licensed by Leonel Flores Ruiz.
        You may not copy, reproduce, republish, upload, post, publicly
        display, or distribute any part of the Service without our express
        prior written consent.
      </p>
      <p>
        Information regarding third-party locations (such as opening hours,
        addresses, and third-party Google Maps links) is provided for
        informational purposes only. GrindSpot does not claim ownership
        over third-party trademarks or brand names referenced.
      </p>

      <h2>6. Disclaimer of Warranties (“As Is”)</h2>
      <p>
        THE SERVICE IS PROVIDED ON AN “AS IS” AND “AS AVAILABLE” BASIS,
        WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING
        BUT NOT LIMITED TO IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS
        FOR A PARTICULAR PURPOSE, ACCURACY OF VENUE DATA, OR
        NON-INFRINGEMENT.
      </p>
      <p>WE DO NOT WARRANT THAT:</p>
      <ol>
        <li>
          THE SERVICE WILL BE UNINTERRUPTED, TIMELY, SECURE, OR ERROR-FREE.
        </li>
        <li>
          THE INFORMATION PROVIDED (SUCH AS CAFE HOURS, NOISE LEVELS, OR
          COWORKING AVAILABILITY) IS ACCURATE, COMPLETE, OR UP TO DATE.
          VENUE DETAILS CHANGE FREQUENTLY, AND USERS ARE ADVISED TO VERIFY
          DIRECTLY WITH THE VENUES.
        </li>
      </ol>

      <h2>7. Limitation of Liability</h2>
      <p>
        TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT SHALL
        LEONEL FLORES RUIZ, GRINDSPOT, OR ITS AFFILIATES BE LIABLE FOR ANY
        INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES,
        OR ANY LOSS OF PROFITS OR REVENUES, WHETHER INCURRED DIRECTLY OR
        INDIRECTLY, OR ANY LOSS OF DATA, USE, GOODWILL, OR OTHER INTANGIBLE
        LOSSES, RESULTING FROM:
      </p>
      <ul>
        <li>
          YOUR ACCESS TO OR USE OF OR INABILITY TO ACCESS OR USE THE
          SERVICE;
        </li>
        <li>ANY INACCURACIES IN VENUE INFORMATION;</li>
        <li>
          ANY CONDUCT OR CONTENT OF ANY THIRD PARTY ON OR RELATED TO THE
          SERVICE.
        </li>
      </ul>
      <p>
        IN NO EVENT SHALL OUR TOTAL AGGREGATE LIABILITY EXCEED THE AMOUNT
        YOU PAID TO US FOR THE SERVICE (UP TO $350 MXN).
      </p>

      <h2>8. Governing Law and Jurisdiction</h2>
      <p>
        These Terms shall be governed by and construed in accordance with
        the laws of <strong>Federal Law of Mexico and the state laws of
        Jalisco, Mexico</strong>, without regard to its conflict of law
        principles. Any dispute arising from these Terms or the Service
        shall be subject to the exclusive jurisdiction of the state and
        federal courts located in{" "}
        <strong>Guadalajara, Jalisco, Mexico</strong>.
      </p>

      <h2>9. Changes to Terms</h2>
      <p>
        We reserve the right to modify these Terms at any time. Updated
        versions will be posted on this page with an updated “Last
        Updated” date. Continued use of the Service after changes take
        effect constitutes acceptance of the new Terms.
      </p>

      <h2>10. Contact Information</h2>
      <p>For any questions regarding these Terms, please contact us at:</p>
      <ul>
        <li>
          <strong>Data Controller / Owner:</strong> Leonel Flores Ruiz
        </li>
        <li>
          <strong>Location:</strong> Guadalajara, Jalisco, Mexico
        </li>
        <li>
          <strong>Support Email:</strong>{" "}
          <a href="mailto:leonelfr212@gmail.com">leonelfr212@gmail.com</a>
        </li>
      </ul>
    </LegalPage>
  );
}
