// app/robots.txt/route.js
import { NextResponse } from 'next/server';

export async function GET() {
  const robots = `
User-agent: *
Allow: /
Allow: /about
Allow: /race-track/collection
Allow: /photographers
Allow: /tracks
Allow: /track-products
Allow: /events
Allow: /blogs
Allow: /tracks/
Allow: /photographers/
Allow: /track-products/
Allow: /events/
Allow: /blogs/
Allow: /event/

Disallow: /api/
Disallow: /admin/
Disallow: /_next/
Disallow: /*.json$
Disallow: /*?*
Disallow: /private/
Disallow: /dashboard/

# Crawl delay to be respectful to the server
Crawl-delay: 1

# Sitemap location
Sitemap: https://lapsnaps.com/sitemap.xml

# Googlebot specific
User-agent: Googlebot
Allow: /
Crawl-delay: 1

# Bingbot specific
User-agent: Bingbot
Allow: /
Crawl-delay: 1

# GPTBot (OpenAI web crawler)
User-agent: GPTBot
Disallow: /

# CCBot (Common Crawler)
User-agent: CCBot
Disallow: /

# Amazonbot
User-agent: Amazonbot
Disallow: /
`.trim();

  return new NextResponse(robots, {
    headers: {
      'Content-Type': 'text/plain',
      'Cache-Control': 'public, max-age=86400' // Cache for 24 hours
    }
  });
}
