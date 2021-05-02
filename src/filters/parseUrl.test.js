const parseUrl = require('./parseUrl');

const table = [
	[{
		"desc": "MIT License",
		"name": null,
		"tagName": "@license",
		"type": "https://opensource.org/licenses/MIT"
	}],
	[{
		"desc": "Description of syntax.",
		"name": null,
		"tagName": "@link",
		"type": "http://php.net/sprintf"
	}],
	[{
		"desc": "License",
		"name": null,
		"tagName": "@license",
		"type": "MIT"
	}, {
		"desc": "MIT License",
		"name": null,
		"tagName": "@license",
		"type": null
	}],
	[{
		"desc": "MIT License",
		"name": null,
		"tagName": "@license",
		"type": null
	}],
];

test.each(table)('%s',
	(obj, expected = obj) => {
		expect(parseUrl(obj)).toStrictEqual(expected);
	},
);