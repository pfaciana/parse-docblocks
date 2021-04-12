const getLocationIndexes = require('./getLocationIndexes');
const trimLine = require('./trimLine');

const table = [
	[`/**
 * Summary
 *
 * Description Line 1
 * Description Line 2
 *
 * Description Line 3
 *
 * @param string $name Name
 * @return bool TRUE on success
 * 
 */`, {
		summary: {start: 1, end: 1},
		description: {start: 3, end: 6},
		tags: {start: 8, end: 9},
	}],
	[`/**
 * Summary
 * Summary line 2
 * @param string $name Name
 * @param string $value Value
 * @return bool
 */`, {
		summary: {start: 1, end: 2},
		description: {start: -1, end: -1},
		tags: {start: 3, end: 5},
	}],
	[`/**
 * Summary
 * 
 * @since 1.2.3
 *
 * @param string $name Name
 * @return bool
 */`, {
		summary: {start: 1, end: 1},
		description: {start: -1, end: -1},
		tags: {start: 3, end: 6},
	}],
	[`/**
 * 
 * Summary
 * Summary line 2
 * 
 * Description
 * Description line 2
 *
 * @param string $name Name
 * @param string $value Value
 *                      !!note: this is a note flag
 *
 * @return bool
 *
 *
 */`, {
		summary: {start: 2, end: 3},
		description: {start: 5, end: 6},
		tags: {start: 8, end: 12},
	}],
	[`/**
 * @return bool
 */`, {
		summary: {start: -1, end: -1},
		description: {start: -1, end: -1},
		tags: {start: 1, end: 1},
	}],
	[`/**
 * Quick Summery
 */`, {
		summary: {start: 1, end: 1},
		description: {start: -1, end: -1},
		tags: {start: -1, end: -1},
	}],
	[`/** 1 liner */`, {
		summary: {start: 0, end: 0},
		description: {start: -1, end: -1},
		tags: {start: -1, end: -1},
	}],
];

test.each(table)('%s',
	(comments, expected) => {
		const lines = comments.split(`\n`).map(trimLine);
		expect(getLocationIndexes(lines)).toStrictEqual(expected);
	},
);