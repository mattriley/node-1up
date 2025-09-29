module.exports = ({ self }) => {

    const configure = self.stepsConfigure;
    const steps = configure();
    return Object.assign(steps, { configure });

};
