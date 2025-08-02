import countries from 'src/components/_main/checkout/countries.json';


export default async function getLocation() {
  try {
    const res = await fetch('http://ip-api.com/json/');
    const data = await res.json();

    const currentCountry = countries.find(
      (c) => c.code === data.countryCode
    );

    return {
      country_code: currentCountry?.code || 'US',
      name: currentCountry?.name || 'United States of America',
      dial_code: currentCountry?.dial_code || '+1',
      ip: data.query || 'unknown',
      currency_code: currentCountry?.currency || 'USD',
    };
  } catch (error) {
    console.error('Location fetch failed:', error);
    return {
      country_code: 'US',
      name: 'United States of America',
      dial_code:  '+1',
      ip: 'unknown',
      currency_code: 'USD',    };
  }
}