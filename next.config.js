module.exports = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: "/",
        destination: "/explore",
        permanent: true,
      },
    ];
  },
  images: {
    domains: ["firebasestorage.googleapis.com"],
  },
};
