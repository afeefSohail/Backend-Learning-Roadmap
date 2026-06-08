const path = require('path');
//import path from 'path';

console.log(path.sep); // => /


const filePath = path.join('../04-Content/', '01-subfolder', 'test.text')
console.log("File Path => ", filePath);

const base = path.basename(filePath)
console.log("Base Path => ",base);

const absolute = path.resolve(__dirname, '../04-Content/', '01-subfolder', 'test.text')
console.log("Absolute Path => ",absolute);
