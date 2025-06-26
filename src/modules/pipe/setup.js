module.exports = ({ self }) => () => {

    const { pipe, ...rest } = self;
    return Object.assign(pipe, rest);

}
