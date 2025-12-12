'use client';
import { useContext, useState, useEffect } from 'react';
import { useSelector, ReactReduxContext } from 'react-redux';

/**
 * Currency conversion hook that works on both Redux routes and public (cookie-based) routes
 */
export const useCurrencyConvert = () => {
  // Check if Redux is available
  const reduxContext = useContext(ReactReduxContext);
  
  // Always call hooks
  const reduxSettings = reduxContext ? useSelector(({ settings }) => settings) : null;
  
  // Get rate with state for reactivity
  const getRateFromCookies = () => {
    if (typeof document === 'undefined') return 1;
    const rateCookie = document.cookie.split('; ').find(row => row.startsWith('rate='));
    return rateCookie ? parseFloat(rateCookie.split('=')[1]) : 1;
  };
  
  const [rate, setRate] = useState(1);
  
  useEffect(() => {
    if (reduxSettings) {
      setRate(reduxSettings.rate);
    } else {
      setRate(getRateFromCookies());
      
      // Listen for currency changes (which also change rate)
      const handleCurrencyChange = () => {
        setRate(getRateFromCookies());
      };
      
      window.addEventListener('currencyChanged', handleCurrencyChange);
      return () => window.removeEventListener('currencyChanged', handleCurrencyChange);
    }
  }, [reduxSettings]);

  return (price) => {
    return Math.round(Number(price || 0) * rate);
  };
};
