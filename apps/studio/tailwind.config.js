/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [require('@ai-toolkit/design/tailwind-preset')],
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    '../../packages/ui/design/src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
};
