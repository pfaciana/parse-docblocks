const getiUID = require('es5-util/js/getUID').getiUID;
const parseTag = require('./parseTag');
const trimLine = require('./trimLine');
const runFilters = require('./filters');
const getLocationIndexes = require('./getLocationIndexes');
const {isTypedPragma} = require('./getTagSectionKeys');

function parseComments(input, config = {}) {
	const nestedBlocks = {}, inlineBlocks = {};

	function replaceInlineBlocks(input) {
		for (const uid in inlineBlocks) {
			if (inlineBlocks.hasOwnProperty(uid) && input.includes(uid)) {
				input = input.replace(uid, inlineBlocks[uid]);
				delete inlineBlocks[uid];
				return replaceInlineBlocks(input);
			}
		}
		return input;
	}

	function parseCommentsInner(input, config = {}) {
		let matches;
		while ((matches = input.match(/(.*)({[^{}]*})/im))) {
			const uid = getiUID(24);
			if (isTypedPragma(trimLine(matches[1]).split(/\s/)[0])) {
				const nestedInput = '/**' + matches[2].slice(1, -1) + '\n*/';
				nestedBlocks[uid] = matches[2];
				input = input.replace(matches[2], uid);
				nestedBlocks[uid] = parseCommentsInner(nestedInput, config);
			} else {
				inlineBlocks[uid] = matches[2];
				input = input.replace(matches[2], uid);
			}
		}

		input = replaceInlineBlocks(input);

		let comments = {
			summary: [],
			description: [],
			tags: [],
		};

		const loc = getLocationIndexes(input = input.split(`\n`).map(trimLine));
		Object.keys(comments).map(key => {
			loc[key].start > -1 && (comments[key] = input.slice(loc[key].start, loc[key].end + 1));
		});

		comments.summary = comments.summary.join(' ') || null;
		comments.description = comments.description.length ? comments.description.reduce((accumulator, currentValue) => {
			return accumulator + (currentValue === '' ? '\n\n' : ((accumulator.slice(-1) === '\n' ? '' : ' ') + currentValue));
		}) : null;
		for (let i = comments.tags.length - 1; i >= 0; i--) {
			if (comments.tags[i][0] !== '@') {
				comments.tags[i - 1] += '\n' + comments.tags[i];
				delete comments.tags[i];
			}
		}
		// Used with nesting blocks
		['summary', 'description'].forEach(key => {
			comments = runFilters({obj: comments, key, config}, 'comment');
		});
		comments.tags = (comments.tags.map(tag => {
			tag = parseTag(tag, config);
			tag = runFilters({obj: tag, config, nestedBlocks}, 'tag');
			return tag;
		})).filter(x => x);

		return comments;
	}

	return parseCommentsInner(input, config);
}

module.exports = parseComments;