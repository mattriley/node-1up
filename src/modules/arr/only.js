module.exports = () => (list, pred) => {

    let found;
    let seen = 0;

    for (let i = 0; i < list.length; i++) {
        const val = list[i];
        if (!pred || pred(val, i, list)) {
            if (++seen > 1) return null; // more than one match
            found = val;
        }
    }

    return seen === 1 ? found : null;

};
