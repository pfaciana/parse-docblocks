const setFlags = require('./setFlags');
const {parseFlag} = setFlags;

const table = [
	['!!note: This is a note flag', {
		type: 'note',
		desc: 'This is a note flag',
	}],
	['!note This is a minimal note flag', {
		type: 'note',
		desc: 'This is a minimal note flag',
	}],
	['!!!:::warning::: This is a maximum signature flag', {
		type: 'warning',
		desc: 'This is a maximum signature flag',
	}],
	['!!note: This is a\nnote flag', {
		type: 'note',
		desc: 'This is a\nnote flag',
	}],
	['!random-flag Random desc.', {
		type: 'random-flag',
		desc: 'Random desc.',
	}],
	['random-flag Random desc.', {
		type: 'random-flag',
		desc: 'Random desc.',
	}],
];

test.each(table)('%s',
	(line, expected) => {
		expect(parseFlag(line)).toStrictEqual(expected);
	},
);

const tableMultiLine = [
	[{desc: 'Line 1\n\nLine 2\n\n!!note: This is a note flag'}, {
		desc: 'Line 1\n\nLine 2',
		flags: [{
			type: 'note',
			desc: 'This is a note flag',
		}]
	}],
	[{desc: 'Line 1\n!!note: This is a note flag\n!!!notice:: This is a notice flag'}, {
		desc: 'Line 1',
		flags: [{
			type: 'note',
			desc: 'This is a note flag',
		}, {
			type: 'notice',
			desc: 'This is a notice flag',
		}]
	}],
	[{desc: 'Line 1\n\n\n!!note: This is a note flag\n\n\n!!!notice:: This is a notice flag\n\n\n'}, {
		desc: 'Line 1',
		flags: [{
			type: 'note',
			desc: 'This is a note flag',
		}, {
			type: 'notice',
			desc: 'This is a notice flag',
		}]
	}],
	[{desc: 'summary\n!abc'}, {
		desc: 'summary',
		flags: [{
			type: 'abc',
			desc: '',
		}]
	}],
	[{desc: 'summary\nabc'}, {desc: 'summary\nabc',}],
];

test.each(tableMultiLine)('%s',
	(desc, expected) => {
		expect(setFlags(desc)).toStrictEqual(expected);
	},
);