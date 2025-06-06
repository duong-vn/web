/** @type {import('next').NextConfig} */
const nextConfig = {
  //   /* config options here */
  webpack: (config) => {
    config.module.rules.push({
      test: /\.css$/,
      use: ["style-loader", "css-loader", "postcss-loader"],
    });
    return config;
  },
  //   api: {
  //     bodyParser: {
  //       sizeLimit: "8mb",
  //     },
  //   },
};

module.exports = nextConfig;
