module.exports = ({ fsp }) => async dirPath => {

    const dir = await fsp.opendir(dirPath);

    try {
        const { done } = await dir[Symbol.asyncIterator]().next();
        return done;
    } finally {
        await dir.close();
    }

};
