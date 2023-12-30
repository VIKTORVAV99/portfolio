export const groupBy = <Entry, Key extends keyof never>(list: Entry[], getKey: (item: Entry) => Key) => {
	const groups = new Map<Key, Entry[]>();

	for (const item of list) {
		const group = getKey(item);
		const groupItems = groups.get(group) || [];
		groupItems.push(item);
		groups.set(group, groupItems);
	}

	return Object.fromEntries(groups);
};
