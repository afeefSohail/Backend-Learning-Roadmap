import http  from 'node:http';
import fs from 'node:fs'
import { fileURLToPath } from 'node:url';
import path from 'node:path'; 

// ES Modules: 1. Recreate the absolute directory path of your "03-Modules" folder
const __filename = fileURLToPath(import.meta.url); // path => /Users/afeefsohail/Documents/My Projects/Node.js_Express.js/01-node-course/09-streams/03-http-stream.js
const __dirname = path.dirname(__filename); // path => root dir path (09-streams)
console.log("File Path => ", __filename);
console.log("Dir Path => ",__dirname);

const __bigTextFilePath = path.join(__dirname,'../04-Content/big.txt');

http
  .createServer(function (req, res) {
    // const text = fs.readFileSync(__bigTextFilePath, 'utf8')
    // res.end(text)
    
    //created Read Stream send the large files in chunks => Transfer-Encoding: chunked 
    const fileStream = fs.createReadStream(__bigTextFilePath, 'utf8')
    fileStream.on('open', () => {
      fileStream.pipe(res)
    })
    fileStream.on('error', (err) => {
      res.end(err)
    })
  })
  .listen(3000)