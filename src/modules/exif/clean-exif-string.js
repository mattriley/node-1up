/**
 * Clean EXIF string values by removing non-printable trailing characters.
 *
 * Many EXIF tags (e.g., DateTimeOriginal, Make, Model) are stored as
 * null-terminated ASCII strings and may contain non-printable characters
 * (such as \x00) at the end. These can interfere with string parsing,
 * comparisons, or date conversion.
 *
 * This function:
 *   1. Ensures the input is a string.
 *   2. Removes any trailing characters outside the printable ASCII range (hex 20–7E).
 *   3. Trims leading and trailing whitespace.
 *
 * @returns {string|any} - The cleaned string, or the original value if not a string.
 *
 * @example
 *   cleanExifString("2023:05:21 14:30:00\x00") // => "2023:05:21 14:30:00"
 *   cleanExifString(" Canon EOS R\x00\x00 ")   // => "Canon EOS R"
 */
module.exports = () => s => {
    if (typeof s !== 'string') return s;
    return s.replace(/[^\x20-\x7E]+$/g, '').trim();
};
