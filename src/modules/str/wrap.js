module.exports = ({ arr }) => (str, limit) => {

    const lines = str.split('\n').flatMap(line => {
        return arr.wrap(line.split(' '), limit);
    });

    return lines.map(line => line.join(' ')).join('\n');

};
