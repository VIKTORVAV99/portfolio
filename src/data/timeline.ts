import type { TimelineEntry } from '$interfaces/timelineEntry';

export const timelineEntries: TimelineEntry[] = [
	{
		title: 'Born',
		organization: 'Sweden',
		startYear: 1999,
		startMonth: 2,
		type: 'life',
		showDates: false
	},
	{
		title: 'Technology Programme',
		organization: 'Placeholder High School',
		type: 'education',
		startYear: 2016,
		endYear: 2019,
		showDates: true,
		description: 'High school education with a focus on technology',
		location: 'Sweden'
	},
	{
		title: 'Digital Design and Innovation',
		organization: 'Jönköping University',
		type: 'education',
		startYear: 2019,
		endYear: 2024,
		showDates: true,
		description: 'Bachelor and Master in Digital Design and Innovation',
		location: 'Jönköping, Sweden'
	},
	{
		title: 'Open Source Community Engineer',
		organization: 'Electricity Maps',
		type: 'work',
		startYear: 2022,
		endYear: 2024,
		showDates: true,
		description: 'Building and nurturing the open source community',
		location: 'Remote, Denmark',
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
		location: 'Remote, Denmark',
		group: 'electricity-maps'
	}
];
