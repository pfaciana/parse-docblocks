const getTagSectionKeys = require('./getTagSectionKeys');
const setFlags = require('./setFlags');
const setOptional = require('./setOptional');
const setDefaultValue = require('./setDefaultValue');
const {variablePragmas, typedPragmas} = getTagSectionKeys;

function parseType(obj, config = {}) {
	config = {...{typeToArray: false}, ...config};

	const tagName = obj.tagName[0] === '@' ? obj.tagName : '@' + obj.tagName;

	if (config.typeToArray && typedPragmas.includes(tagName)) {
		obj.type = obj.type.split('|');
	}

	return obj;
}

function parseTag(line, config = {}) {
	config = {...{prefixPragmas: null, prefixVariables: null}, ...config};

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

	if (tag.tagName) {
		if (config.prefixPragmas === true && tag.tagName[0] !== '@') {
			tag.tagName = '@' + tag.tagName;
		}

		if (config.prefixPragmas === false && tag.tagName[0] === '@') {
			tag.tagName = tag.tagName.substring(1);
		}
	}

	if (tag.name) {
		if (config.prefixVariables === true && tag.name[0] !== '$') {
			tag.name = '$' + tag.name;
		}

		if (config.prefixVariables === false && tag.name[0] === '$') {
			tag.name = tag.name.substring(1);
		}
	}

	tag = parseType(tag, config);

	return tag;
}

module.exports = parseTag;

module.exports.parseType = parseType;