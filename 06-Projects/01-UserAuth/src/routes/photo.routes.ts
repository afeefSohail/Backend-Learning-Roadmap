import express, { Application , Router } from "express";
import { uploadPhotos, getAllPhotos, getPhoto, deletePhoto }  from "#controllers/photo.controllers";
const app: Application = express();
const router: Router = express.Router();

// router.post("/me/photos", uploadPhotos);
// router.get("/me/photos", getAllPhotos);
// router.get("/:id/photos", getPhoto);
// router.delete("/me/photos/:photoId", deletePhoto);

router.route("/me/photos").post(uploadPhotos).get(getAllPhotos);
router.route("/:id/photos").get(getPhoto);
router.route("/me/photos/:photoId").delete(deletePhoto);

export default router;