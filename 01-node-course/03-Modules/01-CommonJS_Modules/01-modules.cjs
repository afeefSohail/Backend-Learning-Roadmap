// CommonJs : every file is module (by default)
// Modules : Encapsulated Code (only share minimum)
const userName = require('./02-export-var.cjs')
console.log(userName);
console.log(`${userName.firstName} ${userName.lastName}`);

// console.log("sohail");
// console.log(afeef);
// console.log(shahab);

const sayHai = require('./03-export-func.cjs')
sayHai('Sohail Anwar')
sayHai(`${userName.firstName} ${userName.lastName}`)

const data = require('./04-alternate-export.cjs')
console.log(data.items);
console.log(data.singlePerson);

require('./05-mind-gernade.cjs')
// run this js file => the sum is: 15
// 05-mind-gernade => export complete file functionality
