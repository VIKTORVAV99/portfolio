export interface TimelineEntry {
	title: string;
	organization: string;
	type: 'work' | 'education' | 'life';
	startYear?: number;
	endYear?: number | null; // null = ongoing (e.g. "Present"), undefined = single point / no range
	showDates: boolean;
	description?: string;
	location?: string;
	group?: string; // Entries with the same group are shown on the same side with a visual connector
}
