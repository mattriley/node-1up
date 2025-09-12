module.exports = ({ self }) => {

    const configure = self.dedupeAdjacentConfigure;
    const dedupeAdjacent = configure();
    const mut = configure({ mutate: true });
    return Object.assign(dedupeAdjacent, { configure, mut });

};
