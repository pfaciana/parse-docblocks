function trimName(name) {
	name = name.replace(new RegExp('^[\\\\\$]+', 'g'), '');
	name = name.replace(new RegExp('[\(\)]+$', 'g'), '');

	return name;
}

function parseNamespace(name, item = null) {
	let namespace = trimName(name).split('\\');
	name = namespace.pop();
	name = item ? [name, trimName(item)] : trimName(name);
	return {namespace, name};
}

function parseRelativeName(obj) {
	if (!obj.name || obj.name.indexOf(' ') > -1) {
		obj.type = null;
		return obj;
	}

	if (/^[\\]?[A-Z_]+$/.test(obj.name) //
		|| /^[\\]?[A-Za-z0-9_\\]*::[A-Z_]+$/.test(obj.name) //
		|| /^[\\]?[A-Za-z0-9_\\]*->[A-Z_]+$/.test(obj.name)) {
		obj.type = 'constant';
		obj.name = obj.name.replace('->', '::')
		let [className, constantName = null] = obj.name.split('::');
		obj.name = constantName ? parseNamespace(className, constantName) : parseNamespace(className);
		return obj;
	}

	if (/^[\\]?[A-Z][A-Za-z0-9_\\]+$/.test(obj.name)) {
		obj.type = 'class';
		obj.name = parseNamespace(obj.name);
		return obj;
	}

	if (/^[\\]?[A-Za-z0-9_\\]*\$[A-Za-z0-9_]+$/.test(obj.name)) {
		obj.type = 'variable';
		obj.name = parseNamespace(obj.name);
		return obj;
	}

	if (/^[\\]?\$?[A-Za-z0-9_\\]+\(?\)?$/.test(obj.name)) {
		obj.type = 'function';
		obj.name = parseNamespace(obj.name);
		return obj;
	}

	if (/^[\\]?\$?[A-Za-z0-9_\\]+::\$[A-Za-z0-9_]+$/.test(obj.name) //
		|| /^[\\]?\$?[A-Za-z0-9_\\]+->\$[A-Za-z0-9_]+$/.test(obj.name)) {
		obj.type = 'property';
		obj.name = obj.name.replace('->', '::')
		let [className, propertyName] = obj.name.split('::');
		obj.name = parseNamespace(className, propertyName);
		return obj;
	}

	if (/^[\\]?\$?[A-Za-z0-9_\\]+::\$?[A-Za-z0-9_]+\(\)$/.test(obj.name) //
		|| /^[\\]?\$?[A-Za-z0-9_\\]+->\$?[A-Za-z0-9_]+\(\)$/.test(obj.name) //
		|| /^[\\]?\$?[A-Za-z0-9_\\]+->[A-Za-z0-9_]+$/.test(obj.name) //
		|| /^[\\]?[A-Za-z0-9_\\]+::[A-Za-z0-9_]+$/.test(obj.name) //
		|| /^[\\]?[A-Za-z0-9_\\]+->[A-Za-z0-9_]+$/.test(obj.name)) {
		obj.type = 'method';
		obj.name = obj.name.replace('->', '::')
		let [className, methodName] = obj.name.split('::');
		obj.name = parseNamespace(className, methodName);
		return obj;
	}

	return obj;
}

module.exports = parseRelativeName;
module.exports.trimName = trimName;