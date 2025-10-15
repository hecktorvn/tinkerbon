const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

const wrapperPath = path.join(__dirname, '..', 'php-wrapper');
const vendorPath = path.join(wrapperPath, 'vendor');

if (!fs.existsSync(vendorPath)) {
    console.log('Installing PHP dependencies (composer install)...');

    // Executa composer install
    exec('composer install', { cwd: wrapperPath }, (err, stdout, stderr) => {
        if (err) {
            console.error('Error running composer install:', err);
            console.error(stderr);
            return;
        }
        console.log(stdout);
        console.log('PHP dependencies installed successfully.');
    });
} else {
    console.log('PHP dependencies already installed.');
}
