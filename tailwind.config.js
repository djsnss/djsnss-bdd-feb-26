// /** @type {import('tailwindcss').Config} */
// module.exports = {
//   content: [
//     "./index.html",
//     "./src/**/*.{js,jsx,ts,tsx}",
//   ],
//   theme: {
//     extend: {
//       fontFamily: {
//         'libertinus': ['"Libertinus Keyboard"', 'monospace'],
//         'raleway': ['Raleway', 'sans-serif'],
//         'roboto': ['Roboto', 'sans-serif'],
//       },
//     },
//   },
//   plugins: [],
// };

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'libertinus': ['"Libertinus Keyboard"', 'monospace'],
        'raleway': ['Raleway', 'sans-serif'],
        'roboto': ['Roboto', 'sans-serif'],
      },
      colors: {
        skyblue: {
          500: "#309cc0",
          600: "#0696c6"
        },
      },
    },
  },
  plugins: [],
};
