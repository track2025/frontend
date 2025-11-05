import { NextResponse } from 'next/server';
import countries from 'src/utils/counties';

export async function GET(request) {
  const serverMapsApiKey = process.env.GOOGLE_MAPS_SERVER_API_KEY;

  try {
    // Get client IP from request headers
    const clientIp = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';

    // First call: Google Geolocation API
    const geolocationRes = await fetch(`https://www.googleapis.com/geolocation/v1/geolocate?key=${serverMapsApiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        considerIp: true
      })
    });

    if (!geolocationRes.ok) {
      throw new Error(`Geolocation API failed: ${geolocationRes.statusText}`);
    }

    const locationData = await geolocationRes.json();

    // Second call: Geocoding API with coordinates
    const geocodeRes = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${locationData.location.lat},${locationData.location.lng}&key=${serverMapsApiKey}`
    );

    if (!geocodeRes.ok) {
      throw new Error(`Geocoding API failed: ${geocodeRes.statusText}`);
    }

    const geocodeData = await geocodeRes.json();

    // Find country information from the geocode results
    const countryComponent = geocodeData.results[0]?.address_components.find((component) =>
      component.types.includes('country')
    );

    const currentCountry = countries.find((c) => c.code === countryComponent?.short_name);

    return NextResponse.json({
      country_code: currentCountry?.code || 'US',
      name: currentCountry?.name || countryComponent?.long_name || 'United States of America',
      dial_code: currentCountry?.dial_code || '+1',
      ip: clientIp,
      currency_code: currentCountry?.currency || 'USD',
      coordinates: {
        lat: locationData.location.lat,
        lng: locationData.location.lng
      }
    });
  } catch (error) {
    console.error('Location API error:', error);

    // Fallback response
    return NextResponse.json({
      country_code: 'US',
      name: 'United States of America',
      dial_code: '+1',
      ip: 'unknown',
      currency_code: 'USD',
      coordinates: null,
      error: error.message
    });
  }
}
