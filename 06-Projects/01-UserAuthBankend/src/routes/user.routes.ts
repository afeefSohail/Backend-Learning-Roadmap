import express, { Application, Router } from "express";
import { requireJWTAuth } from "#middlewares/auth.middleware";
import { getUser, updateUser, deleteUser } from "#controllers/user.controllers";
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

router.route("/:id").get(getUser,
  /* #swagger.tags = ['User']
     #swagger.path = '/user/{id}'
     #swagger.summary = "Get a user's public profile"
     #swagger.parameters['id'] = {
          in: 'path',
          description: 'User ID',
          required: true,
          type: 'integer'
     }
     #swagger.responses[200] = {
          description: 'Returns the public profile'
     }
     #swagger.responses[404] = {
          description: 'User not found'
     }
  */
);

router
  .route("/me")
  .patch(requireJWTAuth , updateUser,
    /* #swagger.tags = ['User']
     #swagger.path = '/user/me'
     #swagger.summary = 'Edit your own profile'
     #swagger.security = [{ "bearerAuth": [] }]
     #swagger.parameters['body'] = {
          in: 'body',
          required: true,
          schema: {
              name: "Afeef Sohail"
          }
     }
     #swagger.responses[200] = {
          description: 'Profile updated successfully'
     }
     #swagger.responses[401] = {
          description: 'Missing or invalid token'
     }
  */
  )
  .delete(requireJWTAuth, deleteUser,
    /* #swagger.tags = ['User']
     #swagger.path = '/user/me'
     #swagger.summary = 'Delete your own account'
     #swagger.security = [{ "bearerAuth": [] }]
     #swagger.responses[200] = {
          description: 'Account deleted successfully'
     }
     #swagger.responses[401] = {
          description: 'Missing or invalid token'
     }
  */
  );

export default router;
