module.exports = () => {

    return {
        darwin: { nameMax: 255, pathMax: 1024, units: "chars", fsType: "unknown-darwin" },
        linux: { nameMax: 255, pathMax: 4096, units: "bytes", fsType: "unknown-linux" },
        win32: { nameMax: 255, pathMax: 260, units: "chars", fsType: "unknown-windows" }
    };

};
