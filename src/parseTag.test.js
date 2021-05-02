const parseTag = require('./parseTag');

const table = [
	['@param string|array $cookie Can be either a url encode string or a parsed array', {
		tagName: '@param',
		type: 'string|array',
		name: '$cookie',
		desc: 'Can be either a url encode string or a parsed array',
	}],
	['@param string      $output Optional. The required return type.\n\n\n', {
		tagName: '@param',
		type: 'string',
		name: '$output',
		desc: 'Optional. The required return type.',
	}],
	['@param string      [$output] The required return type.', {
		tagName: '@param',
		type: 'string',
		name: '[$output]',
		desc: 'The required return type.',
	}],
	['@param string      $output? The required return type.', {
		tagName: '@param',
		type: 'string',
		name: '$output?',
		desc: 'The required return type.',
	}],
	['@param string      $output? Optional. The required return type.', {
		tagName: '@param',
		type: 'string',
		name: '$output?',
		desc: 'Optional. The required return type.',
	}],
	['@param {string}      $output The required return type.', {
		tagName: '@param',
		type: '{string}',
		name: '$output',
		desc: 'The required return type.',
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
	['@param null|array $output', {
		tagName: '@param',
		type: 'null|array',
		name: '$output',
		desc: '',
	}],
	['@param $name', {
		tagName: '@param',
		type: null,
		name: '$name',
		desc: '',
	}],
	['@param\t$array (array)', {
		tagName: '@param',
		type: '$array',
		name: '(array)',
		desc: '',
	}],
	['@param $certs array of certificates', {
		tagName: '@param',
		type: '$certs',
		name: 'array',
		desc: 'of certificates',
	}],
	['@deprecated This is no longer used', {
		tagName: '@deprecated',
		type: 'This',
		name: null,
		desc: 'is no longer used',
	}],
	['@deprecated 15.1 Use this instead.', {
		tagName: '@deprecated',
		type: '15.1',
		name: null,
		desc: 'Use this instead.',
	}],
	['@since 1.2.3', {
		tagName: '@since',
		type: '1.2.3',
		name: null,
		desc: '',
	}],
	['@use self::get_value()', {
		tagName: '@uses',
		type: null,
		name: 'self::get_value()',
		desc: '',
	}],
];

test.each(table)('%s',
	(line, expected, config = {}) => {
		expect(parseTag(line, config)).toStrictEqual(expected);
	},
);