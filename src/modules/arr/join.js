module.exports = ({ self }) => {

    const join = self.joinConfigure();
    join.configure = self.configure;
    return join;

}
