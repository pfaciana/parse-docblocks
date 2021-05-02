const promoteKeysFromNestedBlocks = require('./promoteKeysFromNestedBlocks');

const table = [
	[
		{desc: 'a1'}, 'desc',
		{a1: {optional: true},},
		{desc: {}, optional: true}
	],
	[
		{other: 'a2'}, 'other',
		{a2: {defaultValue: 5},},
		{other: {}, defaultValue: 5}
	],
	[
		{desc: 'a3'}, 'desc',
		{a3: {summary: 'lorem ipsum', optional: true, defaultValue: 5},},
		{desc: {summary: 'lorem ipsum'}, optional: true, defaultValue: 5}
	],
];

test.each(table)('%s',
	(obj, key, nestedBlocks, expected = obj) => {
		expect(promoteKeysFromNestedBlocks(obj, key, nestedBlocks)).toStrictEqual(expected);
	},
);