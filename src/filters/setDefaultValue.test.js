const setDefaultValue = require('./setDefaultValue');

const table = [
	[{desc: 'Some summary. Default is 5'}, undefined, {desc: 'Some summary.', defaultValue: 5,}],
	[{desc: 'Some summary. Default to 5'}, undefined, {desc: 'Some summary.', defaultValue: 5,}],
	[{desc: 'Some summary. default is 5'}, undefined, {desc: 'Some summary.', defaultValue: 5,}],
	[{desc: 'Some summary. Default true.'}, undefined, {desc: 'Some summary.', defaultValue: true,}],
	[{other: 'Some summary. Default is 5'}, 'other', {other: 'Some summary.', defaultValue: 5,}],
	[{desc: 'a\nb\nc. Default is 5'}, undefined, {desc: 'a\nb\nc.', defaultValue: 5,}],
	[{desc: 'a\nb\nc\nDefault is 5'}, undefined, {desc: 'a\nb\nc', defaultValue: 5,}],
	[{desc: "Some summary. Default 'Edit', 'View'."}, undefined, {desc: 'Some summary.', defaultValue: "'Edit', 'View'",}],
	[{desc: "Some summary. Default 'mysql'."}, undefined, {desc: 'Some summary.', defaultValue: 'mysql',}],
	[{desc: 'Some summary. Default 0.'}, undefined, {desc: 'Some summary.', defaultValue: 0,}],
	[{desc: 'Some summary. Default 1 MB.'}, undefined, {desc: 'Some summary.', defaultValue: '1 MB',}],
	[{desc: 'Some summary. Default empty.'}, undefined, {desc: 'Some summary.', defaultValue: 'empty',}],
	[{desc: "Some summary. Default is 'active'."}, undefined, {desc: 'Some summary.', defaultValue: 'active',}],
	[{desc: 'Some summary. Default is blank.'}, undefined, {desc: 'Some summary.', defaultValue: 'blank',}],
	[{desc: 'Some summary. Default null.'}, undefined, {desc: 'Some summary.', defaultValue: null,}],
	[{desc: "Some summary. Default to false - don't display."}, undefined, {desc: 'Some summary.', defaultValue: "false - don't display",}],
	[{desc: 'Some summary. Default: 1'}, undefined, {desc: 'Some summary.', defaultValue: 1,}],
	[{desc: 'Some summary. Default: BLANK which uses mode based on settings.'}, undefined, {desc: 'Some summary.', defaultValue: 'BLANK which uses mode based on settings',}],
	[{desc: 'Some summary. Default: false.'}, undefined, {desc: 'Some summary.', defaultValue: false,}],
	[{desc: 'Some summary. Defaults to <STD_PROP_LIST>.'}, undefined, {desc: 'Some summary.', defaultValue: '<STD_PROP_LIST>',}],
	[{desc: 'Some summary. Defaults to `%01.2f %s`.'}, undefined, {desc: 'Some summary.', defaultValue: '%01.2f %s',}],
	[{desc: 'Some summary, defaults to `3`.'}, undefined, {desc: 'Some summary', defaultValue: 3,}],
	[{desc: 'Some summary. Defaults to `null`.'}, undefined, {desc: 'Some summary.', defaultValue: null,}],
	[{desc: 'Some summary. Defaults to `true`.'}, undefined, {desc: 'Some summary.', defaultValue: true,}],
	[{desc: 'Some summary. Defaults to all headers.'}, undefined, {desc: 'Some summary.', defaultValue: 'all headers',}],
	[{desc: 'Some summary. Defaults to an empty string.'}, undefined, {desc: 'Some summary.', defaultValue: '',}],
	[{desc: 'Some summary. Defaults to empty object'}, undefined, {desc: 'Some summary.', defaultValue: {},}],
	[{desc: 'Some summary. Defaults to empty array.'}, undefined, {desc: 'Some summary.', defaultValue: [],}],
	[{desc: 'Some summary. Defaults to empty string.'}, undefined, {desc: 'Some summary.', defaultValue: '',}],
	[{desc: 'Some summary. Defaults to null, which will return subscriptions for all orders.'}, undefined, {desc: 'Some summary.', defaultValue: 'null, which will return subscriptions for all orders',}],
	[{desc: 'Some summary. Defaults to the current user.'}, undefined, {desc: 'Some summary.', defaultValue: 'the current user',}],
	[{desc: 'Some summary. Defaults to wp.customize.previewer.'}, undefined, {desc: 'Some summary.', defaultValue: 'wp.customize.previewer',}],
	[{desc: 'Some summary. The default value is 0.'}, undefined, {desc: 'Some summary.', defaultValue: 0,}],
	[{desc: 'Some summary. The default value is an empty array.'}, undefined, {desc: 'Some summary.', defaultValue: [],}],
	[{desc: 'Some summary. The default value is NULL.'}, undefined, {desc: 'Some summary.', defaultValue: null,}],
	[{desc: 'Some summary. The default value is set in DEFAULT_KEY.'}, undefined, {desc: 'Some summary.', defaultValue: 'set in DEFAULT_KEY',}],
	[{desc: 'Some summary. The default value is <code>+1 hour</code>.'}, undefined, {desc: 'Some summary.', defaultValue: '<code>+1 hour</code>',}],
	[{desc: 'Some summary. Has a default value of <code>CFSimpleXML</code>'}, undefined, {desc: 'Some summary.', defaultValue: '<code>CFSimpleXML</code>',}],
	[{desc: '(default: array())'}, undefined, {desc: '', defaultValue: [],}],
	[{desc: '(default: array()) Some summary'}, undefined, {desc: 'Some summary', defaultValue: [],}],
	[{desc: '(default: array()).'}, undefined, {desc: '', defaultValue: [],}],
	[{desc: 'Some summary. (default: false).'}, undefined, {desc: 'Some summary.', defaultValue: false,}],
	[{desc: 'Some summary (default `[]`).'}, undefined, {desc: 'Some summary', defaultValue: [],}],
	[{desc: 'Some summary (default, restore, legacy).'}, undefined, {desc: 'Some summary', defaultValue: 'restore, legacy',}],
	[{desc: 'Some summary (default: array).'}, undefined, {desc: 'Some summary', defaultValue: [],}],
	[{desc: 'Default: 0755. Some summary.'}, undefined, {desc: 'Some summary.', defaultValue: '0755',}],
	[{desc: 'Default: false. Some summary.'}, undefined, {desc: 'Some summary.', defaultValue: false,}],
	[{desc: 'Default: true Some summary.'}, undefined, {desc: 'Some summary.', defaultValue: true,}],
	[{desc: 'Default: true. Some summary.'}, undefined, {desc: 'Some summary.', defaultValue: true,}],
	[{desc: 'Some summary without default value.'}, undefined, {desc: 'Some summary without default value.',}],
	[{desc: 'An array of default args.'}, undefined, {desc: 'An array of default args.',}],
];

test.each(table)('%s',
	(line, key, expected) => {
		expect(setDefaultValue(line, key)).toStrictEqual(expected);
	},
);