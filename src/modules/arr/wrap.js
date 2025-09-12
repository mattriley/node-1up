module.exports = () => (arr, limit) => {
    if (!(limit > 0)) return arr.map(w => [w]); // degenerate: no width

    const lines = [[]];
    let len = 0; // length of current line including spaces

    for (let i = 0; i < arr.length; i++) {
        const word = arr[i];
        const sep = len === 0 ? 0 : 1; // space before word if line not empty
        if (len + sep + word.length > limit && len > 0) {
            lines.push([]);
            len = 0;
        }
        lines[lines.length - 1].push(word);
        len = len === 0 ? word.length : len + 1 + word.length;
    }

    return lines;
};
