// express middleware are functions that excecute during the request to the server.
// each middleware functions has access to request and response objects.
import express from 'express';
const app = express();
const port = 3000;
// req => Middleware Functions => res
const logger = (req, res, next) => {
    const method = req.method;
    const url = req.url;
    const time = new Date().getFullYear();
    console.log(method, url, time);
    //res.send('NEXT') 
    next();
};
// express do this in behind the scences
// logger(req, res, next)
app.get('/', logger, (req, res) => {
    // logger => GET / 2026
    res.send('Home');
});
// express do this in behind the scences
// logger(req, res, next)
app.get('/about', logger, (req, res) => {
    // logger => GET /about 2026
    res.send('About');
});
app.listen(port, () => {
    console.log(`Server is listening on http://localhost:${port}/`);
});
//# sourceMappingURL=07-middleware-basic.js.map