const validateVersion = require('./validateVersion');
const {isVersion} = validateVersion;

const versionTable = [
		['1', true],
		['1.2', true],
		['1.2.3', true],
		['1.2.3.4', true],
		['1.2.3.4.5', false],
		['1.2.3.*', true],
		['1.2.*', true],
		['1.*', true],
		['*', true],
		['1.3-dev', true],
		['3.x', true],
		['2.4-18', true],
		['2.4-beta-1', true],
		['2.4-dev', true],
		['2.2-beta-2', true],
		['0.1-dev', true],
		['0.0.4', true],
		['1.2.3', true],
		['1.2', true],
		['1.2.', true],
		['10.20.30', true],
		['01.1.1', true],
		['1.1.2-prerelease+meta', true],
		['1.1.2+meta', true],
		['1.0.0-alpha', true],
		['1.0.0-alpha.beta', true],
		['1.0.0-alpha.1', true],
		['1.0.0-alpha.0valid', true],
		['1.0.0-rc.1+build.1', false],
		['1.2.3-beta', true],
		['10.2.3-DEV-SNAPSHOT', true],
		['1.2.3.DEV', true],
		['1.2.3-0123', true],
		['1.2.3-SNAPSHOT-123', true],
		['1.0.0', true],
		['2.0.0+build.1848', true],
		['2.0.1-alpha.1227', true],
		['1.0.0-alpha+beta', true],
		['1.2.3----RC-SNAPSHOT.12.9.1--.12+788', false],
		['1.2.3----R-S.12.9.1--.12+meta', false],
		['Mar 12, 1900', false],
		['4.5.0.Directly', true],
		['', false],
		[null, false],
	]
;

test.each(versionTable)('%s',
	(version, expected = true) => {
		expect(isVersion(version)).toStrictEqual(expected);
	},
);

const table = [
	[{tagName: '@deprecated', type: 'since', desc: '1.7.0, use other',},
		{tagName: '@deprecated', type: '1.7.0', desc: 'use other',}],

	[{tagName: '@deprecated', type: '15.1', desc: ' - Use other instead.',},
		{tagName: '@deprecated', type: '15.1', desc: 'Use other instead.',}],

	[{tagName: '@deprecated', type: 'Deprecated', desc: 'since 1.9. Use other instead.',},
		{tagName: '@deprecated', type: '1.9', desc: 'Use other instead.',}],

	[{tagName: '@deprecated', type: 'since', desc: 'version 3.3, to be removed in 4.0.',},
		{tagName: '@deprecated', type: '3.3', desc: 'to be removed in 4.0.',}],

	[{tagName: '@deprecated', type: 'Use', desc: 'other',},
		{tagName: '@deprecated', type: null, desc: 'Use other',}],

	[{tagName: '@deprecated', type: null, desc: '',},
		{tagName: '@deprecated', type: null, desc: '',}],

	[{tagName: '@since', type: 'Unknown', desc: '',},
		{tagName: '@since', type: null, desc: 'Unknown',}],

	[{tagName: '@since', type: 'version', desc: '1.2.3.*.',},
		{tagName: '@since', type: '1.2.3.*', desc: '',}],

	[{tagName: '@since', type: 'version', desc: '1 use 2',},
		{tagName: '@since', type: '1', desc: 'use 2',}],
];

test.each(table)('%s',
	(tag, expected = tag) => {
		expect(validateVersion(tag)).toStrictEqual(expected);
	},
);