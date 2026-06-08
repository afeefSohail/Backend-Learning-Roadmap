const { error } = require('console');
const { readFile, writeFile } = require('fs');
const path = require('path')

// ES Modules:
// import { readFile , writeFile } from 'fs';
// import path from 'path';
// import { fileURLToPath } from 'node:url';

console.log('start....')

// ES Modules: 1. Recreate the absolute directory path of your "03-Modules" folder
// const __filename = fileURLToPath(import.meta.url); // path => 05-fs-sync.js
// const __dirname = path.dirname(__filename); // path => 03-Modules
// console.log("File Path => ", __filename);
// console.log("Dir Path => ",__dirname);

readFile(path.join(__dirname, '../04-Content/first.txt'), 'utf8', (error, result) => {
    if (error) {
        console.log(error);
        return
    }
    const first = result;

    readFile(path.join(__dirname, '../04-Content/second.txt'), {encoding: 'utf8' ,  flag: 'r' /* r = read flag is default anyhow.*/ }, (error, result) => {
        if (error) {
            console.log(error);
            return
        }
        const second = result;
        writeFile(
            path.join(__dirname, '../04-Content/result-async.txt'),
            `Here is the result: ${first}, ${second}`,
            { flag: 'a' },  // Passing { flag: 'a' } tells Node to append (add) the new text to the very end of the file instead of deleting the old content.
            (error, result) => {
                if (error) {
                    console.log(error);
                    return
                }
                console.log(result)
            }
        )
    })
})