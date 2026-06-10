//const { writeFileSync } = require('fs')
import { writeFileSync } from "node:fs";

for (let index = 0; index < 100000; index++) {
    writeFileSync('./04-Content/big.txt', `hello world ${index}\n`, {flag : 'a'} )
}