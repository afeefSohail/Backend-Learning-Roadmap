import express, { Router } from 'express';
import { login } from '#controllers/auth.js';
const router = express.Router();
// Base Path => /login for router
router.post('/', login);
export default router;
//# sourceMappingURL=auth.js.map