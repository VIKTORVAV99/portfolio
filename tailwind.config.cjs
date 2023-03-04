const defaultConfig = require('tailwindcss/defaultConfig');

/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		colors: {
			transparent: 'transparent',
			current: 'currentColor',
			canary: '#fee900',
			flame: '#ec4e20',
			'forest-green': '#248232',
			'oxford-blue': '#0a122a',
			'celestial-blue': '#009ddc',
			night: '#03120e',
			'ghost-white': '#f7f7ff'
		},
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
