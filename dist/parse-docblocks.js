(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
(function (global){(function (){
"use strict";

module.exports = require('./src/parseComments');
module.exports.getLocationIndexes = require('./src/getLocationIndexes');
module.exports.getTagSectionKeys = require('./src/getTagSectionKeys');
module.exports.parseTag = require('./src/parseTag');
module.exports.trimLine = require('./src/trimLine');
module.exports.filters = require('./src/filters');

if (typeof global === 'object') {
  global.parseDocblocks = module.exports;
}

}).call(this)}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./src/filters":4,"./src/getLocationIndexes":19,"./src/getTagSectionKeys":20,"./src/parseComments":21,"./src/parseTag":22,"./src/trimLine":23}],2:[function(require,module,exports){
function getUID(length, characters) {
	var charactersLength, result = '';

	length = length != null ? length : 7;
	characters = characters != null ? characters : 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	charactersLength = characters.length;

	for (var i = 0; i < length; i++) {
		result += characters.charAt(Math.floor(Math.random() * charactersLength));
	}

	return result;
}

function getiUID(length) {
	return getUID(length, 'abcdefghijklmnopqrstuvwxyz0123456789');
}

function getUID16(length) {
	return getUID(length, '0123456789abcdef')
}

module.exports = getUID;

module.exports.getiUID = getiUID;

module.exports.getUID16 = getUID16;

},{}],3:[function(require,module,exports){
/*
 * Protection against
 *  - undefined
 *  - other non strings
 *  - non parsable strings
 */

function safeParse(data, forceParse) {
	if (typeof data !== "string") {
		return data;
	}

	forceParse = forceParse != null ? forceParse : true;

	try {
		if (data === 'NULL') {
			data = 'null';
		}

		var parsedData = JSON.parse(data.replace(/(\r\n|\n|\r|\t)/gm, ""));

		if (!forceParse && (typeof parsedData !== 'object' || parsedData === null)) {
			return data;
		}

		return parsedData;
	} catch (e) {
		return data;
	}
}

module.exports = safeParse;
},{}],4:[function(require,module,exports){
"use strict";

const parseRelativeName = require('./parseRelativeName');

const parseType = require('./parseType');

const parseUrl = require('./parseUrl');

const promoteKeysFromNestedBlocks = require('./promoteKeysFromNestedBlocks');

const setDefaultValue = require('./setDefaultValue');

const setDefaultObj = require('./setDefaultObj');

const setFlags = require('./setFlags');

const setOptional = require('./setOptional');

const setTagNamePrefix = require('./setTagNamePrefix');

const setVariableNamePrefix = require('./setVariableNamePrefix');

const setVariadic = require('./setVariadic');

const unSwapNameAndType = require('./unSwapNameAndType');

const validateVersion = require('./validateVersion');

const {
  isVariablePragma,
  isVersionPragma,
  isReferencePragmas,
  isUrlPragmas
} = require('./../getTagSectionKeys');

function runFilters(args, type = 'tag') {
  let {
    obj,
    key = 'desc',
    nestedBlocks,
    config
  } = args;

  switch (type) {
    case 'tag':
      obj = setFlags(obj);
      obj = unSwapNameAndType(obj);
      isUrlPragmas(obj.tagName) && (obj = parseUrl(obj));
      isReferencePragmas(obj.tagName) && (obj = parseRelativeName(obj));
      isVersionPragma(obj.tagName) && (obj = validateVersion(obj));
      isVariablePragma(obj.tagName) && (obj = setOptional(obj));
      isVariablePragma(obj.tagName) && (obj = setDefaultValue(obj));
      obj = parseType(obj, config);
      obj = setVariadic(obj);
      obj = promoteKeysFromNestedBlocks(obj, key, nestedBlocks);
      obj = setDefaultObj(obj, config);
      obj = setVariableNamePrefix(obj, config);
      obj = setTagNamePrefix(obj, config);
      break;

    case 'comment':
      obj = setOptional(obj, key, false);
      obj = setDefaultValue(obj, key);
      break;
  }

  return obj;
}

module.exports = runFilters;
module.exports.parseRelativeName = parseRelativeName;
module.exports.parseType = parseType;
module.exports.parseUrl = parseUrl;
module.exports.promoteKeysFromNestedBlocks = promoteKeysFromNestedBlocks;
module.exports.setDefaultValue = setDefaultValue;
module.exports.setDefaultObj = setDefaultObj;
module.exports.setFlags = setFlags;
module.exports.setOptional = setOptional;
module.exports.setTagNamePrefix = setTagNamePrefix;
module.exports.setVariableNamePrefix = setVariableNamePrefix;
module.exports.setVariadic = setVariadic;
module.exports.unSwapNameAndType = unSwapNameAndType;
module.exports.validateVersion = validateVersion;

},{"./../getTagSectionKeys":20,"./parseRelativeName":6,"./parseType":7,"./parseUrl":8,"./promoteKeysFromNestedBlocks":9,"./setDefaultObj":10,"./setDefaultValue":11,"./setFlags":12,"./setOptional":13,"./setTagNamePrefix":14,"./setVariableNamePrefix":15,"./setVariadic":16,"./unSwapNameAndType":17,"./validateVersion":18}],5:[function(require,module,exports){
"use strict";

function normalizePragma(pragma) {
  if (['@returns'].includes(pragma)) {
    return '@return';
  }

  if (['@usedby'].includes(pragma)) {
    return '@used-by';
  }

  if (['@used', '@use'].includes(pragma)) {
    return '@uses';
  }

  if (pragma.endsWith('_param')) {
    return '@param';
  }

  return pragma;
}

module.exports = normalizePragma;

},{}],6:[function(require,module,exports){
"use strict";

function trimName(name) {
  name = name.replace(new RegExp('^[\\\\\$]+', 'g'), '');
  name = name.replace(new RegExp('[\(\)]+$', 'g'), '');
  return name;
}

function parseNamespace(name, item = null) {
  let namespace = trimName(name).split('\\');
  name = namespace.pop();
  name = item ? [name, trimName(item)] : trimName(name);
  return {
    namespace,
    name
  };
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
    obj.name = obj.name.replace('->', '::');
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
    obj.name = obj.name.replace('->', '::');
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
    obj.name = obj.name.replace('->', '::');
    let [className, methodName] = obj.name.split('::');
    obj.name = parseNamespace(className, methodName);
    return obj;
  }

  return obj;
}

module.exports = parseRelativeName;
module.exports.trimName = trimName;

},{}],7:[function(require,module,exports){
"use strict";

const getTagSectionKeys = require('./../getTagSectionKeys');

const {
  isVariablePragma,
  isTypedPragma
} = getTagSectionKeys;

function parseType(obj, config = {}) {
  config = { ...{
      typeToArray: false
    },
    ...config
  };
  const tagName = obj.tagName[0] === '@' ? obj.tagName : '@' + obj.tagName;

  if (isVariablePragma(tagName)) {
    if (obj.type && obj.type[0] === '(' && obj.type.slice(-1) === ')') {
      obj.type = obj.type.slice(1, -1);
    }

    if (obj.type && obj.type[0] === '{' && obj.type.slice(-1) === '}') {
      obj.type = obj.type.slice(1, -1);
    }
  }

  if (config.typeToArray && isTypedPragma(tagName)) {
    obj.type = typeof obj.type === 'string' ? obj.type.split('|') : typeof obj.type === 'undefined' || obj.type === null ? [] : [obj.type];
  }

  return obj;
}

module.exports = parseType;

},{"./../getTagSectionKeys":20}],8:[function(require,module,exports){
"use strict";

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
  if (!('type' in obj) || !obj.type || isUrl(obj.type)) {
    return obj;
  }

  obj.desc = (obj.type + ' ' + obj.desc).trim();
  obj.type = null;
  return obj;
}

module.exports = parseUrl;
module.exports.isUrl = isUrl;

},{}],9:[function(require,module,exports){
"use strict";

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

},{}],10:[function(require,module,exports){
"use strict";

function setDefaultObj(obj, config = {}) {
  config = { ...{
      defaultObj: false
    },
    ...config
  };
  const defaultObj = {};

  if (config.defaultObj && obj.desc !== null && typeof obj.desc === 'object' && 'tags' in obj.desc) {
    obj.desc.tags.forEach(tag => {
      if ('defaultObj' in tag) {
        defaultObj[tag.name] = tag.defaultObj;
        delete tag.defaultObj;
      } else if ('defaultValue' in tag) {
        defaultObj[tag.name] = tag.defaultValue;
      } else {
        const types = Array.isArray(tag.type) ? tag.type : typeof tag.type === 'string' ? tag.type.split('|') : [];

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

},{}],11:[function(require,module,exports){
"use strict";

const safeParse = require('es5-util/js/safeParse');

function setDefaultValue(obj, key = 'desc') {
  if (typeof obj[key] === 'string') {
    let matches, content, defaultValue;

    if (matches = obj[key].match(/^([\S\s]*?(?:\. |, |\n))(?:the|has a)? ?defaults?:? (?:value)?\s*(?:is|to|of)?\s*([\S\s]*?)\.?$/i)) {
      [, content, defaultValue] = matches;
    } else if (matches = obj[key].match(/^defaults?:? (?:value?)?\s*(?:is|to|of)?\s*([\S\s]*?)\.?\s+([\S\s]*)$/i)) {
      [, defaultValue, content] = matches;
    } else if (matches = obj[key].match(/^([\S\s]*)\(defaults? ?[:;,=]? ?(?:value)? ?([\S\s]*)\)\.?[, \t]*([\S\s]*)$/i)) {
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

      if (valueMatches = defaultValue.match(/^(?:an? ?)?(?:empty )(string|array|object)\(?\)?$/i)) {
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

},{"es5-util/js/safeParse":3}],12:[function(require,module,exports){
"use strict";

const specialChar = '!';

function parseFlag(input) {
  let type, desc;
  [, type, desc] = input.match(/^(\S*)\s*([\S\s]*)/);
  type = type.replace(new RegExp(`^[${specialChar}: \t\n\u00A0]+`, 'g'), '');
  type = type.replace(new RegExp('[: \t\n\u00A0]+$', 'g'), '');
  return {
    type,
    desc: desc.trim()
  };
}

function setFlags(tag, key = 'desc') {
  var _tag$key;

  let parts = ((_tag$key = tag[key]) !== null && _tag$key !== void 0 ? _tag$key : tag[key] = '').split(`\n${specialChar}`);

  if (parts.length < 2) {
    return tag;
  }

  tag[key] = parts.shift().trim();
  tag.flags = parts.map(flag => parseFlag(flag));
  return tag;
}

module.exports = setFlags;
module.exports.parseFlag = parseFlag;

},{}],13:[function(require,module,exports){
"use strict";

function setOptional(tag, key = 'desc', forceOptionalKey = true) {
  if (typeof tag !== 'object' || tag === null || 'optional' in tag && tag.optional) {
    return tag;
  }

  if (forceOptionalKey) {
    var _tag$optional;

    (_tag$optional = tag.optional) !== null && _tag$optional !== void 0 ? _tag$optional : tag.optional = false;
  }

  if (key in tag && typeof tag[key] === 'string') {
    let matches;

    if ((matches = tag[key].match(/^[^a-zA-Z\d\s]?Optionall?y?[^a-zA-Z\d\s]+\s*([\S\s]*)$/im)) || ( //
    matches = tag[key].match(/^([\S\s]*[^a-zA-Z\d])[^a-zA-Z\d]Optional[^a-zA-Z\d\s]?$/im)) //
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

},{}],14:[function(require,module,exports){
"use strict";

function setTagNamePrefix(obj, config = {}) {
  if (obj.tagName) {
    if (config.prefixPragmas === true && obj.tagName[0] !== '@') {
      obj.tagName = '@' + obj.tagName;
    }

    if (config.prefixPragmas === false && obj.tagName[0] === '@') {
      obj.tagName = obj.tagName.substring(1);
    }
  }

  return obj;
}

module.exports = setTagNamePrefix;

},{}],15:[function(require,module,exports){
"use strict";

function setVariableNamePrefix(obj, config = {}) {
  if (obj.name) {
    if (config.prefixVariables === true && obj.name[0] !== '$') {
      obj.name = '$' + obj.name;
    }

    if (config.prefixVariables === false && obj.name[0] === '$') {
      obj.name = obj.name.substring(1);
    }
  }

  return obj;
}

module.exports = setVariableNamePrefix;

},{}],16:[function(require,module,exports){
"use strict";

function setVariadic(obj, key = 'name') {
  if (key in obj && typeof obj[key] === 'string' && obj[key].length > 3 && obj[key].substring(0, 3) === '...') {
    obj[key] = obj[key].slice(3);
    obj.variadic = true;
  }

  return obj;
}

module.exports = setVariadic;

},{}],17:[function(require,module,exports){
"use strict";

const {
  isVariablePragma
} = require('./../getTagSectionKeys');

function unSwapNameAndType(obj) {
  if (isVariablePragma(obj.tagName) && 'name' in obj && typeof obj.name === 'string' && obj.name[0] !== '$' //
  && 'type' in obj && typeof obj.type === 'string' && obj.type[0] === '$') {
    obj.name = [obj.type, obj.type = obj.name][0];
  }

  return obj;
}

module.exports = unSwapNameAndType;

},{"./../getTagSectionKeys":20}],18:[function(require,module,exports){
"use strict";

const invalidPrefixes = ['deprecated since ', 'since version ', 'since ', 'version '];

function isVersion(version) {
  return /^[\d*]+\.?(\d+[.-])?([A-Za-z0-9*+-]+[.-])?([A-Za-z0-9*+-]+)?$/.test(version);
}

function validateVersion(obj) {
  obj.desc = obj.desc.replace(new RegExp('^[- ]+', 'g'), '');

  if (isVersion(obj.type)) {
    return obj;
  }

  obj.desc = ((obj.type || '') + ' ' + obj.desc).trim();
  obj.type = null;
  invalidPrefixes.forEach(prefix => {
    if (obj.desc.toLowerCase().startsWith(prefix)) {
      obj.desc = obj.desc.slice(prefix.length);
    }
  });
  let matches;

  if (matches = obj.desc.match(new RegExp(`^(\\S*)\\s*([\\S\\s]*)`))) {
    let [, type, desc] = matches;

    if (isVersion(type = type.replace(new RegExp('[,.]+$', 'g'), ''))) {
      obj.type = type;
      obj.desc = desc.replace(new RegExp('^[- ]+', 'g'), '');
    }
  }

  return obj;
}

module.exports = validateVersion;
module.exports.isVersion = isVersion;

},{}],19:[function(require,module,exports){
"use strict";

function getLocationIndexes(lines) {
  const loc = {
    summary: {
      start: -1,
      end: -1
    },
    description: {
      start: -1,
      end: -1
    },
    tags: {
      start: -1,
      end: -1
    }
  };
  loc.tags.start = lines.findIndex((line, i) => line[0] === '@');

  if (loc.tags.start !== -1) {
    loc.tags.end = lines.length - 1;

    for (let i = loc.tags.end; i > loc.tags.start; i--) {
      if (lines[i] !== '') {
        break;
      }

      loc.tags.end--;
    }
  }

  loc.summary.start = lines.findIndex((line, i) => {
    if (line === '') {
      return false;
    }

    return loc.tags.start === -1 || i < loc.tags.start;
  });

  if (loc.summary.start !== -1) {
    loc.summary.end = lines.findIndex((line, i) => {
      if (i <= loc.summary.start) {
        return false;
      }

      return line === '' || i === loc.tags.start;
    }) - 1;

    if (loc.summary.end < loc.summary.start) {
      loc.summary.end = lines.length - 1;
    }
  }

  loc.description.start = lines.findIndex((line, i) => {
    return !(line === '' || loc.summary.end !== -1 && i <= loc.summary.end || loc.tags.start !== -1 && i >= loc.tags.start);
  });

  if (loc.description.start !== -1) {
    loc.description.end = loc.tags.start === -1 ? lines.length - 1 : loc.tags.start - 1;

    for (let i = loc.description.end; i > loc.description.start; i--) {
      if (lines[i] !== '') {
        break;
      }

      loc.description.end--;
    }
  }

  return loc;
}

module.exports = getLocationIndexes;

},{}],20:[function(require,module,exports){
"use strict";

const variablePragmas = ['@global', '@param', '@opt_param', '@type', '@staticvar', '@property', '@property-read', '@property-write'];
const typedPragmas = [...variablePragmas, ...['@var', '@return', '@const']];
const versionPragmas = ['@deprecated', '@since'];
const referencePragmas = ['@see', '@used-by', '@uses'];
const urlPragmas = ['@license', '@link'];

function isVariablePragma(pragma) {
  return variablePragmas.includes(pragma);
}

function isTypedPragma(pragma) {
  return typedPragmas.includes(pragma);
}

function isVersionPragma(pragma) {
  return versionPragmas.includes(pragma);
}

function isReferencePragmas(pragma) {
  return referencePragmas.includes(pragma);
}

function isUrlPragmas(pragma) {
  return urlPragmas.includes(pragma);
}

function getTagSectionKeys(tag) {
  if (isVariablePragma(tag)) {
    return ['type', 'name', 'desc'];
  }

  if (['@name', '@see', '@uses', '@used-by'].includes(tag)) {
    return ['name', 'desc'];
  }

  if (['@access', '@const', '@deprecated', '@license', '@link', '@method', '@return', '@since', '@throws', '@var'].includes(tag)) {
    return ['type', 'desc'];
  }

  return ['desc'];
}

module.exports = getTagSectionKeys;
module.exports.isVariablePragma = isVariablePragma;
module.exports.isTypedPragma = isTypedPragma;
module.exports.isVersionPragma = isVersionPragma;
module.exports.isReferencePragmas = isReferencePragmas;
module.exports.isUrlPragmas = isUrlPragmas;

},{}],21:[function(require,module,exports){
"use strict";

const getiUID = require('es5-util/js/getUID').getiUID;

const parseTag = require('./parseTag');

const trimLine = require('./trimLine');

const runFilters = require('./filters');

const getLocationIndexes = require('./getLocationIndexes');

const {
  isTypedPragma
} = require('./getTagSectionKeys');

function parseComments(input, config = {}) {
  const nestedBlocks = {},
        inlineBlocks = {};

  function replaceInlineBlocks(input) {
    for (const uid in inlineBlocks) {
      if (inlineBlocks.hasOwnProperty(uid) && input.includes(uid)) {
        input = input.replace(uid, inlineBlocks[uid]);
        delete inlineBlocks[uid];
        return replaceInlineBlocks(input);
      }
    }

    return input;
  }

  function parseCommentsInner(input, config = {}) {
    let matches;

    while (matches = input.match(/(.*)({[^{}]*})/im)) {
      const uid = getiUID(24);

      if (isTypedPragma(trimLine(matches[1]).split(/\s/)[0])) {
        const nestedInput = '/**' + matches[2].slice(1, -1) + '\n*/';
        nestedBlocks[uid] = matches[2];
        input = input.replace(matches[2], uid);
        nestedBlocks[uid] = parseCommentsInner(nestedInput, config);
      } else {
        inlineBlocks[uid] = matches[2];
        input = input.replace(matches[2], uid);
      }
    }

    input = replaceInlineBlocks(input);
    let comments = {
      summary: [],
      description: [],
      tags: []
    };
    const loc = getLocationIndexes(input = input.split(`\n`).map(trimLine));
    Object.keys(comments).map(key => {
      loc[key].start > -1 && (comments[key] = input.slice(loc[key].start, loc[key].end + 1));
    });
    comments.summary = comments.summary.join(' ') || null;
    comments.description = comments.description.length ? comments.description.reduce((accumulator, currentValue) => {
      return accumulator + (currentValue === '' ? '\n\n' : (accumulator.slice(-1) === '\n' ? '' : ' ') + currentValue);
    }) : null;

    for (let i = comments.tags.length - 1; i >= 0; i--) {
      if (comments.tags[i][0] !== '@') {
        comments.tags[i - 1] += '\n' + comments.tags[i];
        delete comments.tags[i];
      }
    } // Used with nesting blocks


    ['summary', 'description'].forEach(key => {
      comments = runFilters({
        obj: comments,
        key,
        config
      }, 'comment');
    });
    comments.tags = comments.tags.map(tag => {
      tag = parseTag(tag, config);
      tag = runFilters({
        obj: tag,
        config,
        nestedBlocks
      }, 'tag');
      return tag;
    }).filter(x => x);
    return comments;
  }

  return parseCommentsInner(input, config);
}

module.exports = parseComments;

},{"./filters":4,"./getLocationIndexes":19,"./getTagSectionKeys":20,"./parseTag":22,"./trimLine":23,"es5-util/js/getUID":2}],22:[function(require,module,exports){
"use strict";

const normalizePragma = require('./filters/normalizePragma');

const getTagSectionKeys = require('./getTagSectionKeys');

function parseTag(line, config = {}) {
  let tagName, remaining, matches;
  [, tagName, remaining] = line.match(/^(\S*)\s*([\S\s]*)/);
  tagName = normalizePragma(tagName);
  const keys = getTagSectionKeys(tagName);
  let tag = {
    tagName,
    type: null,
    name: null,
    desc: null
  };

  if (matches = remaining.match(new RegExp(`^${'(\\S*)\\s*'.repeat(keys.length - 1)}([\\S\\s]*)`))) {
    if (matches.filter(Boolean).length && keys.length > matches.filter(Boolean).length) {
      // if th regex match finds less than the keys are expecting skip the 1st key
      tag[keys[1]] = matches[1].trim();
      keys.length > 2 && (tag[keys[2]] = matches.length > 2 ? matches[2].trim() : '');
    } else {
      for (let i = 1; i <= keys.length; i++) {
        tag[keys[i - 1]] = matches[i].trim();
      }
    }
  }

  return tag;
}

module.exports = parseTag;

},{"./filters/normalizePragma":5,"./getTagSectionKeys":20}],23:[function(require,module,exports){
"use strict";

function trimLine(line) {
  line = line.replace(new RegExp('^[* \t\n\u00A0]+', 'g'), '');
  line = line.replace(new RegExp('[ \t\n\u00A0]+$', 'g'), '');
  line.startsWith('/**') && (line = line.substring(3));
  line.startsWith('/*') && (line = line.substring(2));
  line.endsWith('/') && (line = line.slice(0, -1));
  return line;
}

module.exports = trimLine;

},{}]},{},[1]);
