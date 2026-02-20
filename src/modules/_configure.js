module.exports = (configureKey, { defaultOptions, withDefer = false } = {}) => ({ self }) => {
    const configure = self[configureKey];
    const configured = defaultOptions ? configure(defaultOptions) : configure();
    const exports = { configure };

    if (withDefer) {
        exports.defer = configure({ defer: true });
    }

    return Object.assign(configured, exports);
};
