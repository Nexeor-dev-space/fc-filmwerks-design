/** @type {import('prettier').Config} */
const config = {
  semi: true,
  singleQuote: true,
  jsxSingleQuote: false,
  trailingComma: 'all',
  printWidth: 80,
  tabWidth: 2,
  useTabs: false,
  arrowParens: 'always',
  endOfLine: 'lf',
  plugins: ['prettier-plugin-tailwindcss'],
  // Tailwind v4 reads its theme from CSS, not a JS config file.
  tailwindStylesheet: './src/app/globals.css',
  tailwindFunctions: ['cn', 'cva', 'clsx', 'twMerge'],
};

export default config;
