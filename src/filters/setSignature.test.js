const setSignature = require('./setSignature');

const table = [
	[{type: 'someFunc(string', desc: '$a = "hello") Some description.'},
		{type: null, name: 'someFunc(string $a = "hello")', desc: 'Some description.'}],
	[{type: 'someFunc(string', desc: '$a = array( array() ) ) Some description.'},
		{type: null, name: 'someFunc(string $a = array( array() ) )', desc: 'Some description.'}],
	[{type: 'WP_Post', desc: 'someFunc(int $post_id = 1) Some description.'},
		{type: 'WP_Post', name: 'someFunc(int $post_id = 1)', desc: 'Some description.'}],
	[{type: 'WP_Post', desc: 'Some description.'}],
	[{type: 'WP_Post', desc: 'someFunc(int $post_id = 1) '},
		{type: 'WP_Post', name: 'someFunc(int $post_id = 1)', desc: ''}],
	[{type: 'WP_Post', desc: 'Some description.'}],
	[{type: null, desc: 'Some description.'}],
];

test.each(table)('%s',
	(tag, expected = tag) => {
		expect(setSignature(tag)).toStrictEqual(expected);
	},
);