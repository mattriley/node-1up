module.exports = ({ self }) => {

    const dequote = self.dequoteConfigure();
    dequote.configure = self.dequoteConfigure;
    return dequote;

}
