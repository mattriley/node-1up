// Generated and optimised on 21 June 2025 with help from ChatGPT.

module.exports = () => (object, keys) => {

    const result = {};

    if (object == null) return result;

    for (const key of keys) {
        if (Object.prototype.hasOwnProperty.call(object, key)) {
            result[key] = object[key];
        }
    }

    return result;

}
