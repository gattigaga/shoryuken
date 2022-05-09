/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // TODO: Temporarily, should be removed soon.
  typescript: {
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig;
