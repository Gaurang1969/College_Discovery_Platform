import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    // This glob pattern tells Tailwind to look inside the 'src' folder
    // and find any file ending in these extensions.
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};

export default config;