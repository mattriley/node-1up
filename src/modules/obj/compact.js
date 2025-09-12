module.exports = ({ self }) => {

    const configure = self.compactConfigure;
    const compact = configure({ mutate: false });
    compact.mut = configure({ mutate: true });
    compact.configure = self.compactConfigure;
    return compact;

};

