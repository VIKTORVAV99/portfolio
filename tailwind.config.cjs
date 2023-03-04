const defaultConfig = require('tailwindcss/defaultConfig');

/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			animation: {
				marquee: '10s linear 0s infinite normal running marquee'
			}
		},
		fontFamily: {
			inter: ['Inter', ...defaultConfig.theme.fontFamily.sans]
		}
	},
	plugins: []
};
