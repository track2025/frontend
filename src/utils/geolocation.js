export default async function getLocation() {
  try {
    const res = await fetch('/api/location');

    if (!res.ok) {
      throw new Error(`Location API failed: ${res.statusText}`);
    }

    const locationData = await res.json();

    return locationData;
  } catch (error) {
    console.error('Location fetch failed:', error);
    return {
      country_code: 'US',
      name: 'United States of America',
      dial_code: '+1',
      ip: 'unknown',
      currency_code: 'USD',
      coordinates: null,
      error: error.message
    };
  }
}
