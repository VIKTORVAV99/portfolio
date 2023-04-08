import { describe, it, expect } from 'vitest';
import { groupBy } from './groupBy';

interface Item {
	name: string;
	type: string;
}

const items: Item[] = [
	{ name: 'apple', type: 'fruit' },
	{ name: 'banana', type: 'fruit' },
	{ name: 'carrot', type: 'vegetable' },
	{ name: 'orange', type: 'fruit' },
	{ name: 'broccoli', type: 'vegetable' }
];

describe('groupBy', () => {
	it('groups items by type', () => {
		const grouped = groupBy(items, (item) => item.type);
		expect(grouped).toEqual({
			fruit: [
				{ name: 'apple', type: 'fruit' },
				{ name: 'banana', type: 'fruit' },
				{ name: 'orange', type: 'fruit' }
			],
			vegetable: [
				{ name: 'carrot', type: 'vegetable' },
				{ name: 'broccoli', type: 'vegetable' }
			]
		});
	});
});
