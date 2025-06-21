const deepFreeze = obj => {

    for (const name of Reflect.ownKeys(obj)) {
        const val = obj[name];
        if ((val && typeof val === 'object') || typeof val === 'function') deepFreeze(val);
    }

    return Object.freeze(obj);

};

module.exports = () => deepFreeze;
