module.exports = ({ self }) => (...args) => self.configure.assignMeta()(...args);
