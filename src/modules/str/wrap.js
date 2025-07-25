module.exports = ({ arr }) => (str, limit, transform) => {

    const result = [];
    const lines = str.split('\n');

    for (let i = 0; i < lines.length; i++) {
        const words = lines[i].split(' ');
        const wrapped = arr.wrap(words, limit);

        for (let j = 0; j < wrapped.length; j++) {
            let line = wrapped[j].join(' ');
            if (transform) line = transform(line);
            result.push(line);
        }
    }

    return result.join('\n');
};
