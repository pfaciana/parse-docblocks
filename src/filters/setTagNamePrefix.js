function setTagNamePrefix(obj, config = {}) {
	if (obj.tagName) {
		if (config.prefixPragmas === true && obj.tagName[0] !== '@') {
			obj.tagName = '@' + obj.tagName;
		}

		if (config.prefixPragmas === false && obj.tagName[0] === '@') {
			obj.tagName = obj.tagName.substring(1);
		}
	}

	return obj;
}

module.exports = setTagNamePrefix;