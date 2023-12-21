module.exports = ({ arr }) => (str, limit, transform) => {

    const linesOfWords = str.split('\n').flatMap(line => {
        return arr.wrap(line.split(' '), limit);
    });

    const lines = linesOfWords.map(words => words.join(' '));
    const transformed = transform ? lines.map(transform) : lines;
    return transformed.join('\n');

};
