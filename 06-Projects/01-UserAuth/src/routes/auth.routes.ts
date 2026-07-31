import express, { Application , Router } from "express";
import { accountCreated,  login, logout, getMe }  from "#controllers/auth.controllers";
const app: Application = express();
const router: Router = express.Router();

router.post("/register", accountCreated);
router.post("/login", login);
router.post("/logout", logout);
router.get("/me", getMe);

export default router;