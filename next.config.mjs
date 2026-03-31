const basePath = process.env.PAGES_BASE_PATH || '';

/** @type {import('next').NextConfig} */
const nextConfig = {
  distDir: '.next-build',
  output: 'export',
  basePath,
  reactStrictMode: true,
  transpilePackages: ['@codegouvfr/react-dsfr'],
  webpack: (config) => {
    config.module.rules.push({
      test: /\.woff2$/,
      type: 'asset/resource',
    });
    return config;
  },
};

export default nextConfig;
