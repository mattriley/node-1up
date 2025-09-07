module.exports = {
    configure: require('./configure'),
    dedupeAdjacent: require('./dedupe-adjacent'),
    dedupeAdjacentMut: require('./dedupe-adjacent.mut'),
    insertBeforeLast: require('./insert-before-last'),
    insertBeforeLastMut: require('./insert-before-last.mut'),
    join: require('./join'),
    mapChunksAsync: require('./map-chunks-async'),
    only: require('./only'),
    parse: require('./parse'),
    steps: require('./steps'),
    wrap: require('./wrap')
};
