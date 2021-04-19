const getiUID = require('es5-util/js/getUID').getiUID;
const parseTag = require('./parseTag');
const trimLine = require('./trimLine');
const setOptional = require('./setOptional');
const setDefaultValue = require('./setDefaultValue');
const setDefaultObj = require('./setDefaultObj');
const getLocationIndexes = require('./getLocationIndexes');

const nestedBlocks = {};

function parseComments(input, config = {}) {
	let matches;
	while (matches = input.match(/([\S\s]*?){(\s(?:[^}{]+|{(?:[^}{]+|{[^}{]*})*})*)}([\S\s]*)/im)) {
		const uid = getiUID(24);
		const nestedInput = '/**' + matches[2] + '\n*/';
		input = matches[1] + uid + matches[3];
		nestedBlocks[uid] = parseComments(nestedInput, config);
	}

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
		comments = setOptional(comments, key, false);
		comments = setDefaultValue(comments, key);
	});
	comments.tags = (comments.tags.map(tag => {
		tag = parseTag(tag, config);
		if (tag.desc in nestedBlocks) {
			tag.desc = nestedBlocks[tag.desc];
			if ('optional' in tag.desc) {
				tag.optional = tag.desc.optional;
				delete tag.desc.optional;
			}
			if ('defaultValue' in tag.desc) {
				tag.defaultValue = tag.desc.defaultValue;
				delete tag.desc.defaultValue;
			}
		}
		tag = setDefaultObj(tag, config);
		return tag;
	})).filter(x => x);

	return comments;
}

module.exports = parseComments;