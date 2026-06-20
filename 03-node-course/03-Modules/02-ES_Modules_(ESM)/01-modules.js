//ES Modules : Encapsulated Code (only share minimum)

import { firstName, lastName } from './02-export-var.js';
console.log(`${firstName} ${lastName}`);

// import as default
import me from './03-export-func.js';
me.sayHi('Sohail Anwar')
me.sayHi(`${firstName} ${lastName}`)

// import as default
import data from './04-alternate-export.js';
console.log(data.items);
console.log(data.singlePerson);

import { addValues } from './05-mind-gernade.js';
console.log(addValues());