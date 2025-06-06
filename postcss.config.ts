type PostCSSConfig = {
  plugins: {
    [key: string]: any;
  };
};

const config: PostCSSConfig = {
  plugins: {
    'tailwindcss/nesting': {},
    tailwindcss: {},
    autoprefixer: {},
  },
};

export default config; 