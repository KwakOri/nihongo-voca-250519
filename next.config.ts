import nextPWA from "next-pwa";

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
};

export default nextPWA({
  dest: "public",
  register: true,
  skipWaiting: true,
})(nextConfig);
