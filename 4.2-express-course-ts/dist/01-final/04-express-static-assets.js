import express from 'express';
import path from 'node:path';
import { getPaths } from '#utils/path';
const app = express();
const port = 3000;
/*
To make sure your static folder always
loads correctly no matter where you or
your deployment server launch the terminal,
always tie it to __dirname using path.join()
*/
// 🌟 Get your local __dirname instantly for this specific file!
const { __dirname } = getPaths(import.meta.url);
// setup static assets with express middleware
app.use(express.static(path.join(__dirname, '../02-navbar-app')));
// app.get('/', (req, res) => {
//   res.sendFile(path.resolve(__dirname, '../02-navbar-app/index.html'))
//   adding to static assets
//   SSR (Server-Side Rendering)
// })
// what ever resouce you trying to access
app.all('*any', (req, res) => {
    res.status(404).send('<h1> resourse not found </h1>');
});
app.listen(port, () => {
    console.log(`Server is listening on port http://localhost:${port} ...`);
});
//  SSR (Server-Side Rendering)
//  It is a web development technique where your
//  backend server (like your Node.js/Express app) takes data, 
//  injects it directly into an HTML file, and builds the complete, 
//  fully-styled webpage on the server before sending it over to the user's browser
//  ----------- How SSR Works (The Lifecycle) -------------
//  A[User requests a page] --> B[Express Server fetches data from Database]
//  B --> C[Server renders data inside an HTML Template Engine]
//  C --> D[Server sends a complete, fully-built HTML file to browser]
//  D --> E[Browser instantly displays the styled webpage]
//  E --> F[Browser downloads JavaScript to make page interactive hydration]
//# sourceMappingURL=04-express-static-assets.js.map