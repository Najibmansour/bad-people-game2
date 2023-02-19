/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",

    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  // theme: {
  //   extend: {
  //     colors: {
  //       primary: "#6666ff",
  //       secondary: "c24700",
  //       bgcolor: "#f1f1f1",
  //       foocolor: "#1f1f1f",
  //       primaryD: "#7777ff",
  //       secondaryD: "c24700",
  //       bgcolorD: "#1f1f1f",
  //       foocolorD: "#f1f1f1",
  //     },
  //     // spacing: {
  //     //   "70screen": "70vh",
  //     // },
  //   },
  // },
  daisyui: {
    themes: [
      {
        light: {
          ...require("daisyui/src/colors/themes")["[data-theme=light]"],
          primary: "#ed0c1c",
          "primary-focus": "#c30010",
        },
      },

      {
        dark: {
          ...require("daisyui/src/colors/themes")["[data-theme=dark]"],
          primary: "#ed0c1c",
          "primary-focus": "#c30010",
        },
      },
      ,
    ],
    base: true,
  },
  plugins: [require("daisyui")],
};
