module.exports = ({ self }) => (...args) => {

    return self.with(args, async ({ stepResult }) => {
        return stepResult;
    });

}
