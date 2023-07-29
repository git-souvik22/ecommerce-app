import express from "express";
import { isAdmin, requireLogin } from "../middlewares/userAuthMiddleware.js";
import {
  brainTreePaymentController,
  braintreeTokenController,
  createProductController,
  deleteProductController,
  getProductController,
  getSingleProductController,
  productCategoryController,
  productCountController,
  productFiltersController,
  productListController,
  productPhotoController,
  relatedProductController,
  searchProductController,
  updateProductController,
} from "../controller/productController.js";
import ExpressFormidable from "express-formidable";

const router = express.Router();

router.post(
  "/create-product",
  requireLogin,
  isAdmin,
  ExpressFormidable(),
  createProductController
);

// product update route
router.put(
  "/update-product/:pid",
  requireLogin,
  isAdmin,
  ExpressFormidable(),
  updateProductController
);

//get products
router.get("/get-product", getProductController);

//single product
router.get("/get-product/:slug", getSingleProductController);

//get photo
router.get("/product-photo/:pid", productPhotoController);

//   //delete rproduct
router.delete(
  "/delete-product/:pid",
  requireLogin,
  isAdmin,
  deleteProductController
);

//filter product
router.post("/product-filters", productFiltersController);

//product count
router.get("/product-count", productCountController);

//product per page
router.get("/product-list/:page", productListController);

//search product
router.get("/search/:keyword", searchProductController);

//   //similar product
router.get("/related-product/:pid/:cid", relatedProductController);

//category wise product
router.get("/product-category/:slug", productCategoryController);

//payments routes
//token
router.get("/braintree/token", braintreeTokenController);

//payments
router.post("/braintree/payment", requireLogin, brainTreePaymentController);

export default router;
