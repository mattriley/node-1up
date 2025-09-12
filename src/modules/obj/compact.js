module.exports = ({ self }) => {

    const configure = self.compactConfigure;
    const compact = configure({ mutate: false });
    return Object.assign(compact, { configure });

};

