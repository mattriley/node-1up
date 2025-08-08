<%- lib.renderOpening() %>

## Developer Notes

- Prefer `delimiter` over `separator`.

### Configure pattern

```js
module.exports = ({ self }) => (config = {}) => {
    // New config object to avoid mutation.
    // Input overrides defaults.
    config = { depth: Infinity, mutate: true, defaultValue: null, ...config };

    return (val, options = {}) => {
        // New options object to avoid mutation.
        // Input overrides config.
        options = { ...config, ...options };
        // Destructure options for readability.
        const { depth, mutate, defaultValue } = options;
```

## Architecture

<%- await lib.renderModuleDiagram() %>
