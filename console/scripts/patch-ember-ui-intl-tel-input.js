'use strict';

const fs = require('fs');
const path = require('path');

if (process.env.VERCEL || process.env.CI) {
    console.log('[patch-ember-ui-intl-tel-input] Skipping during Vercel/CI install');
    process.exit(0);
}

function getAddonIndexFile() {
    try {
        const packageJsonPath = require.resolve('@fleetbase/ember-ui/package.json', {
            paths: [process.cwd()],
        });

        return path.join(path.dirname(packageJsonPath), 'index.js');
    } catch (error) {
        return null;
    }
}

function patchFile(filePath) {
    const oldLine = "        const intlTelInputPath = path.dirname(require.resolve('intl-tel-input')).replace(/build\\/js$/, '');";
    const newLine = "        const intlTelInputPath = path.dirname(require.resolve('intl-tel-input/package.json'));";

    const source = fs.readFileSync(filePath, 'utf8');

    if (!source.includes(oldLine)) {
        return false;
    }

    const patched = source.replace(oldLine, newLine);

    if (patched === source) {
        return false;
    }

    fs.writeFileSync(filePath, patched);
    return true;
}

const addonIndexFile = getAddonIndexFile();

if (!addonIndexFile || !fs.existsSync(addonIndexFile)) {
    process.exit(0);
}

try {
    const patched = patchFile(addonIndexFile);

    if (patched) {
        console.log(`[patch-ember-ui-intl-tel-input] Patched ${addonIndexFile}`);
    }
} catch (error) {
    console.error(`[patch-ember-ui-intl-tel-input] Failed to patch ${addonIndexFile}`);
    console.error(error);
    process.exit(1);
}
