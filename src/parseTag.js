const getTagSectionKeys = require('./getTagSectionKeys');
const setFlags = require('./setFlags');
const setOptional = require('./setOptional');
const setDefaultValue = require('./setDefaultValue');
const {variablePragmas} = getTagSectionKeys;

function parseTag(line) {
	let tagName, remaining, matches;
	[, tagName, remaining] = line.match(/^(\S*)\s*([\S\s]*)/);

	const keys = getTagSectionKeys(tagName);

	let tag = {tagName, type: null, name: null, desc: null};

	if ((matches = remaining.match(new RegExp(`^${'(\\S*)\\s*'.repeat(keys.length - 1)}([\\S\\s]*)`)))) {
		for (let i = 1; i <= keys.length; i++) {
			tag[keys[i - 1]] = matches[i].trim();
		}
	}

	tag = setFlags(tag);

	if (variablePragmas.includes(tagName)) {
		tag = setOptional(tag);
		if (tag.type[0] === '{' && tag.type.slice(-1) === '}') {
			tag.type = tag.type.slice(1, -1);
		}
		tag = setDefaultValue(tag);
	}

	return tag;
}

module.exports = parseTag;