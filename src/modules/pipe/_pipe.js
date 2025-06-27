module.exports = ({ self }) => (...args) => {

    return self.with({ args }, ({ stepResult }) => {
        return stepResult;
    });

}
