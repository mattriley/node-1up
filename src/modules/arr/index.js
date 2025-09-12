module.exports = {
    dedupeAdjacentConfigure: require('./dedupe-adjacent.configure'),
    insertBeforeLastMut: require('./insert-before-last.mut'),
    joinConfigure: require('./join.configure'),
    parseConfigure: require('./parse.configure'),
    dedupeAdjacent: require('./dedupe-adjacent'),
    insertBeforeLast: require('./insert-before-last'),
    join: require('./join'),
    mapChunksAsync: require('./map-chunks-async'),
    only: require('./only'),
    parse: require('./parse'),
    steps: require('./steps'),
    wrap: require('./wrap')
};
