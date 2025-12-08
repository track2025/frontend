export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/admin/',
          '/_next/',
          '/private/',
          '/dashboard/',
          '/checkout/',
          '/cart/',
          '/*.json$',
          '/*?*'
        ],
        crawlDelay: 1
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        crawlDelay: 1
      },
      {
        userAgent: 'Bingbot',
        allow: '/',
        crawlDelay: 1
      },
      {
        userAgent: ['GPTBot', 'CCBot', 'Amazonbot'],
        disallow: '/'
      }
    ],
    sitemap: 'https://lapsnaps.com/sitemap.xml'
  };
}
