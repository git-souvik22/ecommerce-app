import express from "express";
import { isAdmin, requireLogin } from "../middlewares/userAuthMiddleware.js";
import {
  categoryController,
  createCategoryController,
  deleteCategoryController,
  singleCategoryController,
  updateCategoryController,
} from "../controller/categoryController.js";

const router = express.Router();

// routes
// create category
router.post(
  "/create-category",
  requireLogin,
  isAdmin,
  createCategoryController
);

// update category
router.put(
  "/update-category/:id",
  requireLogin,
  isAdmin,
  updateCategoryController
);

// category
router.get("/get-category", categoryController);

// single category route
router.get("/single-category/:slug", singleCategoryController);

// delete category
router.delete(
  "/delete-category/:id",
  requireLogin,
  isAdmin,
  deleteCategoryController
);

export default router;
