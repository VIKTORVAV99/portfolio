import { describe, it, expect } from 'bun:test';
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

	it('groups items by name', () => {
		const grouped = groupBy(items, (item) => item.name);
		expect(grouped).toEqual({
			apple: [{ name: 'apple', type: 'fruit' }],
			banana: [{ name: 'banana', type: 'fruit' }],
			carrot: [{ name: 'carrot', type: 'vegetable' }],
			orange: [{ name: 'orange', type: 'fruit' }],
			broccoli: [{ name: 'broccoli', type: 'vegetable' }]
		});
	});

	it('groups items by first letter', () => {
		const grouped = groupBy(items, (item) => item.name[0]);
		expect(grouped).toEqual({
			a: [{ name: 'apple', type: 'fruit' }],
			b: [
				{ name: 'banana', type: 'fruit' },
				{ name: 'broccoli', type: 'vegetable' }
			],
			c: [{ name: 'carrot', type: 'vegetable' }],
			o: [{ name: 'orange', type: 'fruit' }]
		});
	});

	it('groups items by length of name', () => {
		const grouped = groupBy(items, (item) => item.name.length);
		expect(grouped).toEqual({
			5: [{ name: 'apple', type: 'fruit' }],
			6: [
				{ name: 'banana', type: 'fruit' },
				{ name: 'carrot', type: 'vegetable' },
				{ name: 'orange', type: 'fruit' }
			],
			8: [{ name: 'broccoli', type: 'vegetable' }]
		});
	});

	it('groups items by type and name', () => {
		const grouped = groupBy(items, (item) => `${item.type}-${item.name}`);
		expect(grouped).toEqual({
			'fruit-apple': [{ name: 'apple', type: 'fruit' }],
			'fruit-banana': [{ name: 'banana', type: 'fruit' }],
			'vegetable-carrot': [{ name: 'carrot', type: 'vegetable' }],
			'fruit-orange': [{ name: 'orange', type: 'fruit' }],
			'vegetable-broccoli': [{ name: 'broccoli', type: 'vegetable' }]
		});
	});
});
