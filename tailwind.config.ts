import type { Config } from "tailwindcss";

const config: Config = {
	content: [
		"./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/components/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/**/*.{js,ts,jsx,tsx,mdx}",
	],
	daisyui: {
		themes: [
			{
				mytheme: {
					primary: "#E0E8F8",
				},
			},
		],
	},
	theme: {
		extend: {
			colors: {
				main: "#E0E8F8",
				secondary: "#daf77380",
				white: "#fff",
				black: "#fafafa",
				card: "#272727",
			},
			backgroundImage: {
				"gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
				"gradient-conic":
					"conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
			},
		},
		container: {
			center: true,
			screens: {
				"2xl": "1000px",
			},
		},
	},
	// eslint-disable-next-line no-undef
	plugins: [require("daisyui")],
};
export default config;
