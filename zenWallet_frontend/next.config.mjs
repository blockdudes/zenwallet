/** @type {import('next').NextConfig} */
const nextConfig = {
  redirects: () => [
    {
      source: "/",
      destination: "/wallet",
      permanent: false,
    },
  ],
};

export default nextConfig;
