module.exports = () => arr => {

    if (arr.length < 2) return arr;

    let writeIndex = 1;

    for (let readIndex = 1; readIndex < arr.length; readIndex++) {
        if (arr[readIndex] !== arr[readIndex - 1]) {
            arr[writeIndex++] = arr[readIndex];
        }
    }

    arr.length = writeIndex; // truncate remaining tail
    return arr;

};
