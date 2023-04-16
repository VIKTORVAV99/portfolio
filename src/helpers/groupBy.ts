export const groupBy = <Entry, Key extends keyof any>(list: Entry[], getKey: (item: Entry) => Key) =>
	list.reduce((previous, currentItem) => {
		const group = getKey(currentItem);
		if (!previous[group]) previous[group] = [];
		previous[group].push(currentItem);
		return previous;
	}, {} as Record<Key, Entry[]>);
