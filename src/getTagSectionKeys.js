const variablePragmas = ['@global', '@param', '@type', '@staticvar', '@property', '@property-read', '@property-write'];
const typedPragmas = [...variablePragmas, ...['@var', '@return']];

function getTagSectionKeys(tag) {
	if (variablePragmas.includes(tag)) {
		return ['type', 'name', 'desc'];
	}

	if (['@access', '@deprecated', '@example', '@license', '@link', '@method',
		'@name', '@return', '@since', '@throws', '@uses', '@var',].includes(tag)) {
		return ['type', 'desc'];
	}

	return ['desc'];
}

module.exports = getTagSectionKeys;
module.exports.variablePragmas = variablePragmas;
module.exports.typedPragmas = typedPragmas;