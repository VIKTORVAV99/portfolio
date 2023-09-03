import type { CustomThemeConfig } from '@skeletonlabs/tw-plugin';

export const portfolioTheme: CustomThemeConfig = {
	name: 'portfolio-theme',
	properties: {
		// =~= Theme Properties =~=
		'--theme-font-family-base':
			"Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'",
		'--theme-font-family-heading':
			"Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'",
		'--theme-font-color-base': '0 0 0',
		'--theme-font-color-dark': '255 255 255',
		'--theme-rounded-base': '9999px',
		'--theme-rounded-container': '8px',
		'--theme-border-base': '1px',
		// =~= Theme On-X Colors =~=
		'--on-primary': '0 0 0',
		'--on-secondary': '255 255 255',
		'--on-tertiary': '255 255 255',
		'--on-success': '255 255 255',
		'--on-warning': '255 255 255',
		'--on-error': '255 255 255',
		'--on-surface': '255 255 255',
		// =~= Theme Colors  =~=
		// primary | #f7f7ff
		'--color-primary-50': '254 254 255', // #fefeff
		'--color-primary-100': '253 253 255', // #fdfdff
		'--color-primary-200': '253 253 255', // #fdfdff
		'--color-primary-300': '252 252 255', // #fcfcff
		'--color-primary-400': '249 249 255', // #f9f9ff
		'--color-primary-500': '247 247 255', // #f7f7ff
		'--color-primary-600': '222 222 230', // #dedee6
		'--color-primary-700': '185 185 191', // #b9b9bf
		'--color-primary-800': '148 148 153', // #949499
		'--color-primary-900': '121 121 125', // #79797d
		// secondary | #009ddc
		'--color-secondary-50': '217 240 250', // #d9f0fa
		'--color-secondary-100': '204 235 248', // #ccebf8
		'--color-secondary-200': '191 231 246', // #bfe7f6
		'--color-secondary-300': '153 216 241', // #99d8f1
		'--color-secondary-400': '77 186 231', // #4dbae7
		'--color-secondary-500': '0 157 220', // #009ddc
		'--color-secondary-600': '0 141 198', // #008dc6
		'--color-secondary-700': '0 118 165', // #0076a5
		'--color-secondary-800': '0 94 132', // #005e84
		'--color-secondary-900': '0 77 108', // #004d6c
		// tertiary | #888888
		'--color-tertiary-50': '237 237 237', // #ededed
		'--color-tertiary-100': '231 231 231', // #e7e7e7
		'--color-tertiary-200': '225 225 225', // #e1e1e1
		'--color-tertiary-300': '207 207 207', // #cfcfcf
		'--color-tertiary-400': '172 172 172', // #acacac
		'--color-tertiary-500': '136 136 136', // #888888
		'--color-tertiary-600': '122 122 122', // #7a7a7a
		'--color-tertiary-700': '102 102 102', // #666666
		'--color-tertiary-800': '82 82 82', // #525252
		'--color-tertiary-900': '67 67 67', // #434343
		// success | #248232
		'--color-success-50': '222 236 224', // #deece0
		'--color-success-100': '211 230 214', // #d3e6d6
		'--color-success-200': '200 224 204', // #c8e0cc
		'--color-success-300': '167 205 173', // #a7cdad
		'--color-success-400': '102 168 112', // #66a870
		'--color-success-500': '36 130 50', // #248232
		'--color-success-600': '32 117 45', // #20752d
		'--color-success-700': '27 98 38', // #1b6226
		'--color-success-800': '22 78 30', // #164e1e
		'--color-success-900': '18 64 25', // #124019
		// warning | #Ff6700
		'--color-warning-50': '255 232 217', // #ffe8d9
		'--color-warning-100': '255 225 204', // #ffe1cc
		'--color-warning-200': '255 217 191', // #ffd9bf
		'--color-warning-300': '255 194 153', // #ffc299
		'--color-warning-400': '255 149 77', // #ff954d
		'--color-warning-500': '255 103 0', // #Ff6700
		'--color-warning-600': '230 93 0', // #e65d00
		'--color-warning-700': '191 77 0', // #bf4d00
		'--color-warning-800': '153 62 0', // #993e00
		'--color-warning-900': '125 50 0', // #7d3200
		// error | #cc0202
		'--color-error-50': '247 217 217', // #f7d9d9
		'--color-error-100': '245 204 204', // #f5cccc
		'--color-error-200': '242 192 192', // #f2c0c0
		'--color-error-300': '235 154 154', // #eb9a9a
		'--color-error-400': '219 78 78', // #db4e4e
		'--color-error-500': '204 2 2', // #cc0202
		'--color-error-600': '184 2 2', // #b80202
		'--color-error-700': '153 2 2', // #990202
		'--color-error-800': '122 1 1', // #7a0101
		'--color-error-900': '100 1 1', // #640101
		// surface | #333333
		'--color-surface-50': '224 224 224', // #e0e0e0
		'--color-surface-100': '214 214 214', // #d6d6d6
		'--color-surface-200': '204 204 204', // #cccccc
		'--color-surface-300': '173 173 173', // #adadad
		'--color-surface-400': '112 112 112', // #707070
		'--color-surface-500': '51 51 51', // #333333
		'--color-surface-600': '46 46 46', // #2e2e2e
		'--color-surface-700': '38 38 38', // #262626
		'--color-surface-800': '31 31 31', // #1f1f1f
		'--color-surface-900': '25 25 25' // #191919
	}
};
