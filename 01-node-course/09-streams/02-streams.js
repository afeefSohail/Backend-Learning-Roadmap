//const { createReadStream } = require('fs')
import { createReadStream } from 'node:fs'
import { fileURLToPath } from 'node:url';
import path from 'node:path'; 

// ES Modules: 1. Recreate the absolute directory path of your "03-Modules" folder
const __filename = fileURLToPath(import.meta.url); // path => /Users/afeefsohail/Documents/My Projects/Node.js_Express.js/01-node-course/09-streams/02-streams.js
const __dirname = path.dirname(__filename); // path => root dir path (09-streams)
console.log("File Path => ", __filename);
console.log("Dir Path => ",__dirname);

const __bigTextFilePath = path.join(__dirname,'../04-Content/big.txt');

// default 64kb
// last buffer - remainder
// highWaterMark - control size
// const stream = createReadStream(__bigTextFilePath, { highWaterMark: 90000 })
// const stream = createReadStream(__bigTextFilePath, { encoding: 'utf8' })

// 1. Initialize the stream pointing to your large file
// 2. Open a read stream for a large file
const stream = createReadStream(__bigTextFilePath, 'utf8')
stream.on('data', (result) => {
    console.log(result);
})

// 3. Listen for incoming chunks of data
// 4. Open the network pipeline when the stream opens
stream.on('data', (chunk) => {
    console.log('--- RECEIVED A NEW CHUNK ---');
    // .pipe() pushes data chunks directly to the response object as they are read
    console.log(chunk);
});

// 3. Handle errors safely so your server doesn't crash (like a missing file path)
stream.on('error', (err) => {
    console.error('Stream Error:', err.message);
});