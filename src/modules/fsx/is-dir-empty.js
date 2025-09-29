module.exports = $ => async dirpath => {

    const dir = await $.fsp.opendir(dirpath);

    try {
        const { done } = await dir[Symbol.asyncIterator]().next();
        return done;
    } finally {
        await dir.close();
    }

};
