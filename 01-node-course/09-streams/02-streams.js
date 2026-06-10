//const { createReadStream } = require('fs')
import { createReadStream } from 'node:fs'

// default 64kb
// last buffer - remainder
// highWaterMark - control size
// const stream = createReadStream('./content/big.txt', { highWaterMark: 90000 })
// const stream = createReadStream('../content/big.txt', { encoding: 'utf8' })

// 1. Initialize the stream pointing to your large file
const stream = createReadStream('./04-Content/big.txt', 'utf8')
stream.on('data', (result) => {
    console.log(result);
})

// 2. Listen for incoming chunks of data
stream.on('data', (chunk) => {
    console.log('--- RECEIVED A NEW CHUNK ---');
    console.log(chunk);
});

// 3. Handle potential errors (like a missing file path)
stream.on('error', (err) => {
    console.error('Stream Error:', err.message);
});