module.exports = () => (arr, limit) => {

    return arr.reduce((acc, str) => {
        const line = acc.at(-1).concat(str);
        const lineStr = line.join(' ');
        const limitExceeded = lineStr.length > limit;
        if (limitExceeded && acc.at(-1).length) acc.push([]);
        acc.at(-1).push(str);
        return acc;
    }, [[]]);

};
