import express, { Application, Router } from "express";
import { validate, requireJWTAuth } from "#middlewares/auth.middleware";
import { signUpSchema, loginSchema } from "#validators/auth.validators";
import {
  signUp,
  refresh,
  login,
  logout,
  getMe,
} from "#controllers/auth.controllers";

const app: Application = express();
const router: Router = express.Router();

router.post(
  "/register",
  validate(signUpSchema),
  signUp,
  /* #swagger.path = '/auth/register'  
   #swagger.tags = ['Auth']
   #swagger.summary = 'Register a new user'
   #swagger.parameters['body'] = {
        in: 'body',
        required: true,
        schema: {
            email: "user@example.com",
            password: "secret123",
            name: "Afeef Sohail"
        }
   }
   #swagger.responses[201] = {
        description: 'User created successfully'
   }
   #swagger.responses[400] = {
        description: 'Validation error or email already in use'
   }
*/
);

router.post(
  "/login",
  validate(loginSchema),
  login,
  /* #swagger.path = '/auth/login'  
   #swagger.tags = ['Auth']
   #swagger.summary = 'Login and receive a JWT'
   #swagger.parameters['body'] = {
        in: 'body',
        required: true,
        schema: {
            email: "user@example.com",
            password: "secret123"
        }
   }
   #swagger.responses[200] = {
        description: 'Login successful, returns JWT'
   }
   #swagger.responses[401] = {
        description: 'Invalid credentials'
   }
*/
);

router.post(
  "/refresh",
  refresh,
  /* #swagger.path = '/auth/refresh'
   #swagger.tags = ['Auth']
   #swagger.summary = 'Exchange a refresh token for a new access token'
   #swagger.parameters['body'] = {
        in: 'body',
        required: true,
        schema: { refreshToken: "eyJhbGciOi..." }
   }
   #swagger.responses[200] = { description: 'New access token issued' }
   #swagger.responses[401] = { description: 'Invalid or expired refresh token' }
*/
);

router.post(
  "/logout",
  logout,
  /* #swagger.path = '/auth/logout'
   #swagger.tags = ['Auth']
   #swagger.summary = 'Logout current user'
   #swagger.parameters['body'] = {
        in: 'body',
        required: true,
        schema: { refreshToken: "eyJhbGciOi..." }
   }
   #swagger.responses[200] = { description: 'Logged out successfully' }
   #swagger.responses[400] = { description: 'Refresh token is required' }
*/
);

router.get(
  "/me",
  requireJWTAuth,
  getMe,
  /* #swagger.path = '/auth/me'  
   #swagger.tags = ['Auth']
   #swagger.summary = 'Get the currently authenticated user'
   #swagger.security = [{ "bearerAuth": [] }]
   #swagger.responses[200] = { description: 'Returns the current user' }
   #swagger.responses[401] = { description: 'Missing or invalid token' }
   #swagger.responses[404] = { description: 'User not found' }
*/
);

export default router;
