function setVariableNamePrefix(obj, config = {}) {
	if (obj.name) {
		if (config.prefixVariables === true && obj.name[0] !== '$') {
			obj.name = '$' + obj.name;
		}

		if (config.prefixVariables === false && obj.name[0] === '$') {
			obj.name = obj.name.substring(1);
		}
	}

	return obj;
}

module.exports = setVariableNamePrefix;