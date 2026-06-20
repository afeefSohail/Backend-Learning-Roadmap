import express, {} from "express";
import { logger, authorize } from '#data';
//const morgan = require('morgan')
const app = express();
const port = 3000;
//  req => Middleware Functions => res
// 1. use vs route
// app.use("/api", [logger, authorize]) => // this only use for /api/products && /api/items
// 2. options - our own / express / third party
// 2.2 - express option => app.use(express.static('./public'))
// 2.3 - third party => npm i morgan => app.use(morgan('tiny'))
// 2.3.1 - morgan('tiny') is a third-party Express middleware that automatically logs 
// 2.3.1 - your server's incoming HTTP requests to your terminal in a single, short, pre-formatted string
// app.use("/api", [logger, authorize]) // use vs route
// app.use(express.static('./public')) // express
// app.use(morgan('tiny')) // third party
app.get('/', (req, res) => {
    res.send('Home');
});
app.get('/about', (req, res) => {
    res.send('About');
});
app.get('/api/products', [logger, authorize], (req, res) => {
    res.send('Products');
});
app.get('/api/items', [logger, authorize], (req, res) => {
    console.log(req.query);
    res.send('Items');
});
app.listen(port, () => {
    console.log(`Server is listening on http://localhost:${port}/`);
});
//# sourceMappingURL=09-middleware-options.js.map