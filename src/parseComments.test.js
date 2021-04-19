const fs = require('fs');
const path = require('path');
const parseComments = require('./parseComments');

const table = [
	['c1'],
	['c2'],
	['c3'],
	['c4'],
];

test.each(table)('%s',
	(filename) => {
		const lines = fs.readFileSync(path.join(__dirname, `/../tests/data/${filename}.txt`), 'utf8');
		const expected = JSON.parse(fs.readFileSync(path.join(__dirname, `/../tests/data/${filename}.json`), 'utf8'));
		expect(parseComments(lines)).toStrictEqual(expected);
	},
);

const table2 = [
	['c4b'],
];

test.each(table2)('%s',
	(filename) => {
		const config = {prefixPragmas: false, prefixVariables: false, typeToArray: true, defaultObj: true};
		const lines = fs.readFileSync(path.join(__dirname, `/../tests/data/${filename}.txt`), 'utf8');
		const expected = JSON.parse(fs.readFileSync(path.join(__dirname, `/../tests/data/${filename}.json`), 'utf8'));
		expect(parseComments(lines, config)).toStrictEqual(expected);
	},
);