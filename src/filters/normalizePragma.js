function normalizePragma(pragma) {

	if (['@returns'].includes(pragma)) {
		return '@return';
	}

	if (['@usedby'].includes(pragma)) {
		return '@used-by';
	}

	if (['@used', '@use', '@depends'].includes(pragma)) {
		return '@uses';
	}

	if (['@constant'].includes(pragma)) {
		return '@const';
	}

	return pragma;
}

module.exports = normalizePragma;