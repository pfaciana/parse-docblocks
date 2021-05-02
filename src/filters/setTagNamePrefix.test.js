const setTagNamePrefix = require('./setTagNamePrefix');

const table = [
	[{tagName: '@param'}, {prefixPragmas: true}, {tagName: '@param'}],
	[{tagName: '@param'}, {prefixPragmas: false}, {tagName: 'param'}],
	[{tagName: 'param'}, {prefixPragmas: true}, {tagName: '@param'}],
	[{tagName: 'param'}, {prefixPragmas: false}, {tagName: 'param'}],
];

test.each(table)('%s',
	(tag, config = {}, expected = tag) => {
		expect(setTagNamePrefix(tag, config)).toStrictEqual(expected);
	},
);