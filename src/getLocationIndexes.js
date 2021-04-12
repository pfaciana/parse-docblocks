function getLocationIndexes(lines) {
	const loc = {
		summary: {start: -1, end: -1},
		description: {start: -1, end: -1},
		tags: {start: -1, end: -1},
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
		return !(line === '' || (loc.summary.end !== -1 && i <= loc.summary.end) || (loc.tags.start !== -1 && i >= loc.tags.start));
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