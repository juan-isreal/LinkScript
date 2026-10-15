#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { runLinkScript } = require('../src/index');

const args = process.argv.slice(2);

if (args.length === 0) {
    console.log("Usage: ls <filename.ls> or ls run <filename.ls>");
    process.exit(1);
}

const filePath = args[0] === 'run' ? args[1] : args[0];

if (!filePath) {
    console.error("Error: Please specify a .ls file to run.");
    process.exit(1);
}

const absolutePath = path.resolve(process.cwd(), filePath);

if (!fs.existsSync(absolutePath)) {
    console.error(`Error: File not found '${filePath}'`);
    process.exit(1);
}

const code = fs.readFileSync(absolutePath, 'utf-8');

try {
    runLinkScript(code);
} catch (err) {
    console.error(`[LinkScript Error] ${err.message}`);
    process.exit(1);
}
