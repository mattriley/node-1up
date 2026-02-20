module.exports = $ => async dirpath => {

    const dir = await $.fsp.opendir(dirpath);

    try {
        const { done } = await dir[Symbol.asyncIterator]().next();
        return done;
    } finally {
        try {
            await dir.close();
        } catch (err) {
            if (err?.code !== 'ERR_DIR_CLOSED') throw err;
        }
    }

};
