module.exports = () => (config = {}) => {

    config.acronyms ??= [];

    return str => {
        if (!str) return '';

        const words = str
            .replace(/[_\-]+/g, ' ')                                  // snake_case, kebab-case → space
            .replace(/([a-z\d])([A-Z])/g, '$1 $2')                    // camelCase → space before capital
            .replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2')                // ALLCAPSWord → split at case boundary
            .replace(/([a-zA-Z])(\d)/g, '$1 $2')                      // letter → digit
            .replace(/(\d)([a-zA-Z])/g, '$1 $2')                      // digit → letter
            .trim()
            .split(/\s+/)
            .map((word, i) => {
                const upper = word.toUpperCase();
                if (config.acronyms.includes(upper)) return upper;
                return word.toLowerCase();
            });

        if (words.length > 0) {
            words[0] = words[0][0].toUpperCase() + words[0].slice(1);
        }

        return words.join(' ');
    };
};
