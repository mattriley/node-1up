module.exports = () => (lat1, lon1, lat2, lon2) => {

    const toRad = deg => deg * Math.PI / 180;
    const R = 6371; // Earth's radius in km

    // Validate input
    const coords = [lat1, lon1, lat2, lon2];
    if (!coords.every(Number.isFinite)) {
        throw new Error(`Invalid coordinates: ${coords.join(', ')}`);
    }

    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const lat1Rad = toRad(lat1);
    const lat2Rad = toRad(lat2);

    const a = Math.sin(dLat / 2) ** 2 +
        Math.cos(lat1Rad) * Math.cos(lat2Rad) *
        Math.sin(dLon / 2) ** 2;

    // Clamp 'a' to avoid asin domain errors due to floating-point rounding
    const safeA = Math.min(1, Math.max(0, a));

    const c = 2 * Math.asin(Math.sqrt(safeA));
    return R * c;


};
