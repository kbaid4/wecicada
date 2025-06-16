import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

const PrivacyPolicy = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="prose max-w-none">
        <h1 className="text-3xl font-bold mb-8">Privacy Policy</h1>
        
        <p className="text-gray-600 mb-8">
          Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
          <p className="mb-4">
            Welcome to our website. We are committed to protecting your personal data and your right to privacy. 
            This Privacy Policy explains how we collect, use, and protect your personal information when you visit our website.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">2. Data We Collect</h2>
          <h3 className="text-xl font-medium mb-2">2.1 Personal Data</h3>
          <p className="mb-4">
            We may collect the following personal information:
          </p>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>Name and contact information (email, phone number)</li>
            <li>Account credentials</li>
            <li>Billing and payment information</li>
            <li>Preferences and interests</li>
          </ul>
          
          <h3 className="text-xl font-medium mb-2 mt-6">2.2 Usage Data</h3>
          <p className="mb-4">
            We automatically collect information about how you interact with our website, including:
          </p>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>IP address and device information</li>
            <li>Browser type and version</li>
            <li>Pages visited and time spent on pages</li>
            <li>Referring website addresses</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">3. How We Use Your Data</h2>
          <p className="mb-4">We use your personal data for the following purposes:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>To provide and maintain our service</li>
            <li>To notify you about changes to our service</li>
            <li>To allow you to participate in interactive features</li>
            <li>To provide customer support</li>
            <li>To gather analysis or valuable information to improve our service</li>
            <li>To monitor the usage of our service</li>
            <li>To detect, prevent, and address technical issues</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">4. Cookies and Tracking</h2>
          <p className="mb-4">
            We use cookies and similar tracking technologies to track activity on our website and hold certain information.
            You can set your browser to refuse all or some browser cookies, but this may limit your ability to use certain features.
          </p>
          <h3 className="text-xl font-medium mb-2 mt-6">4.1 Types of Cookies We Use</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Essential Cookies:</strong> Necessary for the website to function</li>
            <li><strong>Analytics Cookies:</strong> Help us understand how visitors interact with our website</li>
            <li><strong>Marketing Cookies:</strong> Used to track visitors across websites for marketing purposes</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">5. Data Sharing and Disclosure</h2>
          <p className="mb-4">
            We may share your personal data with:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Service providers who perform services on our behalf</li>
            <li>Business partners for joint offerings</li>
            <li>Law enforcement or government agencies when required by law</li>
            <li>Other parties in connection with a business transaction</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">6. Your Data Protection Rights</h2>
          <p className="mb-4">
            Depending on your location, you may have the following rights regarding your personal data:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>The right to access, update, or delete your information</li>
            <li>The right to rectification of inaccurate information</li>
            <li>The right to object to our processing of your data</li>
            <li>The right to request restriction of processing</li>
            <li>The right to data portability</li>
            <li>The right to withdraw consent</li>
          </ul>
          <p className="mt-4">
            To exercise these rights, please contact us at [Your Contact Information].
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">7. Data Security</h2>
          <p>
            We implement appropriate technical and organizational measures to protect your personal data against unauthorized or unlawful processing, accidental loss, destruction, or damage.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">8. Changes to This Privacy Policy</h2>
          <p>
            We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">9. Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, please contact us at:
          </p>
          <address className="not-italic mt-2">
            [Your Company Name]<br />
            [Your Address]<br />
            [City, State, ZIP Code]<br />
            Email: [Your Email]<br />
            Phone: [Your Phone Number]
          </address>
        </section>

        <div className="mt-12 pt-6 border-t border-gray-200">
          <Link to="/" className="text-blue-600 hover:underline">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
