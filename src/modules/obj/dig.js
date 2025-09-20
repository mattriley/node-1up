module.exports = ({ self }) => {

    const configure = self.digConfigure;
    const dig = configure();
    return Object.assign(dig, { configure });

};
