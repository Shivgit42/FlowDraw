import express, { Router } from "express";
import {
  createDocument,
  getAllDocuments,
  getAllShapes,
  addShape,
  deleteDocument,
  renameDocument,
  clearShapes,
  overwriteCanvas,
} from "../controllers/document.controller";

const router: Router = express.Router();

router.get("/", getAllDocuments);
router.post("/", createDocument);
router.post("/shapes", getAllShapes);
router.post("/add-shape", addShape);
router.delete("/:documentId", deleteDocument);
router.put("/:documentId", renameDocument);
router.delete("/clear/:documentId", clearShapes);
router.post("/shapes/overwrite", overwriteCanvas);

export default router;
