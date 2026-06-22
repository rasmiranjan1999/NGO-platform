import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { HiArrowLeft, HiDocumentText } from "react-icons/hi";
import { API_BASE } from "../../../config";

const TermsOfServicePage = () => {
  const [settings, setSettings] = useState({});

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/settings`);
      const data = await response.json();
      setSettings(data.data || {});
    } catch (error) {
      console.error("Error fetching settings:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header - Minimized */}
      <div className="bg-gradient-to-r from-[#122B22] to-[#1F4D3D] text-white py-6">
        <div className="max-w-4xl mx-auto px-6">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-xs text-gray-300 hover:text-white transition-colors mb-3"
          >
            <HiArrowLeft className="w-3 h-3" />
            Back to Home
          </Link>
          
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center">
              <HiDocumentText className="w-5 h-5" />
            </div>
            <h1 className="text-2xl font-bold">Terms of Service</h1>
          </div>
          
          <p className="text-xs text-gray-300">
            Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="prose prose-lg max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-[#122B22] mb-4">Agreement to Terms</h2>
            <p className="text-gray-700 leading-relaxed">
              By accessing and using the website of {settings.ngo_name || "Baba Kshyameswar Swechha Sebi Sangathan"}, you agree to be bound by 
              these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, 
              you are prohibited from using or accessing this site.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-[#122B22] mb-4">Use License</h2>
            <div className="space-y-4 text-gray-700">
              <p className="leading-relaxed">
                Permission is granted to temporarily access the materials on our website for personal, non-commercial use only. 
                This is the grant of a license, not a transfer of title, and under this license you may not:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Modify or copy the materials</li>
                <li>Use the materials for any commercial purpose</li>
                <li>Attempt to reverse engineer any software contained on our website</li>
                <li>Remove any copyright or proprietary notations from the materials</li>
                <li>Transfer the materials to another person or "mirror" the materials on any other server</li>
              </ul>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-[#122B22] mb-4">User Accounts</h2>
            <div className="space-y-4 text-gray-700">
              <p className="leading-relaxed">
                When you create an account with us, you are responsible for:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Maintaining the confidentiality of your account credentials</li>
                <li>All activities that occur under your account</li>
                <li>Providing accurate and complete information</li>
                <li>Updating your information to keep it accurate</li>
                <li>Notifying us immediately of any unauthorized use</li>
              </ul>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-[#122B22] mb-4">Membership and Volunteer Terms</h2>
            <div className="space-y-4 text-gray-700">
              <p className="leading-relaxed">
                As a member or volunteer of our organization:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>You agree to uphold the values and mission of our organization</li>
                <li>You will conduct yourself professionally and ethically</li>
                <li>You will respect the privacy and rights of other members and beneficiaries</li>
                <li>You understand that membership may be revoked for violations of these terms</li>
              </ul>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-[#122B22] mb-4">Donations and Payments</h2>
            <p className="text-gray-700 leading-relaxed">
              All donations are voluntary and non-refundable unless required by law. We reserve the right to refuse or 
              return any donation. Payment information is processed securely, and we do not store sensitive financial data.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-[#122B22] mb-4">Intellectual Property</h2>
            <p className="text-gray-700 leading-relaxed">
              All content on this website, including but not limited to text, graphics, logos, images, and software, 
              is the property of {settings.ngo_name || "Baba Kshyameswar Swechha Sebi Sangathan"} and is protected by copyright and other 
              intellectual property laws.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-[#122B22] mb-4">Prohibited Activities</h2>
            <div className="space-y-4 text-gray-700">
              <p className="leading-relaxed">
                You agree not to:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Use the website in any way that violates any applicable laws</li>
                <li>Engage in any conduct that restricts or inhibits anyone's use of the website</li>
                <li>Transmit any viruses, malware, or harmful code</li>
                <li>Impersonate any person or entity</li>
                <li>Harass, abuse, or harm other users</li>
                <li>Collect or harvest information about other users</li>
              </ul>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-[#122B22] mb-4">Disclaimer</h2>
            <p className="text-gray-700 leading-relaxed">
              The materials on our website are provided on an 'as is' basis. We make no warranties, expressed or implied, 
              and hereby disclaim all other warranties including, without limitation, implied warranties or conditions of 
              merchantability, fitness for a particular purpose, or non-infringement of intellectual property.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-[#122B22] mb-4">Limitation of Liability</h2>
            <p className="text-gray-700 leading-relaxed">
              In no event shall {settings.ngo_name || "Baba Kshyameswar Swechha Sebi Sangathan"} or its suppliers be liable for any damages 
              arising out of the use or inability to use the materials on our website.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-[#122B22] mb-4">Changes to Terms</h2>
            <p className="text-gray-700 leading-relaxed">
              We reserve the right to revise these Terms of Service at any time. By using this website, you agree to be 
              bound by the current version of these terms. We encourage you to review these terms periodically.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-[#122B22] mb-4">Governing Law</h2>
            <p className="text-gray-700 leading-relaxed">
              These terms and conditions are governed by and construed in accordance with the laws of India, and you 
              irrevocably submit to the exclusive jurisdiction of the courts in that location.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-[#122B22] mb-4">Contact Information</h2>
            <p className="text-gray-700 leading-relaxed">
              If you have any questions about these Terms of Service, please contact us:
            </p>
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <p className="font-semibold text-[#122B22]">{settings.ngo_name || "Baba Kshyameswar Swechha Sebi Sangathan"}</p>
              <p className="text-gray-700 mt-2">
                <Link to="/contact" className="text-[#FF6B4A] hover:underline">
                  Visit our Contact Page
                </Link>
              </p>
            </div>
          </section>

          {/* Developer Credit */}
          <section className="mt-12 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500 text-center">
              Website developed by <span className="text-[#D98E32] font-semibold">Rasmi Ranjan Senapati</span>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default TermsOfServicePage;
