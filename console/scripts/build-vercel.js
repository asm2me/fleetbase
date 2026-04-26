'use strict';

const { execFileSync } = require('child_process');
const path = require('path');

const nodeExecutable = process.execPath;
const consoleDirectory = path.join(__dirname, '..');
const patchScript = path.join(__dirname, 'patch-ember-ui-intl-tel-input.js');
const nodeCompatPreload = path.join(__dirname, 'node-compat-preload.js');

function createNodeEnv(overrides = {}) {
    const nodeOptions = process.env.NODE_OPTIONS ? `${process.env.NODE_OPTIONS} ` : '';

    return {
        ...process.env,
        ...overrides,
        NODE_OPTIONS: `${nodeOptions}--require=${nodeCompatPreload}`,
    };
}

function resolveEmberBin() {
    const candidates = ['ember-cli/bin/ember', 'ember-cli/bin/ember.js'];

    for (const candidate of candidates) {
        try {
            return require.resolve(candidate, { paths: [consoleDirectory] });
        } catch (error) {
            // Continue trying other candidates.
        }
    }

    throw new Error('Unable to resolve the Ember CLI executable for the console build.');
}

function runPatch() {
    execFileSync(nodeExecutable, [patchScript], {
        cwd: consoleDirectory,
        stdio: 'inherit',
        env: createNodeEnv({
            CI: '',
            VERCEL: '',
        }),
    });
}

function runBuild() {
    const emberBin = resolveEmberBin();

    execFileSync(nodeExecutable, [emberBin, 'build', '--environment', 'production'], {
        cwd: consoleDirectory,
        stdio: 'inherit',
        env: createNodeEnv({
            NODE_ENV: 'production',
        }),
    });
}

try {
    runPatch();
    runBuild();
} catch (error) {
    console.error('[build-vercel] Failed to prepare or build the console app');
    if (error && error.stderr) {
        process.stderr.write(error.stderr);
    }
    if (error && error.stdout) {
        process.stdout.write(error.stdout);
    }
    process.exit(typeof error?.status === 'number' ? error.status : 1);
}
