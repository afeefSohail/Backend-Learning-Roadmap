// npm - global command, comes with node
// npm -version or -v
// npm i <package_name> (install npm package module)
// npm i <package_name> -D (install for dev environment only)
// sudo npm install -g <packageName> 
// npm init (manaual approach)
// npm init -y (to make your own package.json and -y flag is yes for every thing he asked by default)

import _ from 'lodash'

const items = [1, 2, [3, [4]]]
const newItems = _.flattenDeep(items)
console.log(newItems);
