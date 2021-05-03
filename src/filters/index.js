const parseRelativeName = require('./parseRelativeName');
const parseType = require('./parseType');
const parseUrl = require('./parseUrl');
const promoteKeysFromNestedBlocks = require('./promoteKeysFromNestedBlocks');
const setDefaultValue = require('./setDefaultValue');
const setDefaultObj = require('./setDefaultObj');
const setFlags = require('./setFlags');
const setOptional = require('./setOptional');
const setTagNamePrefix = require('./setTagNamePrefix');
const setVariableNamePrefix = require('./setVariableNamePrefix');
const setVariadic = require('./setVariadic');
const unSwapNameAndType = require('./unSwapNameAndType');
const validateVersion = require('./validateVersion');
const {isVariablePragma, isVersionPragma, isReferencePragmas, isUrlPragmas} = require('./../getTagSectionKeys');

function runFilters(args, type = 'tag') {
	let {obj, key = 'desc', nestedBlocks, config,} = args;

	switch (type) {
		case 'tag':
			obj = setFlags(obj);
			obj = unSwapNameAndType(obj);
			isUrlPragmas(obj.tagName) && (obj = parseUrl(obj));
			isReferencePragmas(obj.tagName) && (obj = parseRelativeName(obj));
			isVersionPragma(obj.tagName) && (obj = validateVersion(obj));
			(['@param', '@type'].includes(obj.tagName)) && (obj = setOptional(obj, 'desc', obj.tagName === '@param'));
			isVariablePragma(obj.tagName) && (obj = setDefaultValue(obj));
			obj = parseType(obj, config);
			obj = setVariadic(obj);
			obj = promoteKeysFromNestedBlocks(obj, key, nestedBlocks);
			obj = setDefaultObj(obj, config);
			obj = setVariableNamePrefix(obj, config);
			obj = setTagNamePrefix(obj, config);
			break;
		case 'comment':
			obj = setOptional(obj, key, false);
			obj = setDefaultValue(obj, key);
			break;
	}

	return obj;
}

module.exports = runFilters;
module.exports.parseRelativeName = parseRelativeName;
module.exports.parseType = parseType;
module.exports.parseUrl = parseUrl;
module.exports.promoteKeysFromNestedBlocks = promoteKeysFromNestedBlocks;
module.exports.setDefaultValue = setDefaultValue;
module.exports.setDefaultObj = setDefaultObj;
module.exports.setFlags = setFlags;
module.exports.setOptional = setOptional;
module.exports.setTagNamePrefix = setTagNamePrefix;
module.exports.setVariableNamePrefix = setVariableNamePrefix;
module.exports.setVariadic = setVariadic;
module.exports.unSwapNameAndType = unSwapNameAndType;
module.exports.validateVersion = validateVersion;