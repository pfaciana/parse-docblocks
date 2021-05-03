function setSignature(obj) {
	if (typeof obj !== 'object' || obj === null || !('type' in obj) || !('desc' in obj)) {
		return obj;
	}

	if (typeof obj.type == 'string' && obj.type.includes('(')) {
		obj.desc = obj.type + ' ' + obj.desc;
		obj.type = null;
	}

	if (!obj.desc.indexOf('(')) {
		return obj;
	}

	let openCount = 0, endIndex = 0;
	for (let i in obj.desc) {
		if (obj.desc.hasOwnProperty(i)) {
			if (obj.desc[i] === '(') {
				openCount++;
			}
			if (obj.desc[i] === ')') {
				openCount--;
				if (openCount === 0) {
					endIndex = +i + 1;
					break;
				}
			}
		}
	}

	if (!endIndex) {
		return obj;
	}

	obj.name = obj.desc.substr(0, endIndex);
	obj.desc = obj.desc.substr(endIndex).trim();

	return obj;
}

module.exports = setSignature;