'use client';
import { useState, useEffect } from 'react';

/**
 * Hook to get settings and user data from cookies (for routes without Redux)
 * Falls back to defaults if cookies don't exist
 */
export function useSettingsFromCookies() {
  const [settings, setSettings] = useState({
    themeMode: 'light',
    currency: process.env.NEXT_PUBLIC_BASE_CURRENCY || 'GBP',
    rate: 1,
    selectedCountry: 'GB',
    isAuthenticated: false,
    user: null
  });

  useEffect(() => {
    // Parse cookies
    const cookies = document.cookie.split(';').reduce((acc, cookie) => {
      const [key, value] = cookie.trim().split('=');
      acc[key] = value;
      return acc;
    }, {});

    // Parse user data from cookie
    let userData = null;
    try {
      if (cookies.userData) {
        userData = JSON.parse(decodeURIComponent(cookies.userData));
      }
    } catch (e) {
      console.error('Failed to parse user data from cookie:', e);
    }

    setSettings({
      themeMode: cookies.themeMode || 'light',
      currency: cookies.currency || process.env.NEXT_PUBLIC_BASE_CURRENCY || 'GBP',
      rate: parseFloat(cookies.rate) || 1,
      selectedCountry: cookies.selectedCountry || 'GB',
      isAuthenticated: cookies.isAuthenticated === 'true',
      user: userData
    });
  }, []);

  return settings;
}

/**
 * Helper to get a specific cookie value on the server
 */
export function getCookieValue(name, cookieString) {
  if (!cookieString) return null;
  
  const cookies = cookieString.split(';').reduce((acc, cookie) => {
    const [key, value] = cookie.trim().split('=');
    acc[key] = value;
    return acc;
  }, {});
  
  return cookies[name] || null;
}
