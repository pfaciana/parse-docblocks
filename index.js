module.exports = require('./src/parseComments');
module.exports.getLocationIndexes = require('./src/getLocationIndexes');
module.exports.getTagSectionKeys = require('./src/getTagSectionKeys');
module.exports.parseTag = require('./src/parseTag');
module.exports.trimLine = require('./src/trimLine');
module.exports.filters = require('./src/filters');

if (typeof global === 'object') {
	global.parseDocblocks = module.exports;
}