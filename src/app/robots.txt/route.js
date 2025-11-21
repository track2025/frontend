const robots = `
User-agent: *
Allow: /
Disallow: /api/
Disallow: /admin/
Disallow: /_next/
Disallow: /private/
Disallow: /dashboard/
Disallow: /checkout/
Disallow: /cart/
Disallow: /*.json$
Disallow: /*?*

Crawl-delay: 1

Sitemap: https://lapsnaps.com/sitemap.xml

User-agent: Googlebot
Allow: /
Crawl-delay: 1

User-agent: Bingbot
Allow: /
Crawl-delay: 1

User-agent: GPTBot
Disallow: /

User-agent: CCBot
Disallow: /

User-agent: Amazonbot
Disallow: /
`.trim();
