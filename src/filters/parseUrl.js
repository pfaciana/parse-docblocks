function isUrl(str) {
	var pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
		'((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
		'((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
		'(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
		'(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
		'(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
	return !!pattern.test(str);
}

function parseUrl(obj) {
	if (!('type' in obj)|| !obj.type || isUrl(obj.type)) {
		return obj;
	}

	obj.desc = (obj.type + ' ' + obj.desc).trim();
	obj.type = null;

	return obj;
}

module.exports = parseUrl;
module.exports.isUrl = isUrl;