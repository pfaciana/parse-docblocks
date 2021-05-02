function setDefaultObj(obj, config = {}) {
	config = {...{defaultObj: false}, ...config};
	const defaultObj = {};

	if (config.defaultObj && obj.desc !== null && typeof obj.desc === 'object' && 'tags' in obj.desc) {
		obj.desc.tags.forEach(tag => {
			if ('defaultObj' in tag) {
				defaultObj[tag.name] = tag.defaultObj;
				delete tag.defaultObj;
			} else if ('defaultValue' in tag) {
				defaultObj[tag.name] = tag.defaultValue;
			} else {
				const types = Array.isArray(tag.type) ? tag.type : (typeof tag.type === 'string' ? tag.type.split('|') : []);
				if (types.includes('object')) {
					defaultObj[tag.name] = {};
				} else if (types.includes('array')) {
					defaultObj[tag.name] = [];
				} else if (types.includes('int')) {
					defaultObj[tag.name] = 0;
				} else if (types.includes('bool')) {
					defaultObj[tag.name] = false;
				} else if (types.includes('string')) {
					defaultObj[tag.name] = '';
				} else {
					defaultObj[tag.name] = null;
				}
			}
		});
		obj.defaultObj = defaultObj;
	}

	return obj;
}


module.exports = setDefaultObj;