module.exports = ({ self }) => {

    const join = self.joinConfigure();
    join.configure = self.joinConfigure;
    return join;

};
