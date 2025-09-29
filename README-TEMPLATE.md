<%- lib.renderOpening() %>

## Developer Notes

- Prefer `delimiter` over `separator`.

### Configuration pattern

```js
module.exports = ({ fun }) => config => {    // No need to default config object.
    const defaults = { depth: Infinity, mutate: true, defaultValue: null };
    const parseOptions = fun.parseConfig(defaults, config);

    return (val, options) => {
        const { depth, mutate, defaultValue } = parseOptions(options);
        // Spread options for readability.
```

Where applicable, provide options:

- `depth: Infinity` for recursive functions.
- `mutate: true` for transformations.



## Architecture

<%- await lib.renderModuleDiagram() %>
