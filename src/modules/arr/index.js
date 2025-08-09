module.exports = {
    configure: require('./configure'),
    dedupeAdjacent: require('./dedupe-adjacent'),
    dedupeAdjacentInPlace: require('./dedupe-adjacent-in-place'),
    insertBeforeLast: require('./insert-before-last'),
    insertBeforeLastInPlace: require('./insert-before-last-in-place'),
    join: require('./join'),
    mapChunksAsync: require('./map-chunks-async'),
    only: require('./only'),
    parse: require('./parse'),
    steps: require('./steps'),
    wrap: require('./wrap')
};
