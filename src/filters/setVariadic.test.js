const setVariadic = require('./setVariadic');

const table = [
	[{name: '...$args'}, {name: '$args', variadic: true}],
];

test.each(table)('%s',
	(tag, expected = tag) => {
		expect(setVariadic(tag)).toStrictEqual(expected);
	},
);