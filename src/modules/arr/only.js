module.exports = (list, pred) => {

    const results = list.filter(pred);

    return [
        results.length === 1 ? results[0] : null,
        results.length > 1 ? results : null,
        results
    ];

};
