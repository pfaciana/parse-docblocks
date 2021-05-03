const fs = require('fs');
const path = require('path');
const parseComments = require('./parseComments');

const table = [
	['c1'],
	['c2'],
	['c3'],
	['c4'],
	['c5'],
	['c6'],
];

test.each(table)('%s',
	(filename) => {
		const input = fs.readFileSync(path.join(__dirname, `/../tests/data/${filename}.txt`), 'utf8');
		const expected = JSON.parse(fs.readFileSync(path.join(__dirname, `/../tests/data/${filename}.json`), 'utf8'));
		expect(parseComments(input)).toStrictEqual(expected);
	},
);

const table2 = [
	['c4b'],
	['c4c'],
];

test.each(table2)('%s',
	(filename) => {
		const config = {prefixPragmas: false, prefixVariables: false, typeToArray: true, defaultObj: true};
		const input = fs.readFileSync(path.join(__dirname, `/../tests/data/${filename}.txt`), 'utf8');
		const expected = JSON.parse(fs.readFileSync(path.join(__dirname, `/../tests/data/${filename}.json`), 'utf8'));
		expect(parseComments(input, config)).toStrictEqual(expected);
	},
);