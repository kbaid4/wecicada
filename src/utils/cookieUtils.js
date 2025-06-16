/**
 * Utility functions for managing cookie consent and preferences
 */

/**
 * Get the current consent preferences
 * @returns {Object|null} Consent object or null if not set
 */
export const getConsent = () => {
  if (typeof window === 'undefined') return null;
  
  // First check localStorage
  const storedConsent = localStorage.getItem('cookieConsent');
  if (storedConsent) {
    try {
      return JSON.parse(storedConsent);
    } catch (e) {
      console.error('Error parsing stored consent:', e);
    }
  }
  
  // Then check cookies (for server-side rendering compatibility)
  const cookieValue = document.cookie
    .split('; ')
    .find(row => row.startsWith('cookieConsent='))
    ?.split('=')[1];
    
  if (cookieValue) {
    try {
      const decoded = decodeURIComponent(cookieValue);
      return JSON.parse(decoded);
    } catch (e) {
      console.error('Error parsing cookie consent:', e);
    }
  }
  
  return null;
};

/**
 * Save consent preferences
 * @param {Object} consent - Consent preferences object
 */
export const saveConsent = (consent) => {
  if (typeof window === 'undefined') return;
  
  try {
    const consentString = JSON.stringify(consent);
    
    // Save to localStorage for immediate access
    localStorage.setItem('cookieConsent', consentString);
    
    // Save to cookie for server-side access
    const expiryDate = new Date();
    expiryDate.setFullYear(expiryDate.getFullYear() + 1); // 1 year expiry
    
    document.cookie = `cookieConsent=${encodeURIComponent(consentString)}; ` +
      `path=/; ` +
      `expires=${expiryDate.toUTCString()}; ` +
      `SameSite=Lax`;
      
  } catch (e) {
    console.error('Error saving consent:', e);
  }
};

/**
 * Initialize third-party services based on consent
 * @param {Object} consent - Consent preferences object
 */
export const initializeServices = (consent) => {
  if (typeof window === 'undefined') return;
  
  // Initialize analytics if consented
  if (consent.analytics) {
    // Example: Initialize Google Analytics
    // window.gtag('consent', 'update', {
    //   'analytics_storage': 'granted'
    // });
  } else {
    // Disable analytics if not consented
    // window.gtag('consent', 'update', {
    //   'analytics_storage': 'denied'
    // });
  }
  
  // Initialize marketing services if consented
  if (consent.marketing) {
    // Example: Initialize Facebook Pixel
    // fbq('consent', 'grant');
  } else {
    // Disable marketing if not consented
    // fbq('consent', 'revoke');
  }
};

/**
 * Check if consent banner should be shown
 * @returns {boolean} True if banner should be shown
 */
export const shouldShowBanner = () => {
  if (typeof window === 'undefined') return false;
  return getConsent() === null;
};
