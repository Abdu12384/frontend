
// export default {
//   content: ['./src/**/*.{js,jsx,ts,tsx}'],
//   theme: {
//     extend: {},
//   },
//   plugins: [],
// };
/**
  @type {import('tailwindcss').Config} */
export default{
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Adjust paths based on your project structure
     "./public/index.html",       
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
