const setOptional = require('./setOptional');

const table = [
	[{
		name: 'someParam',
		desc: 'Some Description.',
	}, undefined, undefined, {
		name: 'someParam',
		desc: 'Some Description.',
		optional: false,
	}],
	[{
		name: 'someParam',
		desc: 'Some Description.',
	}, undefined, false, {
		name: 'someParam',
		desc: 'Some Description.',
	}],
	[{
		name: 'someParam',
		desc: 'Some Description.',
		optional: true,
	}, undefined, undefined, {
		name: 'someParam',
		desc: 'Some Description.',
		optional: true,
	}],
	[{
		name: 'someParam',
		desc: 'Optional. Some Description.',
	}, undefined, undefined, {
		name: 'someParam',
		desc: 'Some Description.',
		optional: true,
	}],
	[{
		name: '[someParam]',
		desc: 'Some Description.',
	}, undefined, undefined, {
		name: 'someParam',
		desc: 'Some Description.',
		optional: true,
	}],
	[{
		name: 'someParam?',
		desc: 'Some Description.',
	}, undefined, undefined, {
		name: 'someParam',
		desc: 'Some Description.',
		optional: true,
	}],
	[{
		name: '[someParam?]',
		desc: 'Optional. Some Description.',
	}, undefined, undefined, {
		name: 'someParam',
		desc: 'Some Description.',
		optional: true,
	}],
	[{
		summary: 'Some Summary.',
	}, 'summary', undefined, {
		summary: 'Some Summary.',
		optional: false,
	}],
	[{
		summary: 'Some Summary.',
	}, 'summary', false, {
		summary: 'Some Summary.',
	}],
	[{
		summary: 'Optional. Some Summary.',
	}, 'summary', undefined, {
		summary: 'Some Summary.',
		optional: true,
	}],
	[null, 'summary', false, null],
];

test.each(table)('%s',
	(tag, key, forceOptionalKey, expected) => {
		expect(setOptional(tag, key, forceOptionalKey)).toStrictEqual(expected);
	},
);