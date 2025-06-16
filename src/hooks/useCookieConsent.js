import { useState, useEffect } from 'react';
import { getConsent, initializeServices } from '../utils/cookieUtils';

/**
 * Hook to manage cookie consent state and actions
 * @returns {Object} Consent state and actions
 */
const useCookieConsent = () => {
  const [consent, setConsent] = useState({
    necessary: true,
    analytics: false,
    marketing: false,
    isBannerVisible: false
  });

  // Load consent on component mount
  useEffect(() => {
    const savedConsent = getConsent();
    
    if (savedConsent) {
      setConsent({
        ...savedConsent,
        isBannerVisible: false
      });
      initializeServices(savedConsent);
    } else {
      setConsent(prev => ({
        ...prev,
        isBannerVisible: true
      }));
    }
  }, []);

  /**
   * Update consent preferences
   * @param {Object} updates - Object containing consent updates
   */
  const updateConsent = (updates) => {
    const newConsent = {
      ...consent,
      ...updates,
      necessary: true // Always keep necessary cookies enabled
    };
    
    setConsent(newConsent);
    return newConsent;
  };

  /**
   * Accept all cookie categories
   */
  const acceptAll = () => {
    const newConsent = updateConsent({
      analytics: true,
      marketing: true,
      isBannerVisible: false
    });
    
    initializeServices(newConsent);
  };

  /**
   * Reject all non-essential cookies
   */
  const rejectAll = () => {
    const newConsent = updateConsent({
      analytics: false,
      marketing: false,
      isBannerVisible: false
    });
    
    initializeServices(newConsent);
  };

  /**
   * Save custom preferences
   * @param {Object} preferences - User's cookie preferences
   */
  const savePreferences = (preferences) => {
    const newConsent = updateConsent({
      ...preferences,
      isBannerVisible: false
    });
    
    initializeServices(newConsent);
  };

  /**
   * Toggle the visibility of the cookie banner
   * @param {boolean} isVisible - Whether the banner should be visible
   */
  const toggleBanner = (isVisible) => {
    setConsent(prev => ({
      ...prev,
      isBannerVisible: isVisible
    }));
  };

  return {
    consent,
    actions: {
      acceptAll,
      rejectAll,
      savePreferences,
      toggleBanner,
      updateConsent
    }
  };
};

export default useCookieConsent;
