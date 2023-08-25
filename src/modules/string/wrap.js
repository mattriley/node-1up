module.exports = (str, limit) => {

    const lines = str.split('\n').flatMap(line => {
        const words = line.split(' ');
        return words.reduce((acc, word) => {
            const line = acc.at(-1).concat(word);
            const lineStr = line.join(' ');
            const limitExceeded = lineStr.length > limit;
            if (limitExceeded) acc.push([]);
            acc.at(-1).push(word);
            return acc;
        }, [[]]);
    });

    return lines.map(line => line.join(' ')).join('\n');

};
