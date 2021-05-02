const safeParse = require('es5-util/js/safeParse');

function setDefaultValue(obj, key = 'desc') {
	if (typeof obj[key] === 'string') {
		let matches, content, defaultValue;
		if ((matches = obj[key].match(/^([\S\s]*?(?:\. |, |\n))(?:the|has a)? ?defaults?:? (?:value)?\s*(?:is|to|of)?\s*([\S\s]*?)\.?$/i))) {
			[, content, defaultValue] = matches;
		} else if ((matches = obj[key].match(/^defaults?:? (?:value?)?\s*(?:is|to|of)?\s*([\S\s]*?)\.?\s+([\S\s]*)$/i))) {
			[, defaultValue, content] = matches;
		} else if ((matches = obj[key].match(/^([\S\s]*)\(defaults? ?[:;,=]? ?(?:value)? ?([\S\s]*)\)\.?[, \t]*([\S\s]*)$/i))) {
			content = matches[1].trim() + ' ' + matches[3].trim();
			defaultValue = matches[2];
		}

		if (matches) {
			// trim the period from the end of the sentence
			if (defaultValue.slice(-1) === '.') {
				defaultValue = defaultValue.slice(0, -1);
			}

			while (/^`[^`]*`$/.test(defaultValue) || /^'[^']*'$/.test(defaultValue) || /^"[^"]*"$/.test(defaultValue)) {
				defaultValue = defaultValue.slice(1, -1);
			}

			let valueMatches;
			if ((valueMatches = defaultValue.match(/^(?:an? ?)?(?:empty )(string|array|object)\(?\)?$/i))) {
				[, defaultValue] = valueMatches;
				if (defaultValue === 'string') {
					defaultValue = '';
				}
			}

			if (['array', 'array()'].includes(defaultValue)) {
				defaultValue = '[]';
			} else if (defaultValue === 'object') {
				defaultValue = '{}';
			}

			content = content.trim();

			if (content.slice(-1) === ',') {
				content = content.slice(0, -1);
			}

			obj[key] = content;
			obj.defaultValue = safeParse(defaultValue.trim());
		}
	}

	return obj;
}

module.exports = setDefaultValue;