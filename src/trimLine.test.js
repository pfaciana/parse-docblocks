const trimLine = require('./trimLine');

const table = [
	[`      *       content to be trimmed           
			`, 'content to be trimmed'],
	[`****   content to be trimmed `, 'content to be trimmed'],
	[` **   content to be trimmed `, 'content to be trimmed'],
	[`  **  * content to be trimmed     `, 'content to be trimmed'],
	[` /** `, ''],
	[` /* `, ''],
	[` */ `, ''],
	[` */`, ''],
];

test.each(table)('%s',
	(line, expected) => {
		expect(trimLine(line)).toStrictEqual(expected);
	},
);