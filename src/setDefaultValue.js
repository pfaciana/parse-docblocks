const safeParse = require('es5-util/js/safeParse');

function setDefaultValue(obj, key = 'desc') {
	let matches;
	if (typeof obj[key] === 'string' && (matches = obj[key].match(/([\S\s]*(?:\. |\n))Default(?: (?:is|to))?\s+([\S\s]*)/))) {
		let content, defaultValue;
		[, content, defaultValue] = matches;

		// trim the period from the end of the sentence
		if (defaultValue.slice(-1) === '.') {
			defaultValue = defaultValue.slice(0, -1);
		}

		obj[key] = content.trim();
		obj.defaultValue = safeParse(defaultValue.trim());
	}

	return obj;
}

module.exports = setDefaultValue;