import express from "express";
import { auth } from "../middleware/auth.js";
import {
  createNode,
  readFile,
  saveFile,
  renameNode,
  deleteNode,
  loadTree,
} from "../controllers/fileController.js";

const router = express.Router();

router.get("/tree", auth, loadTree);
router.get("/read", auth, readFile);
router.post("/create", auth, createNode);
router.put("/save", auth, saveFile);
router.put("/rename", auth, renameNode);
router.post("/delete", auth, deleteNode);

export default router;
