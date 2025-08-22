const tzlookup = require("tz-lookup");

module.exports = () => ({ states }) => {

    return states.map(state => {
        if (!state.latitude || !state.longitude) return state;
        const timezone = tzlookup(state.latitude, state.longitude);
        return { ...state, timezone };
    });

};
