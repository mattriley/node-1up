module.exports = () => (list, pred) => {

    const vals = pred ? list.filter(pred) : list;
    return vals.length === 1 ? vals[0] : null;

};
