module.exports = ({ self }) => (...args) => {

    return self.with({ args, async: true }, ({ stepResult }) => {
        return stepResult;
    });

}
