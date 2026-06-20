// const { readFile, writeFile } = require('fs');
// const path = require('path')

import { readFile } from 'fs';
import { fileURLToPath } from 'node:url';
import path from 'path'; 


// ES Modules: 1. Recreate the absolute directory path of your "03-Modules" folder
const __filename = fileURLToPath(import.meta.url); // path => 01-read-file.js
const __dirname = path.dirname(__filename); // path => root dir path (06-Event-Loop-Examples)
console.log("File Path => ", __filename);
console.log("Dir Path => ",__dirname);

// CHECK FILE PATH
const __filePath = path.join(__dirname,'../04-Content/first.txt');

/*
++++ JS Single Thread and synchronius by Default ++++  
JS offloading this operation  to system kernal whenever possible.
Since most modern kernels are multi-threaded, they can handle multiple 
operations executing in the background. When one of these operations completes, 
the kernel tells Node.js so that the appropriate callback may be added to the poll queue 
to eventually be executed. 
*/

console.log('\nstarted a first task');
readFile(__filePath, 'utf8', (error, result) => {
    if (error) {
        console.log(error);
        return
    }
    console.log(result);
    console.log('completed first task');
})

console.log('started next task');

// started a first task
// started next task
// Hello this is first text file.
// completed first task