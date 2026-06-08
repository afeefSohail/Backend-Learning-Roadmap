// CommonJS Module:
// const { readFileSync, writeFileSync } = require('fs')
// const path = require('path')

// ES Modules:
import { readFileSync, writeFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'node:url';

console.log('start.....')

// ES Modules: 1. Recreate the absolute directory path of your "03-Modules" folder
const __filename = fileURLToPath(import.meta.url); // path => 05-fs-sync.js
const __dirname = path.dirname(__filename); // path => 03-Modules
console.log("File Path => ", __filename);
console.log("Dir Path => ",__dirname);


//Folder Level: The .. correctly steps out of 03-Modules into 01-node-course.
const first = readFileSync(path.join(__dirname, '../04-Content/first.txt'), 'utf-8')
const second = readFileSync(path.join(__dirname, '../04-Content/second.txt'), {encoding: 'utf8' ,  flag: 'r' } ) // r = read flag is default anyhow.
console.log("First File Text => ", first);
console.log("Second File Text => ", second);

writeFileSync(
    path.join(__dirname,'../04-Content/result-sync.txt'), 
    `Here is the result: ${first}, ${second}`,
    {flag: 'a'} // Passing { flag: 'a' } tells Node to append (add) the new text to the very end of the file instead of deleting the old content.
)