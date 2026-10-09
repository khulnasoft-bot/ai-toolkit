/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: '/recipes/:category/:slug',
        destination: '/resources/recipes/:category/:slug',
        permanent: true,
      },
      {
        source: '/recipes/:category',
        destination: '/resources/recipes?category=:category',
        permanent: true,
      },
      {
        source: '/recipes',
        destination: '/resources/recipes',
        permanent: true,
      },
      { source: '/tools', destination: '/resources/tools', permanent: true },
      {
        source: '/templates',
        destination: '/resources/templates',
        permanent: true,
      },
      {
        source: '/showcase',
        destination: '/resources/showcase',
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
