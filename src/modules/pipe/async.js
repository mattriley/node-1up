module.exports = ({ self }) => (...args) => {

    return self.with({ args, async: true }, async ({ stepResult }) => {
        return stepResult;
    });

}
