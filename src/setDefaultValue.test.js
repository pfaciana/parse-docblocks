const setDefaultValue = require('./setDefaultValue');

const table = [
	[{desc: 'Some summary. Default is 5'}, undefined, {desc: 'Some summary.', defaultValue: 5,}],
	[{desc: 'Some summary. Default to 5'}, undefined, {desc: 'Some summary.', defaultValue: 5,}],
	[{desc: 'Some summary. default is 5'}, undefined, {desc: 'Some summary. default is 5'}],
	[{desc: 'Some summary. Default true.'}, undefined, {desc: 'Some summary.', defaultValue: true,}],
	[{desc: 'Some summary without default value.'}, undefined, {desc: 'Some summary without default value.',}],
	[{other: 'Some summary. Default is 5'}, 'other', {other: 'Some summary.', defaultValue: 5,}],
	[{desc: 'a\nb\nc. Default is 5'}, undefined, {desc: 'a\nb\nc.', defaultValue: 5,}],
	[{desc: 'a\nb\nc\nDefault is 5'}, undefined, {desc: 'a\nb\nc', defaultValue: 5,}],
];

test.each(table)('%s',
	(line, key, expected) => {
		expect(setDefaultValue(line, key)).toStrictEqual(expected);
	},
);