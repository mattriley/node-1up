module.exports = ({ self }) => {

    const configure = self.compactConfigure;
    const compact = configure({ mutate: false });
    const mut = configure({ mutate: true });
    return Object.assign(compact, { configure, mut });

};

