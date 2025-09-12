module.exports = ({ self }) => {

    const configure = self.insertBeforeLastConfigure;
    const insertBeforeLast = configure();
    return Object.assign(insertBeforeLast, { configure });

}
