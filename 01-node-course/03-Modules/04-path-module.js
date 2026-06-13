//const path = require('path');
import path from 'path';
import { fileURLToPath } from 'node:url';

console.log(path.sep); // => /


console.log('start.....')

// ES Modules: 1. Recreate the absolute directory path of your "03-Modules" folder
const __filename = fileURLToPath(import.meta.url); // path => 05-fs-sync.js
const __dirname = path.dirname(__filename); // path => 03-Modules
console.log("File Path => ", __filename);
console.log("Dir Path => ",__dirname);

const filePath = path.join('../04-Content/', '01-subfolder', 'test.text')
console.log("File Path => ", filePath);

const base = path.basename(filePath)
console.log("Base Path => ",base);

const absolute = path.resolve(__dirname, '../04-Content/', '01-subfolder', 'test.text')
console.log("Absolute Path => ",absolute);
