module.exports = ({ self }) => (list, pred, cont) => {

    const vals = list.filter(pred);
    return self.poly(vals, cont);

};
