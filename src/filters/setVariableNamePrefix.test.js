const setVariableNamePrefix = require('./setVariableNamePrefix');

const table = [
	[{name: '$arg'}, {prefixVariables: true}, {name: '$arg'}],
	[{name: '$arg'}, {prefixVariables: false}, {name: 'arg'}],
	[{name: 'arg'}, {prefixVariables: true}, {name: '$arg'}],
	[{name: 'arg'}, {prefixVariables: false}, {name: 'arg'}],
];

test.each(table)('%s',
	(tag, config = {}, expected = tag) => {
		expect(setVariableNamePrefix(tag, config)).toStrictEqual(expected);
	},
);