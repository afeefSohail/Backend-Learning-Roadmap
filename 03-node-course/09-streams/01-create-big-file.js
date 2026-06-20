//const { writeFileSync } = require('fs')
import { writeFileSync } from "node:fs";
import { fileURLToPath } from 'node:url';
import path from 'path'; 


// ES Modules: 1. Recreate the absolute directory path of your "03-Modules" folder
const __filename = fileURLToPath(import.meta.url); // path => /Users/afeefsohail/Documents/My Projects/Node.js_Express.js/01-node-course/09-streams/01-create-big-file.js
const __dirname = path.dirname(__filename); // path => root dir path (09-streams)
console.log("File Path => ", __filename);
console.log("Dir Path => ",__dirname);

const __bigTextFilePath = path.join(__dirname,'../04-Content/big.txt');

for (let index = 0; index < 100000; index++) {
    writeFileSync(__bigTextFilePath, `hello world ${index}\n`, {flag : 'a'} )
}