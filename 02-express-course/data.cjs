const products = [
  {
    id: 1,
    name: 'albany sofa',
    image:
      'https://dl.airtable.com/.attachments/6ac7f7b55d505057317534722e5a9f03/9183491e/product-3.jpg',
    price: 39.95,
    desc: `I'm baby direct trade farm-to-table hell of, YOLO readymade raw denim venmo whatever organic gluten-free kitsch schlitz irony af flexitarian.`,
  },
  {
    id: 2,
    name: 'entertainment center',
    image:
      'https://dl.airtable.com/.attachments/da5e17fd71f50578d525dd5f596e407e/d5e88ac8/product-2.jpg',
    price: 29.98,
    desc: `I'm baby direct trade farm-to-table hell of, YOLO readymade raw denim venmo whatever organic gluten-free kitsch schlitz irony af flexitarian.`,
  },
  {
    id: 3,
    name: 'albany sectional',
    image:
      'https://dl.airtable.com/.attachments/05ecddf7ac8d581ecc3f7922415e7907/a4242abc/product-1.jpeg',
    price: 10.99,
    desc: `I'm baby direct trade farm-to-table hell of, YOLO readymade raw denim venmo whatever organic gluten-free kitsch schlitz irony af flexitarian.`,
  },
  {
    id: 4,
    name: 'leather sofa',
    image:
      'https://dl.airtable.com/.attachments/3245c726ee77d73702ba8c3310639727/f000842b/product-5.jpg',
    price: 9.99,
    desc: `I'm baby direct trade farm-to-table hell of, YOLO readymade raw denim venmo whatever organic gluten-free kitsch schlitz irony af flexitarian.`,
  },
]
const people = [
  { id: 1, name: 'john' },
  { id: 2, name: 'peter' },
  { id: 3, name: 'susan' },
  { id: 4, name: 'Sohail Anwar' },
  { id: 5, name: 'Aman Sohail' },
  { id: 6, name: 'Afeef Sohail' },
  { id: 7, name: 'Shahab Sohail' },
  { id: 8, name: 'Izhaan Afeef' },
  { id: 9, name: 'Arham Afeef' }
]

// req => middleware => res
const logger = (req, res, next) => {
  const method = req.method
  const url = req.url
  const time = new Date().getFullYear()
  console.log(method, url)
  //res.send('NEXT') 
  next()
}

const authorize = (req, res, next) => {

  const { method, url } = req;

  //http://localhost:3000/?user=afeef
                  //      └──┬──────┘
                  //  This is the Query!
  // req.query = {  user: 'afeef' }
  const { user } = req.query;

  if (user === 'afeef') {
    req.user = { name: 'afeef', id: 1992 }
    next()
  }
  else {
    res.status(418).send('<h1> Unauthorized Access </h1>');
  }
}

module.exports = { products, people, logger, authorize }