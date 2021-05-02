const parseType = require('./parseType');

const table = [
	[{tagName: '@param', type: '{string}'}, {}, {tagName: '@param', type: 'string'}],
	[{tagName: 'param', type: '{string}'}, {}, {tagName: 'param', type: 'string'}],
	[{tagName: '@param', type: '(array)'}, {}, {tagName: '@param', type: 'array'}],
	[{tagName: '@param', type: 'array|null'}, {}, {tagName: '@param', type: 'array|null'}],
	[{tagName: '@param', type: null}, {typeToArray: false}, {tagName: '@param', type: null}],
	[{tagName: '@param'}, {typeToArray: false}, {tagName: '@param'}],
	[{tagName: '@param', type: 'array|null'}, {typeToArray: true}, {tagName: '@param', type: ['array', 'null']}],
	[{tagName: '@param', type: null}, {typeToArray: true}, {tagName: '@param', type: []}],
	[{tagName: '@param'}, {typeToArray: true}, {tagName: '@param', type: []}],
	[{tagName: '@param', type: '{array|null}'}, {typeToArray: true}, {tagName: '@param', type: ['array', 'null']}],
	[{tagName: '@param', type: '(array|null)'}, {typeToArray: true}, {tagName: '@param', type: ['array', 'null']}],
	[{tagName: '@not-param', type: '{array|null}'}, {typeToArray: true}],
];

test.each(table)('%s',
	(tag, config = {}, expected = tag) => {
		expect(parseType(tag, config)).toStrictEqual(expected);
	},
);