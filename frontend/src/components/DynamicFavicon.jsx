import { useEffect } from "react";
import { API_BASE } from "../config";

/**
 * DynamicFavicon - Automatically updates the browser favicon
 * based on the organization's logo from settings
 */
const DynamicFavicon = () => {
  useEffect(() => {
    const updateFavicon = async () => {
      try {
        const response = await fetch(`${API_BASE}/api/settings`, {
          cache: 'no-store' // Prevent caching
        });
        const data = await response.json();
        
        // Determine favicon URL - use logo if available, otherwise use default
        let faviconUrl;
        if (data.success && data.data?.logo) {
          // Add timestamp to prevent browser caching
          faviconUrl = `${API_BASE}${data.data.logo}?t=${Date.now()}`;
        } else {
          // Use default favicon from public folder
          faviconUrl = '/favicon.ico';
        }
        
        // Remove all existing favicon links to prevent conflicts
        const existingLinks = document.querySelectorAll('link[rel*="icon"]');
        existingLinks.forEach(link => link.remove());
        
        // Update all favicon links with new URL
        const faviconLinks = [
          { rel: 'icon', type: 'image/x-icon' },
          { rel: 'icon', type: 'image/png', sizes: '32x32' },
          { rel: 'icon', type: 'image/png', sizes: '16x16' },
          { rel: 'apple-touch-icon', sizes: '180x180' },
          { rel: 'shortcut icon', type: 'image/x-icon' }
        ];
        
        faviconLinks.forEach(({ rel, type, sizes }) => {
          const link = document.createElement('link');
          link.rel = rel;
          if (type) link.type = type;
          if (sizes) link.sizes = sizes;
          link.href = faviconUrl;
          document.head.appendChild(link);
        });
        
        // Update page title with organization name
        if (data.data?.ngo_name) {
          const currentPath = window.location.pathname;
          let pageName = '';
          
          if (currentPath === '/') {
            pageName = 'Home';
          } else {
            const pathParts = currentPath.split('/').filter(Boolean);
            if (pathParts.length > 0) {
              pageName = pathParts[0]
                .split('-')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ');
            }
          }
          
          document.title = pageName ? `${pageName} - ${data.data.ngo_name}` : data.data.ngo_name;
        }
      } catch (error) {
        console.error('Failed to load favicon:', error);
        // Set default favicon on error
        const defaultLink = document.createElement('link');
        defaultLink.rel = 'icon';
        defaultLink.type = 'image/x-icon';
        defaultLink.href = '/favicon.ico';
        document.head.appendChild(defaultLink);
      }
    };
    
    updateFavicon();
    
    // Also update when settings change (listen for custom event)
    window.addEventListener('settingsUpdated', updateFavicon);
    
    return () => {
      window.removeEventListener('settingsUpdated', updateFavicon);
    };
  }, []);
  
  return null; // This component doesn't render anything
};

export default DynamicFavicon;
