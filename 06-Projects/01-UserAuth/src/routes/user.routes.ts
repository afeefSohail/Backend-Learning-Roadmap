import express, { Application , Router } from "express";
import { getUser,  updateUser, deleteUser }  from "#controllers/user.controllers";
const app: Application = express();
const router: Router = express.Router();


// Why PATCH over PUT here: PUT implies replacing the entire resource; 
// PATCH implies partial update — since editing "just the name" or "just one field" is your actual use case, 
// PATCH is the more semantically correct choice. (Both work in practice; this is a nicety worth knowing.)


// Why /user/me instead of /user/:id for edit/delete: 
// using me (resolved from the JWT payload, not a URL param) 
// prevents a user from editing/deleting someone else's account by just changing the ID in the URL 
// — a classic and easy-to-miss authorization bug. 
// GET /user/:id can stay param-based since viewing a public profile isn't sensitive the same way.

// router.get("/:id", getUser);
// router.patch("/me", updateUser);
// router.delete("/me", deleteUser);

router.route("/me").patch(updateUser).delete(deleteUser);
router.route("/:id").get(getUser);

export default router;