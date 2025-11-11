import { NextResponse } from 'next/server';
import countries from 'src/utils/counties';

export async function POST(request) {
  const serverMapsApiKey = process.env.GOOGLE_MAPS_SERVER_API_KEY;

  try {
    // Get coordinates from request body
    const { lat, lng } = await request.json();

    if (!lat || !lng) {
      throw new Error('Coordinates are required');
    }

    // Get client IP from request headers
    const clientIp = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';

    // Call Geocoding API with coordinates
    const geocodeRes = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${serverMapsApiKey}`
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
    console.log({ geocodeData: geocodeData.results[0], currentCountry });

    console.log('returning location data for ip:', clientIp);
    return NextResponse.json({
      country_code: currentCountry?.code || 'US',
      name: currentCountry?.name || countryComponent?.long_name || 'United States of America',
      dial_code: currentCountry?.dial_code || '+1',
      ip: clientIp,
      currency_code: currentCountry?.currency || 'USD',
      coordinates: {
        lat,
        lng
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
