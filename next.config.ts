// next.config.mjs
import nextPWA from "next-pwa";

const isDev = process.env.NODE_ENV === "development";

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
};

export default nextPWA({
  dest: "public",
  register: !isDev,
  skipWaiting: true,
  disable: isDev, // ✅ 핵심: dev 모드에서 PWA 비활성화
})(nextConfig);
