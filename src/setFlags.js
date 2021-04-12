const specialChar = '!';

function parseFlag(input) {
	let type, desc;
	[, type, desc] = input.match(/^(\S*)\s*([\S\s]*)/);
	type = type.replace(new RegExp(`^[${specialChar}: \t\n\u00A0]+`, 'g'), '');
	type = type.replace(new RegExp('[: \t\n\u00A0]+$', 'g'), '');

	return {type, desc: desc.trim()};
}

function setFlags(tag, key = 'desc') {
	let parts = tag[key].split(`\n${specialChar}`);

	if (parts.length < 2) {
		return tag;
	}

	tag[key] = parts.shift().trim();
	tag.flags = parts.map(flag => parseFlag(flag));

	return tag;
}

module.exports = setFlags;
module.exports.parseFlag = parseFlag;