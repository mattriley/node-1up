module.exports = ({ self }) => {

    const configure = self.dedupeAdjacentConfigure;
    const dedupeAdjacent = configure();
    return Object.assign(dedupeAdjacent, { configure });

};
