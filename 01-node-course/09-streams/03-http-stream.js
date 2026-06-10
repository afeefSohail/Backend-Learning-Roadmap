import http  from 'http';
import fs from 'fs'

http
  .createServer(function (req, res) {
    // const text = fs.readFileSync('./04-Content/big.txt', 'utf8')
    // res.end(text)
    

    //created Read Stream send the large files in chunks => Transfer-Encoding: chunked 
    const fileStream = fs.createReadStream('./04-Content/big.txt', 'utf8')
    fileStream.on('open', () => {
      fileStream.pipe(res)
    })
    fileStream.on('error', (err) => {
      res.end(err)
    })
  })
  .listen(3000)