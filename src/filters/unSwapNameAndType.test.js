const unSwapNameAndType = require('./unSwapNameAndType');

const table = [
	[{tagName: '@param', type: '$array', name: '(array)',}, {tagName: '@param', type: '(array)', name: '$array',}],
	[{tagName: '@param', type: '$certs', name: 'array',}, {tagName: '@param', type: 'array', name: '$certs',}],
	[{tagName: '@not-var', type: '$array', name: '(array)',}, {tagName: '@not-var', type: '$array', name: '(array)',}],
];

test.each(table)('%s',
	(tag, expected = tag) => {
		expect(unSwapNameAndType(tag)).toStrictEqual(expected);
	},
);