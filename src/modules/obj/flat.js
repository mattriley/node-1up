module.exports = ({ self }) => {

    const configure = self.flatConfigure;
    const flat = configure();
    const mut = configure({ mutate: true });
    return Object.assign(flat, { configure, mut });

}
