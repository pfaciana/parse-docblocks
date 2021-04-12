function setOptional(tag, key = 'desc', forceOptionalKey = true) {
	if (typeof tag !== 'object' || tag === null || ('optional' in tag && tag.optional)) {
		return tag;
	}

	if (forceOptionalKey) {
		tag.optional ??= false;
	}

	if (key in tag && typeof tag[key] === 'string' && tag[key].substr(0, 10).toLowerCase() === 'optional. ' && (tag.optional = true)) {
		tag[key] = tag[key].slice(10);
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