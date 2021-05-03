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

	return pragma;
}

module.exports = normalizePragma;