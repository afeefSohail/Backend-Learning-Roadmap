//const { readFile, writeFile } = require('fs').promises
import { readFile, writeFile } from 'fs/promises';
//import { promisify } from 'util';

// const readFilePromise = promisify(readFile)
// const writeFilePromise = promisify(writeFile)

const start = async () => {
    try {
        const first = await readFile('./04-Content/first.txt', 'utf8'/*{encoding: 'utf8'}*/)
        const second = await readFile('./04-Content/second.txt', 'utf8'/*{encoding: 'utf8'}*/)
        
        console.log(first);
        console.log(second);

        await writeFile(
            './04-Content/result-mind-grenade.txt', 
            `THIS IS AWSOME : ${first} ${second}`,
            {flag: 'a'}
        )

    } catch (error) {
        console.log(error);
    }

}

start()

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

// getText('./04-Content/first.txt')
// .then((result) => console.log(result))
// .catch((err) => console.log(err))
