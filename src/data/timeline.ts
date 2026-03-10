import type { TimelineEntry } from '$interfaces/timelineEntry';

export const timelineEntries: TimelineEntry[] = [
	{
		title: 'Born',
		organization: 'Sweden',
		type: 'life',
		showDates: false
	},
	{
		title: 'Digital Design and Innovation',
		organization: 'Jönköping University',
		type: 'education',
		startYear: 2019,
		endYear: 2024,
		showDates: true,
		description: 'Bachelor and Master in Digital Design and Innovation'
	},
	{
		title: 'Open Source Community Engineer',
		organization: 'Electricity Maps',
		type: 'work',
		startYear: 2022,
		endYear: 2024,
		showDates: true,
		description: 'Building and nurturing the open source community',
		group: 'electricity-maps'
	},
	{
		title: 'Software Engineer',
		organization: 'Electricity Maps',
		type: 'work',
		startYear: 2024,
		endYear: null,
		showDates: true,
		description: 'Powering decarbonization through data',
		group: 'electricity-maps'
	}
];
