const subKeysToPromote = ['optional', 'defaultValue'];

function promoteKeysFromNestedBlocks(obj, key, nestedBlocks) {
	if (obj[key] in nestedBlocks) {

		const uid = obj[key];
		obj[key] = nestedBlocks[uid];
		delete nestedBlocks[uid];

		subKeysToPromote.forEach(subKey => {
			if (subKey in obj[key]) {
				obj[subKey] = obj[key][subKey];
				delete obj[key][subKey];
			}
		});

	}

	return obj;
}

module.exports = promoteKeysFromNestedBlocks;