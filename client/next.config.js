/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env:{
    SERVER_URL: 'http://localhost:4200'
  },
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "**",
        port: "",
        pathname: "**",
      },
    ],
      domains: ['localhost','lh3.googleusercontent.com','graph.facebook.com'],
  },
};

module.exports = nextConfig;
