function setVariadic(obj, key = 'name') {
	if (key in obj && typeof obj[key] === 'string' && obj[key].length > 3 && obj[key].substring(0, 3) === '...') {
		obj[key] = obj[key].slice(3);
		obj.variadic = true;
	}

	return obj;
}

module.exports = setVariadic;