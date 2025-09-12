module.exports = ({ fun }) => config => {

    const defaults = { mutate: false };
    const parseOptions = fun.parseConfig(defaults, config);

    return (arr, ...options) => {
        const { mutate } = parseOptions(options);

        if (mutate) {
            if (arr.length < 2) return arr;
            let writeIndex = 1;
            for (let readIndex = 1; readIndex < arr.length; readIndex++) {
                if (arr[readIndex] !== arr[readIndex - 1]) {
                    arr[writeIndex++] = arr[readIndex];
                }
            }
            arr.length = writeIndex; // truncate remaining tail
            return arr;

        } else {
            return arr.filter((el, i) => i === 0 || el !== arr[i - 1]);
        }

    };
};
