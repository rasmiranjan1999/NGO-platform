import { Link } from "react-router-dom";
import { useSettings } from "../../context/SettingsContext";
import { 
  FaFacebookF, 
  FaInstagram, 
  FaYoutube, 
  FaLinkedinIn,
  FaTwitter,
  FaPhone,
  FaEnvelope
} from "react-icons/fa";

const Footer = () => {
  const { settings } = useSettings();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-gradient-to-b from-[#0F1F18] to-[#122B22] text-white overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#FF6B4A] rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#4ABFA8] rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 py-6">
        {/* Social Links Section */}
        <div className="flex flex-col items-center space-y-4">
          {/* Social Icons */}
          <div className="flex items-center gap-3">
            {settings?.facebook && (
              <SocialLink 
                href={settings.facebook} 
                icon={<FaFacebookF />}
                label="Facebook"
                color="hover:bg-[#1877F2]"
              />
            )}
            {settings?.instagram && (
              <SocialLink 
                href={settings.instagram} 
                icon={<FaInstagram />}
                label="Instagram"
                color="hover:bg-gradient-to-br hover:from-[#833AB4] hover:via-[#FD1D1D] hover:to-[#FCAF45]"
              />
            )}
            {settings?.youtube && (
              <SocialLink 
                href={settings.youtube} 
                icon={<FaYoutube />}
                label="YouTube"
                color="hover:bg-[#FF0000]"
              />
            )}
            {settings?.linkedin && (
              <SocialLink 
                href={settings.linkedin} 
                icon={<FaLinkedinIn />}
                label="LinkedIn"
                color="hover:bg-[#0A66C2]"
              />
            )}
            {settings?.twitter && (
              <SocialLink 
                href={settings.twitter} 
                icon={<FaTwitter />}
                label="Twitter"
                color="hover:bg-[#1DA1F2]"
              />
            )}
          </div>

          {/* Contact Info */}
          {(settings?.phone || settings?.email) && (
            <div className="flex flex-wrap items-center justify-center gap-3 md:gap-6 text-xs text-gray-300">
              {settings?.phone && (
                <a 
                  href={`tel:${settings.phone}`}
                  className="flex items-center gap-2 hover:text-[#4ABFA8] transition-colors duration-300 group"
                >
                  <FaPhone className="text-[10px] group-hover:scale-110 transition-transform" />
                  <span>{settings.phone}</span>
                </a>
              )}
              
              {settings?.phone && settings?.email && (
                <span className="text-gray-600">|</span>
              )}
              
              {settings?.email && (
                <a 
                  href={`mailto:${settings.email}`}
                  className="flex items-center gap-2 hover:text-[#4ABFA8] transition-colors duration-300 group"
                >
                  <FaEnvelope className="text-[10px] group-hover:scale-110 transition-transform" />
                  <span className="break-all">{settings.email}</span>
                </a>
              )}
            </div>
          )}

          {/* Divider Line */}
          <div className="w-full max-w-2xl h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

          {/* Copyright & Links */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-2 md:gap-4 text-center">
            <p className="text-xs text-gray-300">
              © {currentYear} {settings?.ngo_name || "Baba Kshyameswar Swechha Sebi Sangathan"}. All Rights Reserved.
            </p>
            
            <div className="flex items-center gap-3 text-xs">
              <Link 
                to="/privacy-policy" 
                className="text-gray-300 hover:text-[#FF6B4A] transition-colors duration-300 relative group whitespace-nowrap"
              >
                Privacy Policy
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#FF6B4A] group-hover:w-full transition-all duration-300" />
              </Link>
              
              <span className="text-gray-600">|</span>
              
              <Link 
                to="/terms-of-service" 
                className="text-gray-300 hover:text-[#FF6B4A] transition-colors duration-300 relative group whitespace-nowrap"
              >
                Terms of Service
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#FF6B4A] group-hover:w-full transition-all duration-300" />
              </Link>
            </div>
          </div>

          {/* Developer Credit */}
          <p className="text-xs text-gray-500">
            Developed by <span className="text-[#D98E32] font-semibold">Rasmi Ranjan Senapati</span>
          </p>
        </div>
      </div>

      <style>{`
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 20px rgba(255, 107, 74, 0.3); }
          50% { box-shadow: 0 0 30px rgba(255, 107, 74, 0.5); }
        }
        .social-icon-hover:hover {
          animation: pulse-glow 2s ease-in-out infinite;
        }
      `}</style>
    </footer>
  );
};

// Modern Social Link Component with Icons
const SocialLink = ({ href, icon, label, color }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className={`social-icon-hover w-9 h-9 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white transition-all duration-300 hover:scale-110 hover:border-transparent ${color} group`}
    aria-label={label}
  >
    <span className="text-sm group-hover:scale-110 transition-transform duration-300">
      {icon}
    </span>
  </a>
);

export default Footer;