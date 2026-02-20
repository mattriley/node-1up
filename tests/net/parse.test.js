const fs = require('fs');
const os = require('os');
const path = require('path');

module.exports = ({ test, assert }) => ({ net }) => {

    test('parses in-memory delimited text with filter and transform', async () => {
        const source = [
            '# comment',
            'alice\t30',
            'bad-row',
            'bob\t25'
        ].join('\n');

        const actual = await net.parse({
            source,
            delimiter: '\t',
            columns: ['name', 'age'],
            filter: line => !line.startsWith('#'),
            transform: ([name, age]) => ({ name, age: Number(age) })
        });

        const expected = [
            { name: 'alice', age: 30 },
            { name: 'bob', age: 25 }
        ];
        assert.deepEqual(actual, expected);
    });

    test('writes parsed output to outputFile when requested', async () => {
        const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'net-parse-'));
        const outputFile = path.join(dir, 'out.json');

        const actual = await net.parse({
            source: 'a\t1\nb\t2',
            delimiter: '\t',
            columns: ['name', 'value'],
            transform: ([name, value]) => ({ name, value }),
            outputFile
        });

        const written = JSON.parse(fs.readFileSync(outputFile, 'utf8'));
        assert.deepEqual(actual, [
            { name: 'a', value: '1' },
            { name: 'b', value: '2' }
        ]);
        assert.deepEqual(written, actual);
    });

};
