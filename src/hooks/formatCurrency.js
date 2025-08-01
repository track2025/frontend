import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

export const useCurrencyFormatter = (curr) => {
  const { currency } = useSelector((state) => state.settings);

  const [formatter, setFormatter] = useState(null);
  const locale = 'en-US';

  useEffect(() => {
    if (currency && locale) {
      const newFormatter = new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: curr || currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
      setFormatter(newFormatter);
    }
  }, [currency, locale, curr]);

  const formatCurrency = (number) => {
    if (!formatter) return number;
    return formatter.format(Number(number));
  };

  return formatCurrency;
};
