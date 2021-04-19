const setDefaultObj = require('./setDefaultObj');

const table = [
	[{
		desc: {
			tags: [{
				name: 'a',
				type: 'object',
			}, {
				name: 'b',
				type: 'array',
			}, {
				name: 'c',
				type: 'int',
			}, {
				name: 'd',
				type: 'bool',
			}, {
				name: 'e',
				type: 'string',
			}, {
				name: 'f',
				type: 'other',
			}],
		}
	}, {
		a: {},
		b: [],
		c: 0,
		d: false,
		e: '',
		f: null,
	}, {defaultObj: true}],
	[{
		desc: {
			tags: [{
				name: 'a',
				defaultValue: 123,
			}],
		}
	}, {
		a: 123,
	}, {defaultObj: true}],
	[{
		desc: {
			tags: [{
				name: 'ref',
				defaultObj: {a: 1, b: '2', c: {d: [], e: null}},
			}],
		}
	}, {ref: {a: 1, b: '2', c: {d: [], e: null}}}, {defaultObj: true}],
];

test.each(table)('%s',
	(obj, expected, config = {}) => {
		expect(setDefaultObj(obj, config).defaultObj).toStrictEqual(expected);
	},
);