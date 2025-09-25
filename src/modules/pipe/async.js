module.exports = ({ self }) => (...args) => {

    return self.core.configure({ args, async: true }, ({ stepResult }) => {
        return stepResult;
    });

};
