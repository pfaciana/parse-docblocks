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