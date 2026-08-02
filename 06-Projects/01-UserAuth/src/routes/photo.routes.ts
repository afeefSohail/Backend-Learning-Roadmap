import express, { Application, Router } from "express";
import { requireJWTAuth } from "#middlewares/auth.middleware";
import { upload } from "#middlewares/upload.middleware";
import { uploadPhotos, getAllPhotos, getPhoto, deletePhoto } from "#controllers/photo.controllers";
const app: Application = express();
const router: Router = express.Router();

// router.post("/me/photos", uploadPhotos);
// router.get("/me/photos", getAllPhotos);
// router.get("/photos/:photoId", getPhoto);
// router.delete("/photos/:photoId", deletePhoto);

router
  .route("/me/photos")
  .post(requireJWTAuth , upload.array("photos", 10), uploadPhotos,
     /* #swagger.path = '/user/me/photos'
     #swagger.tags = ['Photos']
     #swagger.summary = 'Upload one or more photos'
     #swagger.security = [{ "bearerAuth": [] }]
     #swagger.consumes = ['multipart/form-data']
     #swagger.parameters['photos'] = {
          in: 'formData',
          type: 'file',
          required: true,
          description: 'One or more image files'
     }
     #swagger.responses[201] = { description: 'Photos uploaded successfully' }
     #swagger.responses[400] = { description: 'No files uploaded' }
     #swagger.responses[401] = { description: 'Missing or invalid access token' }
  */
  ).get(requireJWTAuth , getAllPhotos,
    /* #swagger.tags = ['Photos']
     #swagger.path = '/user/me/photos'  
     #swagger.summary = "List your own photos"
     #swagger.security = [{ "bearerAuth": [] }]
     #swagger.responses[200] = {
          description: 'Returns your photos'
     }
     #swagger.responses[401] = {
          description: 'Missing or invalid token'
     }
  */
  );

router.route("/photos/:photoId")
.get(requireJWTAuth, getPhoto,
  /* #swagger.tags = ['Photos']
     #swagger.path = '/user/photos/{photoId}'  
     #swagger.summary = "List another user's public photo"
     #swagger.security = [{ "bearerAuth": [] }]
     #swagger.parameters['photoId'] = {
          in: 'path',
          description: 'Photo ID',
          required: true,
          type: 'integer'
     }
     #swagger.responses[200] = {
          description: "Returns the user's public photo"
     }
     #swagger.responses[404] = {
          description: 'User not found'
     }
  */
).delete( requireJWTAuth , deletePhoto,
  /* #swagger.tags = ['Photos']
     #swagger.path = '/user/photos/{photoId}'  
     #swagger.summary = 'Delete one of your own photos'
     #swagger.security = [{ "bearerAuth": [] }]
     #swagger.parameters['photoId'] = {
          in: 'path',
          description: 'Photo ID',
          required: true,
          type: 'integer'
     }
     #swagger.responses[200] = {
          description: 'Photo deleted successfully'
     }
     #swagger.responses[401] = {
          description: 'Missing or invalid token'
     }
  */
);

export default router;