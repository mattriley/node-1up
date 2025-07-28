module.exports = () => (str, replacements) => {

    let result = str;
    for (const [key, value] of Object.entries(replacements)) {
        // split by key and join with replacement
        result = result.split(key).join(value);
    }
    return result.trim();

};
