const variablePragmas = ['@global', '@param', '@opt_param', '@type', '@staticvar', '@property', '@property-read', '@property-write'];
const typedPragmas = [...variablePragmas, ...['@var', '@return', '@const']];
const versionPragmas = ['@deprecated', '@since'];
const referencePragmas = ['@see', '@used-by', '@uses'];
const urlPragmas = ['@license', '@link'];

function isVariablePragma(pragma) {
	return variablePragmas.includes(pragma);
}

function isTypedPragma(pragma) {
	return typedPragmas.includes(pragma);
}

function isVersionPragma(pragma) {
	return versionPragmas.includes(pragma);
}

function isReferencePragmas(pragma) {
	return referencePragmas.includes(pragma);
}

function isUrlPragmas(pragma) {
	return urlPragmas.includes(pragma);
}

function getTagSectionKeys(tag) {
	if (isVariablePragma(tag)) {
		return ['type', 'name', 'desc'];
	}

	if (['@name', '@see', '@uses', '@used-by',].includes(tag)) {
		return ['name', 'desc'];
	}

	if (['@access', '@const', '@deprecated', '@license', '@link',
		'@method', '@return', '@since', '@throws', '@var',].includes(tag)) {
		return ['type', 'desc'];
	}

	return ['desc'];
}

module.exports = getTagSectionKeys;
module.exports.isVariablePragma = isVariablePragma;
module.exports.isTypedPragma = isTypedPragma;
module.exports.isVersionPragma = isVersionPragma;
module.exports.isReferencePragmas = isReferencePragmas;
module.exports.isUrlPragmas = isUrlPragmas;