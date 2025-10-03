module.exports = $ => segments => {

    return segments.flatMap(seg => seg.value).join($.config.path.delimiter);

};
