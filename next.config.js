/** @type {import('next').NextConfig} */
const nextConfig = {
  // Please disable react strict mode in development.
  // Because it makes drag-n-drop not working.
  reactStrictMode: true,
  // TODO: Temporarily, should be removed soon.
  typescript: {
    ignoreBuildErrors: true,
  },
  compiler: {
    styledComponents: true,
  },
  experimental: {
    swcPlugins: [["@lingui/swc-plugin", {}]],
  },
};

module.exports = nextConfig;
