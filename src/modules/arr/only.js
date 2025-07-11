module.exports = ({ self }) => (list, pred, cont) => {

    const vals = pred ? list.filter(pred) : list;
    return self.poly(vals, cont);

};
