function setOptional(tag, key = 'desc', forceOptionalKey = true) {
	if (typeof tag !== 'object' || tag === null || ('optional' in tag && tag.optional)) {
		return tag;
	}

	if (forceOptionalKey) {
		tag.optional ??= false;
	}

	if (key in tag && typeof tag[key] === 'string') {
		let matches;
		if ((matches = tag[key].match(/^[^a-zA-Z\d\s]?Optionall?y?[^a-zA-Z\d\s]+\s*([\S\s]*)$/im)) //
			|| (matches = tag[key].match(/^([\S\s]*[^a-zA-Z\d])[^a-zA-Z\d]Optional[^a-zA-Z\d\s]?$/im)) //
			|| (matches = tag[key].match(/^([\S\s]+[^a-zA-Z\d])[^a-zA-Z\d]Optional[^a-zA-Z\d]([^a-zA-Z\d][\S\s]+)$/im))) {
			tag[key] = matches.slice(1).join('').trim();
			tag.optional = true;
		}
	}

	if ('name' in tag && typeof tag.name === 'string') {
		if (tag.name[0] === '[' && tag.name.slice(-1) === ']' && (tag.optional = true)) {
			tag.name = tag.name.slice(1, -1);
		}

		if (tag.name.slice(-1) === '?' && (tag.optional = true)) {
			tag.name = tag.name.slice(0, -1);
		}
	}

	return tag;
}

module.exports = setOptional;