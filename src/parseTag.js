const normalizePragma = require('./filters/normalizePragma');
const getTagSectionKeys = require('./getTagSectionKeys');

function parseTag(line, config = {}) {
	let tagName, remaining, matches;
	[, tagName, remaining] = line.match(/^(\S*)\s*([\S\s]*)/);

	tagName = normalizePragma(tagName);

	const keys = getTagSectionKeys(tagName);

	let tag = {tagName, type: null, name: null, desc: null};

	if ((matches = remaining.match(new RegExp(`^${'(\\S*)\\s*'.repeat(keys.length - 1)}([\\S\\s]*)`)))) {
		if (matches.filter(Boolean).length && keys.length > matches.filter(Boolean).length) {
			// if th regex match finds less than the keys are expecting skip the 1st key
			tag[keys[1]] = matches[1].trim();
			keys.length > 2 && (tag[keys[2]] = matches.length > 2 ? matches[2].trim() : '');
		} else {
			for (let i = 1; i <= keys.length; i++) {
				tag[keys[i - 1]] = matches[i].trim();
			}
		}
	}

	return tag;
}

module.exports = parseTag;