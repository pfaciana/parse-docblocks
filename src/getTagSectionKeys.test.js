const getTagSectionKeys = require('./getTagSectionKeys');

const table = [
	['@param', ['type', 'name', 'desc']],
	['@return', ['type', 'desc']],
	['@any-other-tag', ['desc']],
];

test.each(table)('%s',
	(tag, expected) => {
		expect(getTagSectionKeys(tag)).toStrictEqual(expected);
	},
);