module.exports = ({ self }) => {

    const configure = self.insertBeforeLastConfigure;
    const insertBeforeLast = configure();
    const mut = configure({ mutate: true });
    return Object.assign(insertBeforeLast, { configure, mut });

}
