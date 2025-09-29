module.exports = $ => async (dirpath, options = {}) => {

    const { recursive = true, force = true } = options;
    $.fs.rmSync(dirpath, { recursive, force });
    await $.fsp.mkdir(dirpath, { recursive });

};
