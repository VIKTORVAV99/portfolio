export interface TimelineEntry {
	title: string;
	organization: string;
	type: 'work' | 'education' | 'life';
	startYear?: number;
	startMonth?: number; // 1–12; absent = defaults to 1 (January)
	endYear?: number | null; // null = ongoing (e.g. "Present"), undefined = single point / no range
	endMonth?: number | null; // 1–12; null = ongoing; absent = defaults to 12 (December)
	showDates: boolean;
	description?: string;
	location?: string;
	group?: string; // Entries with the same group are shown on the same side with a visual connector
}
