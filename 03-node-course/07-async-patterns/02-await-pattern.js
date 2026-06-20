//const { readFile, writeFile } = require('fs').promises
import { readFile, writeFile } from 'fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'path'; 
//import { promisify } from 'util';

// ES Modules: 1. Recreate the absolute directory path of your "03-Modules" folder
const __filename = fileURLToPath(import.meta.url); // path => /Users/afeefsohail/Documents/My Projects/Node.js_Express.js/01-node-course/07-async-patterns/02-await-pattern.js
const __dirname = path.dirname(__filename); // path => root dir path (07-async-patterns)
console.log("File Path => ", __filename);
console.log("Dir Path => ",__dirname);

// CHECK FILE PATH
const __firstFilePath = path.join(__dirname,'../04-Content/first.txt');
const __secondFilePath = path.join(__dirname,'../04-Content/second.txt');
const __resultFilePath = path.join(__dirname,'../04-Content/result-mind-grenade.txt');


// => this same work is happing in 'promisify'
// const getText = function getText(path) {
//     return new Promise((resolve, reject) => {
//         readFile(path, 'utf8'/*{encoding: 'utf8'}*/, (err, data) => {
//             if (err) {
//                 reject(err);
//             } else {
//                 resolve(data);
//             }
//         })
//     })
// }

// getText(__firstFilePath)
// .then((result) => console.log(result))
// .catch((err) => console.log(err))


// const readFilePromise = promisify(readFile)
// const writeFilePromise = promisify(writeFile)

const start = async () => {
    try {
        const first = await readFile(__firstFilePath, 'utf8'/*{encoding: 'utf8'}*/)
        const second = await readFile(__secondFilePath, 'utf8'/*{encoding: 'utf8'}*/)
        
        console.log(first);
        console.log(second);

        await writeFile(
            __resultFilePath, 
            `THIS IS AWSOME : ${first} ${second}`,
            {flag: 'a'}
        )

    } catch (error) {
        console.log(error);
    }

}

start()