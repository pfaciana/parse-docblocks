const getTagSectionKeys = require('./../getTagSectionKeys');
const {isVariablePragma, isTypedPragma} = getTagSectionKeys;

function parseType(obj, config = {}) {
	config = {...{typeToArray: false}, ...config};

	const tagName = obj.tagName[0] === '@' ? obj.tagName : '@' + obj.tagName;

	if (isVariablePragma(tagName)) {
		if (obj.type && obj.type[0] === '(' && obj.type.slice(-1) === ')') {
			obj.type = obj.type.slice(1, -1);
		}
		if (obj.type && obj.type[0] === '{' && obj.type.slice(-1) === '}') {
			obj.type = obj.type.slice(1, -1);
		}
	}

	if (config.typeToArray && isTypedPragma(tagName)) {
		obj.type = typeof obj.type === 'string' ? obj.type.split('|') : (typeof obj.type === 'undefined' || obj.type === null ? [] : [obj.type]);
	}

	return obj;
}

module.exports = parseType;