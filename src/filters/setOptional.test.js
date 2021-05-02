const setOptional = require('./setOptional');

const table = [
	[{
		name: 'someParam', desc: 'Some Description.',
	}, undefined, undefined, {
		name: 'someParam', desc: 'Some Description.', optional: false,
	}],
	[{
		name: 'someParam', desc: 'Some Description.',
	}, undefined, false, {
		name: 'someParam', desc: 'Some Description.',
	}],
	[{
		name: 'someParam', desc: 'Some Description.', optional: true,
	}, undefined, undefined, {
		name: 'someParam', desc: 'Some Description.', optional: true,
	}],
	[{
		name: 'someParam', desc: 'Optional. Some Description.',
	}, undefined, undefined, {
		name: 'someParam', desc: 'Some Description.', optional: true,
	}],
	[{
		name: 'someParam', desc: 'Optional, Some Description.',
	}, undefined, undefined, {
		name: 'someParam', desc: 'Some Description.', optional: true,
	}],
	[{
		name: 'someParam', desc: 'Optional: Some Description.',
	}, undefined, undefined, {
		name: 'someParam', desc: 'Some Description.', optional: true,
	}],
	[{
		name: 'someParam', desc: 'OPTIONAL! Some Description.',
	}, undefined, undefined, {
		name: 'someParam', desc: 'Some Description.', optional: true,
	}],
	[{
		name: 'someParam', desc: 'Optionally, Some Description.',
	}, undefined, undefined, {
		name: 'someParam', desc: 'Some Description.', optional: true,
	}],
	[{
		name: 'someParam', desc: '(Optional) Some Description.',
	}, undefined, undefined, {
		name: 'someParam', desc: 'Some Description.', optional: true,
	}],
	[{
		name: 'someParam', desc: '[optional] Some Description.',
	}, undefined, undefined, {
		name: 'someParam', desc: 'Some Description.', optional: true,
	}],
	[{
		name: 'someParam', desc: 'Some Description. Optional',
	}, undefined, undefined, {
		name: 'someParam', desc: 'Some Description.', optional: true,
	}],
	[{
		name: 'someParam', desc: 'Some Description. Optional.',
	}, undefined, undefined, {
		name: 'someParam', desc: 'Some Description.', optional: true,
	}],
	[{
		name: 'someParam', desc: 'Some Description (optional)',
	}, undefined, undefined, {
		name: 'someParam', desc: 'Some Description', optional: true,
	}],
	[{
		name: 'someParam', desc: 'Something before. (optional) Something after.',
	}, undefined, undefined, {
		name: 'someParam', desc: 'Something before.  Something after.', optional: true,
	}],
	[{
		name: 'someParam', desc: 'Something before. Optional, Something after.',
	}, undefined, undefined, {
		name: 'someParam', desc: 'Something before. Something after.', optional: true,
	}],
	[{
		name: 'someParam', desc: 'Something before. Optional. Something after.',
	}, undefined, undefined, {
		name: 'someParam', desc: 'Something before. Something after.', optional: true,
	}],
	[{
		name: '[someParam]', desc: 'Some Description.',
	}, undefined, undefined, {
		name: 'someParam', desc: 'Some Description.', optional: true,
	}],
	[{
		name: 'someParam?', desc: 'Some Description.',
	}, undefined, undefined, {
		name: 'someParam', desc: 'Some Description.', optional: true,
	}],
	[{
		name: '[someParam?]', desc: 'Optional. Some Description.',
	}, undefined, undefined, {
		name: 'someParam', desc: 'Some Description.', optional: true,
	}],
	[{
		summary: 'Some Summary.',
	}, 'summary', undefined, {
		summary: 'Some Summary.', optional: false,
	}],
	[{
		summary: 'Some Summary.',
	}, 'summary', false, {
		summary: 'Some Summary.',
	}],
	[{
		summary: 'Optional. Some Summary.',
	}, 'summary', undefined, {
		summary: 'Some Summary.', optional: true,
	}],
	[{
		summary: '(Optional) Some Summary.',
	}, 'summary', undefined, {
		summary: 'Some Summary.', optional: true,
	}],
	[{
		name: 'This is not optional.',
	}, undefined, undefined, {
		name: 'This is not optional.', optional: false,
	}],
	[{
		name: 'This is not an optional parameter.',
	}, undefined, undefined, {
		name: 'This is not an optional parameter.', optional: false,
	}],
	[null, 'summary', false, null],
];

test.each(table)('%s',
	(tag, key, forceOptionalKey, expected) => {
		expect(setOptional(tag, key, forceOptionalKey)).toStrictEqual(expected);
	},
);