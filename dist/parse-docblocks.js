(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
(function (global){(function (){
"use strict";

module.exports = require('./src/parseComments');
module.exports.getLocationIndexes = require('./src/getLocationIndexes');
module.exports.getTagSectionKeys = require('./src/getTagSectionKeys');
module.exports.variablePragmas = require('./src/getTagSectionKeys').variablePragmas;
module.exports.parseTag = require('./src/parseTag');
module.exports.setDefaultValue = require('./src/setDefaultValue');
module.exports.setDefaultObj = require('./src/setDefaultObj');
module.exports.setFlags = require('./src/setFlags');
module.exports.parseFlag = require('./src/setFlags').parseFlag;
module.exports.setOptional = require('./src/setOptional');
module.exports.trimLine = require('./src/trimLine');

if (typeof global === 'object') {
  global.parseDocblocks = module.exports;
}

}).call(this)}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./src/getLocationIndexes":4,"./src/getTagSectionKeys":5,"./src/parseComments":6,"./src/parseTag":7,"./src/setDefaultObj":8,"./src/setDefaultValue":9,"./src/setFlags":10,"./src/setOptional":11,"./src/trimLine":12}],2:[function(require,module,exports){
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

},{}],5:[function(require,module,exports){
"use strict";

const variablePragmas = ['@global', '@param', '@type', '@staticvar', '@property', '@property-read', '@property-write'];
const typedPragmas = [...variablePragmas, ...['@var', '@return']];

function getTagSectionKeys(tag) {
  if (variablePragmas.includes(tag)) {
    return ['type', 'name', 'desc'];
  }

  if (['@access', '@deprecated', '@example', '@license', '@link', '@method', '@name', '@return', '@since', '@throws', '@uses', '@var'].includes(tag)) {
    return ['type', 'desc'];
  }

  return ['desc'];
}

module.exports = getTagSectionKeys;
module.exports.variablePragmas = variablePragmas;
module.exports.typedPragmas = typedPragmas;

},{}],6:[function(require,module,exports){
"use strict";

const getiUID = require('es5-util/js/getUID').getiUID;

const parseTag = require('./parseTag');

const trimLine = require('./trimLine');

const setOptional = require('./setOptional');

const setDefaultValue = require('./setDefaultValue');

const setDefaultObj = require('./setDefaultObj');

const getLocationIndexes = require('./getLocationIndexes');

const {
  typedPragmas
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

      if (typedPragmas.includes(trimLine(matches[1]).split(/\s/)[0])) {
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
      comments = setOptional(comments, key, false);
      comments = setDefaultValue(comments, key);
    });
    comments.tags = comments.tags.map(tag => {
      tag = parseTag(tag, config);

      if (tag.desc in nestedBlocks) {
        const uid = tag.desc;
        tag.desc = nestedBlocks[uid];
        delete nestedBlocks[uid];

        if ('optional' in tag.desc) {
          tag.optional = tag.desc.optional;
          delete tag.desc.optional;
        }

        if ('defaultValue' in tag.desc) {
          tag.defaultValue = tag.desc.defaultValue;
          delete tag.desc.defaultValue;
        }
      }

      tag = setDefaultObj(tag, config);
      return tag;
    }).filter(x => x);
    return comments;
  }

  return parseCommentsInner(input, config);
}

module.exports = parseComments;

},{"./getLocationIndexes":4,"./getTagSectionKeys":5,"./parseTag":7,"./setDefaultObj":8,"./setDefaultValue":9,"./setOptional":11,"./trimLine":12,"es5-util/js/getUID":2}],7:[function(require,module,exports){
"use strict";

const getTagSectionKeys = require('./getTagSectionKeys');

const setFlags = require('./setFlags');

const setOptional = require('./setOptional');

const setDefaultValue = require('./setDefaultValue');

const {
  variablePragmas,
  typedPragmas
} = getTagSectionKeys;

function parseType(obj, config = {}) {
  config = { ...{
      typeToArray: false
    },
    ...config
  };
  const tagName = obj.tagName[0] === '@' ? obj.tagName : '@' + obj.tagName;

  if (config.typeToArray && typedPragmas.includes(tagName)) {
    obj.type = typeof obj.type === 'string' ? obj.type.split('|') : obj.type;
  }

  return obj;
}

function parseTag(line, config = {}) {
  config = { ...{
      prefixPragmas: null,
      prefixVariables: null
    },
    ...config
  };
  let tagName, remaining, matches;
  [, tagName, remaining] = line.match(/^(\S*)\s*([\S\s]*)/);
  const keys = getTagSectionKeys(tagName);
  let tag = {
    tagName,
    type: null,
    name: null,
    desc: null
  };

  if (matches = remaining.match(new RegExp(`^${'(\\S*)\\s*'.repeat(keys.length - 1)}([\\S\\s]*)`))) {
    if (keys.length > matches.filter(Boolean).length && matches.filter(Boolean).length > 1) {
      tag[keys[1]] = matches[1].trim();
    } else {
      for (let i = 1; i <= keys.length; i++) {
        tag[keys[i - 1]] = matches[i].trim();
      }
    }
  }

  tag = setFlags(tag);

  if (variablePragmas.includes(tagName)) {
    tag = setOptional(tag);

    if (tag.type && tag.type[0] === '{' && tag.type.slice(-1) === '}') {
      tag.type = tag.type.slice(1, -1);
    }

    tag = setDefaultValue(tag);
  }

  if (tag.tagName) {
    if (config.prefixPragmas === true && tag.tagName[0] !== '@') {
      tag.tagName = '@' + tag.tagName;
    }

    if (config.prefixPragmas === false && tag.tagName[0] === '@') {
      tag.tagName = tag.tagName.substring(1);
    }
  }

  if (tag.name) {
    if (config.prefixVariables === true && tag.name[0] !== '$') {
      tag.name = '$' + tag.name;
    }

    if (config.prefixVariables === false && tag.name[0] === '$') {
      tag.name = tag.name.substring(1);
    }
  }

  tag = parseType(tag, config);
  return tag;
}

module.exports = parseTag;
module.exports.parseType = parseType;

},{"./getTagSectionKeys":5,"./setDefaultValue":9,"./setFlags":10,"./setOptional":11}],8:[function(require,module,exports){
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

},{}],9:[function(require,module,exports){
"use strict";

const safeParse = require('es5-util/js/safeParse');

function setDefaultValue(obj, key = 'desc') {
  let matches;

  if (typeof obj[key] === 'string' && (matches = obj[key].match(/([\S\s]*(?:\. |\n))Default(?: (?:is|to))?\s+([\S\s]*)/))) {
    let content, defaultValue;
    [, content, defaultValue] = matches; // trim the period from the end of the sentence

    if (defaultValue.slice(-1) === '.') {
      defaultValue = defaultValue.slice(0, -1);
    }

    obj[key] = content.trim();
    obj.defaultValue = safeParse(defaultValue.trim());
  }

  return obj;
}

module.exports = setDefaultValue;

},{"es5-util/js/safeParse":3}],10:[function(require,module,exports){
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

},{}],11:[function(require,module,exports){
"use strict";

function setOptional(tag, key = 'desc', forceOptionalKey = true) {
  if (typeof tag !== 'object' || tag === null || 'optional' in tag && tag.optional) {
    return tag;
  }

  if (forceOptionalKey) {
    var _tag$optional;

    (_tag$optional = tag.optional) !== null && _tag$optional !== void 0 ? _tag$optional : tag.optional = false;
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

},{}],12:[function(require,module,exports){
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
