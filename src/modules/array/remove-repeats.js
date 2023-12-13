module.exports = arr => {

    return arr.flatMap((el, i) => {
        const prev = arr[i - 1];
        if (prev === el) return [];
        return [el];
    });

};
