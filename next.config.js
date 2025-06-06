/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  webpack: (config) => {
    config.module.rules.push({
      test: /\.css$/,
      use: ["style-loader", "css-loader", "postcss-loader"],
    });
    return config;
  },
  // api: {
  //   bodyParser: {
  //     sizeLimit: '10mb', // tăng giới hạn lên 10mb (bạn có thể chỉnh lên tùy ý)
  //   },}
};

module.exports = nextConfig;
