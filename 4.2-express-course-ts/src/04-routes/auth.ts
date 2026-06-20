import  express, { Router } from 'express'
import { login }  from '#controllers/auth.js';
const router: Router = express.Router()

// Base Path => /login for router
router.post('/', login)

export default router