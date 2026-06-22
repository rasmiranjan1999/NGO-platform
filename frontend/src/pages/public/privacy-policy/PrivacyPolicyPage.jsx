import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { HiArrowLeft, HiShieldCheck } from "react-icons/hi";
import { API_BASE } from "../../../config";

const PrivacyPolicyPage = () => {
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
              <HiShieldCheck className="w-5 h-5" />
            </div>
            <h1 className="text-2xl font-bold">Privacy Policy</h1>
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
            <h2 className="text-2xl font-bold text-[#122B22] mb-4">Introduction</h2>
            <p className="text-gray-700 leading-relaxed">
              {settings.ngo_name || "Baba Kshyameswar Swechha Sebi Sangathan"} ("we," "our," or "us") is committed to protecting your privacy. 
              This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit 
              our website and use our services.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-[#122B22] mb-4">Information We Collect</h2>
            <div className="space-y-4 text-gray-700">
              <div>
                <h3 className="text-xl font-semibold text-[#122B22] mb-2">Personal Information</h3>
                <p className="leading-relaxed">
                  We may collect personal information that you voluntarily provide when you:
                </p>
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  <li>Register as a member or volunteer</li>
                  <li>Contact us through our website</li>
                  <li>Subscribe to our newsletter</li>
                  <li>Participate in our activities or events</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-[#122B22] mb-2">Usage Information</h3>
                <p className="leading-relaxed">
                  We automatically collect certain information when you visit our website, including your IP address, 
                  browser type, operating system, and browsing behavior.
                </p>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-[#122B22] mb-4">How We Use Your Information</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We use the information we collect to:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>Process your membership or volunteer applications</li>
              <li>Communicate with you about our activities and events</li>
              <li>Send newsletters and updates (with your consent)</li>
              <li>Improve our website and services</li>
              <li>Respond to your inquiries and support requests</li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-[#122B22] mb-4">Information Sharing</h2>
            <p className="text-gray-700 leading-relaxed">
              We do not sell, trade, or rent your personal information to third parties. We may share your information only:
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-1 text-gray-700">
              <li>With your explicit consent</li>
              <li>To comply with legal obligations</li>
              <li>To protect our rights and safety</li>
              <li>With trusted service providers who assist us in operating our website</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-[#122B22] mb-4">Data Security</h2>
            <p className="text-gray-700 leading-relaxed">
              We implement appropriate technical and organizational measures to protect your personal information. 
              However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-[#122B22] mb-4">Your Rights</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              You have the right to:
            </p>
            <ul className="list-disc pl-6 space-y-1 text-gray-700">
              <li>Access your personal information</li>
              <li>Request correction of inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Opt-out of marketing communications</li>
              <li>Lodge a complaint with a supervisory authority</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-[#122B22] mb-4">Cookies</h2>
            <p className="text-gray-700 leading-relaxed">
              We use cookies and similar tracking technologies to enhance your experience on our website. 
              You can control cookie settings through your browser preferences.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-[#122B22] mb-4">Contact Us</h2>
            <p className="text-gray-700 leading-relaxed">
              If you have any questions about this Privacy Policy or our data practices, please contact us at:
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

export default PrivacyPolicyPage;
