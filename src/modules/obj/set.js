module.exports = ({ self }) => {

    const configure = self.setConfigure;
    const set = configure.set({ mutate: false });
    return Object.assign(set, { configure });

}
