const defaultConfig = require('tailwindcss/defaultConfig');

/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		colors: {
			transparent: 'transparent',
			current: 'currentColor',
			canary: '#fee900',
			'canary-t-1': '#fee900EE',
			flame: '#ec4e20',
			'forest-green': '#248232',
			'oxford-blue': '#0a122a',
			'celestial-blue': '#009ddc',
			black: '#000',
			'black-t-1': '#000000EE',
			white: '#fff',
			'ghost-white': '#f7f7ff',
			'dark-gray': '#4C4E52',
			'linkedin-blue': '#0077b5'
		},
		extend: {
			animation: {
				marquee: '10s linear 0s infinite normal running marquee'
			},
			keyframes: {
				marquee: {
					'0%': { transform: 'translateX(0%)' },
					'100%': { transform: 'translateX(-100%)' }
				}
			}
		},
		fontFamily: {
			inter: ['Inter', ...defaultConfig.theme.fontFamily.sans]
		}
	},
	plugins: []
};
