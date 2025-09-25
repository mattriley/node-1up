module.exports = ({ self }) => (...args) => {

    return self.core.configure({ args }, ({ stepResult }) => {
        return stepResult;
    });

};
