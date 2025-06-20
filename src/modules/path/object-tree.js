// Optimised on 21 June 2025.

module.exports = () => paths => {

    const result = {};

    for (const path of new Set(paths)) {
        const segments = path.split('/');
        let current = result;

        for (const segment of segments) {
            current = current[segment] ??= {};
        }
    }

    return result;

};
