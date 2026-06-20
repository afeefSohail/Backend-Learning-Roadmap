import express from 'express';
import { products } from '#data';
const app = express();
const port = 3000;
app.get('/', (req, res) => {
    res.json(products);
});
app.listen(port, () => {
    console.log(`Server is listening on http://localhost:${port}/`);
});
//# sourceMappingURL=05-basic-json.js.map