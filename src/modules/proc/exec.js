const { exec } = require('child_process');

const makeExecError = ({ message, cmd, stdout, stderr, code, signal }) => {
    const err = new Error(message || `Command failed: ${cmd}`);
    err.name = 'ExecError';
    err.cmd = cmd;
    err.stdout = stdout ?? '';
    err.stderr = stderr ?? '';
    err.code = typeof code === 'number' ? code : null;
    err.signal = signal ?? null;
    return err;
};

const trim = s => String(s ?? '').trim();

module.exports = () => (cmd, options = {}) => {

    return new Promise((resolve, reject) => {
        const finalOpts = {
            windowsHide: true,
            maxBuffer: 10 * 1024 * 1024,
            ...options
        };
        exec(cmd, finalOpts, (err, stdout, stderr) => {
            const out = trim(stdout);
            const errout = trim(stderr);

            if (!err) {
                return resolve({ stdout: out, stderr: errout, code: 0, signal: null });
            }

            return reject(makeExecError({
                message: err.message,
                cmd,
                stdout: out,
                stderr: errout,
                code: err.code,
                signal: err.signal
            }));
        });
    });

};
