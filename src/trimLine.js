function trimLine(line) {
	line = line.replace(new RegExp('^[* \t\n\u00A0]+', 'g'), '');
	line = line.replace(new RegExp('[ \t\n\u00A0]+$', 'g'), '');

	line.startsWith('/**') && (line = line.substring(3));
	line.endsWith('/') && (line = line.slice(0, -1));

	return line;
}

module.exports = trimLine;