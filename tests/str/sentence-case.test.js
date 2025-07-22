module.exports = ({ test, assert }) => ({ str }) => {

    test('camelCase string', () => {
        const input = 'maxUploadSize';
        const expected = 'Max upload size';
        const actual = str.sentenceCase(input);
        assert.equal(actual, expected);
    });

    test('snake_case string', () => {
        const input = 'user_id_token';
        const expected = 'User id token';
        const actual = str.sentenceCase(input);
        assert.equal(actual, expected);
    });

    test('kebab-case string', () => {
        const input = 'api-version-info';
        const expected = 'Api version info';
        const actual = str.sentenceCase(input);
        assert.equal(actual, expected);
    });

    test('camelCase with digits and suffix', () => {
        const input = 'widthUnder1200px';
        const expected = 'Width under 1200 px';
        const actual = str.sentenceCase(input);
        assert.equal(actual, expected);
    });

    test('string with acronyms', () => {
        const sentenceCase = str.configure.sentenceCase({ acronyms: ['ID', 'URL'] });
        const input = 'userIDLookupURL';
        const expected = 'User ID lookup URL';
        const actual = sentenceCase(input);
        assert.equal(actual, expected);
    });

    test('already spaced string', () => {
        const input = 'Simple label name';
        const expected = 'Simple label name';
        const actual = str.sentenceCase(input);
        assert.equal(actual, expected);
    });

    test('empty string returns empty', () => {
        const input = '';
        const expected = '';
        const actual = str.sentenceCase(input);
        assert.equal(actual, expected);
    });

    test('null input returns empty', () => {
        const input = null;
        const expected = '';
        const actual = str.sentenceCase(input);
        assert.equal(actual, expected);
    });

    test('handles PascalCase', () => {
        const input = 'UserAccountStatus';
        const expected = 'User account status';
        const actual = str.sentenceCase(input);
        assert.equal(actual, expected);
    });

};
