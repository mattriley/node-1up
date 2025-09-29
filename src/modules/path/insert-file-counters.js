module.exports = ({ self }) => {

    const configure = self.insertFileCountersConfigure;
    const insertFileCounters = configure();
    return Object.assign(insertFileCounters, { configure });

};
