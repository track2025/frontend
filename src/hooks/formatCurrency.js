'use client';
import { useContext, useState, useEffect } from 'react';
import { useSelector, ReactReduxContext } from 'react-redux';

/**
 * Currency formatter hook that works on both Redux routes and public (cookie-based) routes
 * @param {string} currencyOverride - Optional currency override (for backward compatibility)
 */
export const useCurrencyFormatter = (currencyOverride) => {
  // Check if Redux is available
  const reduxContext = useContext(ReactReduxContext);
  
  // Always call hooks
  const reduxSettings = reduxContext ? useSelector(({ settings }) => settings) : null;
  
  // Get currency with state for reactivity
  const getCurrencyFromCookies = () => {
    if (typeof document === 'undefined') return 'USD';
    const currencyCookie = document.cookie.split('; ').find(row => row.startsWith('currency='));
    return currencyCookie ? currencyCookie.split('=')[1] : 'USD';
  };
  
  const [currency, setCurrency] = useState(currencyOverride || 'USD');
  
  useEffect(() => {
    // If currency override is provided, use it (backward compatibility)
    if (currencyOverride) {
      setCurrency(currencyOverride);
      return;
    }
    
    // Otherwise, get from Redux or cookies
    if (reduxSettings) {
      setCurrency(reduxSettings.currency);
    } else {
      setCurrency(getCurrencyFromCookies());
      
      // Listen for currency changes
      const handleCurrencyChange = () => {
        setCurrency(getCurrencyFromCookies());
      };
      
      window.addEventListener('currencyChanged', handleCurrencyChange);
      return () => window.removeEventListener('currencyChanged', handleCurrencyChange);
    }
  }, [reduxSettings, currencyOverride]);

  return (value) => {
    if (!value || value === 0) return currency === 'USD' ? '$0.00' : `${currency} 0.00`;
    
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(value);
  };
};
