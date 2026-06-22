import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const ThankYouPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get the source from the URL state (either 'volunteer' or 'contact')
  const source = location.state?.source || 'contact';

  useEffect(() => {
    // Auto-redirect to home after 10 seconds
    const timer = setTimeout(() => {
      navigate("/");
    }, 10000);

    return () => clearTimeout(timer);
  }, [navigate]);

  const messages = {
    volunteer: {
      title: "Volunteer Application Submitted!",
      subtitle: "Thank you for your interest in joining our community",
      description: "We've received your volunteer application and we're excited about your interest in making a difference! Our team will carefully review your application and get back to you within 3-5 business days.",
      icon: (
        <svg className="w-20 h-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      nextSteps: [
        "Our volunteer coordinator will review your application",
        "You'll receive an email with next steps within 3-5 business days",
        "Keep an eye on your inbox (including spam folder)",
        "We may contact you for a brief interview or orientation"
      ]
    },
    contact: {
      title: "Message Sent Successfully!",
      subtitle: "Thank you for reaching out to us",
      description: "We've received your message and appreciate you taking the time to contact us. Our team typically responds within 24-48 hours during business days.",
      icon: (
        <svg className="w-20 h-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      nextSteps: [
        "Your message has been forwarded to the appropriate team",
        "We'll review your inquiry and respond as soon as possible",
        "Check your email for our response (including spam folder)",
        "For urgent matters, feel free to call us directly"
      ]
    }
  };

  const currentMessage = messages[source];

  return (
    <div className="w-full font-body text-[#2D2A26] bg-gradient-to-b from-[#FFFDF9] via-white to-[#F7F5F0] selection:bg-[#FF6B4A] selection:text-white min-h-screen flex items-center justify-center py-12 px-6">
      <style>{`
        .font-body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif; }
        .font-display { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif; }
        
        @keyframes checkmark {
          0% { stroke-dashoffset: 100; }
          100% { stroke-dashoffset: 0; }
        }
        
        @keyframes scaleIn {
          0% { transform: scale(0); opacity: 0; }
          50% { transform: scale(1.1); }
          100% { transform: scale(1); opacity: 1; }
        }
        
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-checkmark {
          stroke-dasharray: 100;
          stroke-dashoffset: 100;
          animation: checkmark 0.8s ease-out 0.3s forwards;
        }
        
        .animate-scale-in {
          animation: scaleIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        
        .animate-fade-in-up {
          animation: fadeInUp 0.6s ease-out forwards;
        }
        
        .gradient-text {
          background: linear-gradient(135deg, #FF6B4A 0%, #D98E32 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
      `}</style>

      <div className="w-full max-w-3xl">
        <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
          {/* Success Icon */}
          <div className="bg-gradient-to-br from-[#122B22] via-[#16362B] to-[#0A1813] text-white py-16 px-8 text-center relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 left-0 w-64 h-64 bg-[#4ABFA8] rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 right-0 w-64 h-64 bg-[#D98E32] rounded-full blur-3xl"></div>
            </div>

            <div className="relative z-10">
              {/* Animated Checkmark Circle */}
              <div className="w-32 h-32 mx-auto mb-6 relative animate-scale-in">
                <div className="absolute inset-0 bg-gradient-to-br from-[#4ABFA8] to-[#3A9B88] rounded-full"></div>
                <div className="absolute inset-2 bg-[#122B22] rounded-full flex items-center justify-center">
                  <svg className="w-16 h-16 text-[#4ABFA8]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path className="animate-checkmark" strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>

              <h1 className="font-display font-bold text-3xl md:text-4xl mb-3 animate-fade-in-up" style={{animationDelay: '0.5s', opacity: 0, animationFillMode: 'forwards'}}>
                {currentMessage.title}
              </h1>
              <p className="text-lg text-white/80 animate-fade-in-up" style={{animationDelay: '0.7s', opacity: 0, animationFillMode: 'forwards'}}>
                {currentMessage.subtitle}
              </p>
            </div>
          </div>

          {/* Content */}
          <div className="p-8 md:p-12">
            <div className="mb-10 animate-fade-in-up" style={{animationDelay: '0.9s', opacity: 0, animationFillMode: 'forwards'}}>
              <p className="text-gray-600 text-lg leading-relaxed">
                {currentMessage.description}
              </p>
            </div>

            {/* Next Steps */}
            <div className="mb-10 animate-fade-in-up" style={{animationDelay: '1.1s', opacity: 0, animationFillMode: 'forwards'}}>
              <h2 className="font-display font-bold text-2xl text-[#122B22] mb-6">
                What Happens <span className="gradient-text">Next?</span>
              </h2>
              <div className="space-y-4">
                {currentMessage.nextSteps.map((step, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-gradient-to-br from-[#FF6B4A] to-[#D98E32] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-white font-bold text-sm">{index + 1}</span>
                    </div>
                    <p className="text-gray-700 leading-relaxed">{step}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Additional Info Card */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 mb-8 border border-blue-100 animate-fade-in-up" style={{animationDelay: '1.3s', opacity: 0, animationFillMode: 'forwards'}}>
              <div className="flex items-start gap-4">
                <svg className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"/>
                </svg>
                <div>
                  <h3 className="font-bold text-blue-900 mb-2">Keep This in Mind</h3>
                  <p className="text-blue-800 text-sm leading-relaxed">
                    {source === 'volunteer' 
                      ? "Make sure your email and phone number are correct. We'll use these to contact you. If you don't hear from us within 5 business days, please feel free to reach out through our contact page."
                      : "We respond to all inquiries in the order they're received. If your matter is urgent, please mention it in your message or contact us directly via phone."}
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up" style={{animationDelay: '1.5s', opacity: 0, animationFillMode: 'forwards'}}>
              <button
                onClick={() => navigate("/")}
                className="flex-1 bg-gradient-to-r from-[#FF6B4A] to-[#D98E32] text-white px-8 py-4 rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                Back to Home
              </button>
              <button
                onClick={() => navigate(source === 'volunteer' ? '/volunteer-apply' : '/contact')}
                className="flex-1 bg-white border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-full font-semibold text-lg hover:border-[#FF6B4A] hover:text-[#FF6B4A] transition-all duration-300"
              >
                Submit Another
              </button>
            </div>

            {/* Auto-redirect notice */}
            <p className="text-center text-sm text-gray-500 mt-6">
              You'll be automatically redirected to the homepage in 10 seconds
            </p>
          </div>
        </div>

        {/* Additional Links */}
        <div className="mt-8 text-center animate-fade-in-up" style={{animationDelay: '1.7s', opacity: 0, animationFillMode: 'forwards'}}>
          <p className="text-gray-600 mb-4">While you're here, explore more:</p>
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={() => navigate("/about")}
              className="px-6 py-2 bg-white rounded-full text-gray-700 hover:text-[#FF6B4A] hover:shadow-md transition-all duration-300 border border-gray-200"
            >
              About Us
            </button>
            <button
              onClick={() => navigate("/activities")}
              className="px-6 py-2 bg-white rounded-full text-gray-700 hover:text-[#FF6B4A] hover:shadow-md transition-all duration-300 border border-gray-200"
            >
              Our Activities
            </button>
            <button
              onClick={() => navigate("/gallery")}
              className="px-6 py-2 bg-white rounded-full text-gray-700 hover:text-[#FF6B4A] hover:shadow-md transition-all duration-300 border border-gray-200"
            >
              Gallery
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThankYouPage;
