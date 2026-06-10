//const { createReadStream } = require('fs')
import { createReadStream } from 'node:fs'

// default 64kb
// last buffer - remainder
// highWaterMark - control size
// const stream = createReadStream('./content/big.txt', { highWaterMark: 90000 })
// const stream = createReadStream('../content/big.txt', { encoding: 'utf8' })

// 1. Initialize the stream pointing to your large file
// 2. Open a read stream for a large file
const stream = createReadStream('./04-Content/big.txt', 'utf8')
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