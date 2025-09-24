module.exports = ({ self }) => {

    const configure = self.setConfigure;
    const set = configure();
    return Object.assign(set, { configure });

};
