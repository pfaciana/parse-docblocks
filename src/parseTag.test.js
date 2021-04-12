const parseTag = require('./parseTag');

const table = [
	['@param string|array $cookie Can be either a url encode string or a parsed array', {
		tagName: '@param',
		type: 'string|array',
		name: '$cookie',
		desc: 'Can be either a url encode string or a parsed array',
		optional: false,
	}],
	['@param string      $output Optional. The required return type.\n\n\n', {
		tagName: '@param',
		type: 'string',
		name: '$output',
		desc: 'The required return type.',
		optional: true,
	}],
	['@param string      [$output] The required return type.', {
		tagName: '@param',
		type: 'string',
		name: '$output',
		desc: 'The required return type.',
		optional: true,
	}],
	['@param string      $output? The required return type.', {
		tagName: '@param',
		type: 'string',
		name: '$output',
		desc: 'The required return type.',
		optional: true,
	}],
	['@param string      $output? Optional. The required return type.', {
		tagName: '@param',
		type: 'string',
		name: '$output',
		desc: 'The required return type.',
		optional: true,
	}],
	['@param {string}      $output The required return type.', {
		tagName: '@param',
		type: 'string',
		name: '$output',
		desc: 'The required return type.',
		optional: false,
	}],
	['@return bool `TRUE` on success and `FALSE` on failure', {
		tagName: '@return',
		type: 'bool',
		name: null,
		desc: '`TRUE` on success and `FALSE` on failure',
	}],
	['@package WordPress', {
		tagName: '@package',
		type: null,
		name: null,
		desc: 'WordPress',
	}],
	['@deprecated 3.5.0 Use get_post()', {
		tagName: '@deprecated',
		type: '3.5.0',
		name: null,
		desc: 'Use get_post()',
	}],
	['@since 2.3.0', {
		tagName: '@since',
		type: '2.3.0',
		name: null,
		desc: '',
	}],
	['@some-random-custom-tag', {
		tagName: '@some-random-custom-tag',
		type: null,
		name: null,
		desc: '',
	}],
	['@some-random-custom-tag a b c d e f g', {
		tagName: '@some-random-custom-tag',
		type: null,
		name: null,
		desc: 'a b c d e f g',
	}],
];

test.each(table)('%s',
	(line, expected) => {
		expect(parseTag(line)).toStrictEqual(expected);
	},
);