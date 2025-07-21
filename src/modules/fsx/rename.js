const path = require('path');

module.exports = ({ self, fsp }) => async (source, target) => {

    await self.mkdirp(path.dirname(target));
    await fsp.rename(source, target);

};
