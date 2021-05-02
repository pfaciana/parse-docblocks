const invalidPrefixes = [
	'deprecated since ',
	'since version ',
	'since ',
	'version ',
];

function isVersion(version) {
	return (/^[\d*]+\.?(\d+[.-])?([A-Za-z0-9*+-]+[.-])?([A-Za-z0-9*+-]+)?$/).test(version);
}

function validateVersion(obj) {
	obj.desc = obj.desc.replace(new RegExp('^[- ]+', 'g'), '');

	if (isVersion(obj.type)) {
		return obj;
	}

	obj.desc = ((obj.type || '') + ' ' + obj.desc).trim();
	obj.type = null;

	invalidPrefixes.forEach(prefix => {
		if (obj.desc.toLowerCase().startsWith(prefix)) {
			obj.desc = obj.desc.slice(prefix.length);
		}
	});

	let matches;
	if ((matches = obj.desc.match(new RegExp(`^(\\S*)\\s*([\\S\\s]*)`)))) {
		let [, type, desc] = matches;
		if (isVersion(type = type.replace(new RegExp('[,.]+$', 'g'), ''))) {
			obj.type = type;
			obj.desc = desc.replace(new RegExp('^[- ]+', 'g'), '');
		}
	}

	return obj;
}

module.exports = validateVersion;
module.exports.isVersion = isVersion;
