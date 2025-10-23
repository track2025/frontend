import { useSelector } from 'react-redux';

export const useCurrencyConvert = () => {
  const { rate } = useSelector((state) => state.settings); // Access currency and rate from Redux
  const curr = useSelector((state) => state.settings); // Access currency and rate from Redux
  console.log('Current Currency in convertCurrency hook:', curr);

  const convertCurrency = (number) => {
    return Number((number * rate).toFixed(1));
  };
  return convertCurrency;
};
