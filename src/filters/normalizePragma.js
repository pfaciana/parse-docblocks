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