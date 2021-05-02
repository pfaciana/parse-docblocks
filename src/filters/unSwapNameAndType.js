const {isVariablePragma} = require('./../getTagSectionKeys');

function unSwapNameAndType(obj) {
	if (isVariablePragma(obj.tagName) && 'name' in obj && typeof obj.name === 'string' && obj.name[0] !== '$' //
		&& 'type' in obj && typeof obj.type === 'string' && obj.type[0] === '$') {
		obj.name = [obj.type, obj.type = obj.name][0];
	}

	return obj;
}

module.exports = unSwapNameAndType;