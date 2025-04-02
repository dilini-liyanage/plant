/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['res.cloudinary.com'],
  },
  env: {
    VERCEL_URL: process.env.VERCEL_URL,
  },
};

export default nextConfig;
