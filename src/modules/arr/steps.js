module.exports = () => arr => {

    const out = [];
    const prefix = [];
    for (const x of arr) {
        prefix.push(x);
        out.push([...prefix]); // shallow copy once per step
    }
    return out;

};
