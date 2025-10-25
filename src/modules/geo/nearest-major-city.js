// npm i geokdbush haversine-distance
const geokdbush = require('geokdbush');
const haversine = require('haversine-distance');

module.exports = ({ config, minPop = 100_000 }) => {
    // Source: your loader puts cities in config.locations.cities with these fields:
    // { name, stateCode, countryCode, latitude, longitude, population, timezone }
    const all = (config && config.locations && Array.isArray(config.locations.cities))
        ? config.locations.cities
        : [];

    // Filter to “major” cities (no remap to avoid allocations)
    const major = all.filter(c =>
        c &&
        (c.population || 0) >= minPop &&
        c.countryCode &&
        Number.isFinite(c.latitude) &&
        Number.isFinite(c.longitude)
    );

    // Accessors for geokdbush over plain arrays
    const getLng = p => p.longitude;
    const getLat = p => p.latitude;

    /**
     * Find nearest major city in the same admin1 if provided, else same country.
     * point:   { lat, lon }
     * scope:   { country: 'US', admin1: 'GA' }  // admin1 matches stateCode
     * options: { maxCheck = 50, limit = 10 }
     * returns: { city, distance_m } | null
     */
    return (point, scope = {}, options = {}) => {
        const { lat, lon } = point || {};
        if (!Number.isFinite(lat) || !Number.isFinite(lon)) return null;

        const { country, admin1 } = scope;
        if (!country) return null; // require at least same-country constraint

        const { maxCheck = 50, limit = 10 } = options;

        // Query nearest items directly from the array (no KDBush build)
        const nearby = geokdbush.around(major, lon, lat, maxCheck, undefined, getLng, getLat);

        // Phase 1: same admin1 (state) if provided
        let candidates = [];
        if (admin1) {
            for (let i = 0; i < nearby.length; i++) {
                const c = nearby[i];
                if (c.countryCode === country && c.stateCode === admin1) {
                    candidates.push(c);
                    if (candidates.length >= limit) break;
                }
            }
        }

        // Phase 2: fallback to same country
        if (candidates.length === 0) {
            for (let i = 0; i < nearby.length; i++) {
                const c = nearby[i];
                if (c.countryCode === country) {
                    candidates.push(c);
                    if (candidates.length >= limit) break;
                }
            }
            if (candidates.length === 0) return null;
        }

        // Exact nearest by great-circle distance
        let best = null;
        let bestD = Infinity;
        for (let i = 0; i < candidates.length; i++) {
            const c = candidates[i];
            const d = haversine({ lat, lon }, { lat: c.latitude, lon: c.longitude });
            if (d < bestD) { bestD = d; best = c; }
        }

        return { city: best, distance_m: bestD };
    };
};
