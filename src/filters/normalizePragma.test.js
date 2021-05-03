const normalizePragma = require('./normalizePragma');

const table = [
	['@param', '@param'],
	['@returns', '@return'],
	['@usedby', '@used-by'],
	['@used', '@uses'],
	['@use', '@uses'],
];

test.each(table)('%s',
	(pragma, expected = pragma) => {
		expect(normalizePragma(pragma)).toStrictEqual(expected);
	},
);