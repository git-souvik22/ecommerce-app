import express from "express";
import {
  adminDashboardController,
  forgotPasswordController,
  getAllOrderController,
  getOrderController,
  loginController,
  orderStatusController,
  registerController,
  updateProfileController,
} from "../controller/authController.js";
import { isAdmin, requireLogin } from "../middlewares/userAuthMiddleware.js";
const router = express.Router();

// routes

// register route
router.post("/user-registration", registerController);

// login route
router.post("/user-login", loginController);

router.post("/forgot-password", forgotPasswordController);

router.get("/admin-dashboard", requireLogin, isAdmin, adminDashboardController);

// authentic user access dashboard
router.get("/user-dashboard", requireLogin, (req, res) => {
  res.status(200).send({
    ok: true,
  });
});

//update profile
router.put("/profile", requireLogin, updateProfileController);

// order route
router.get("/orders", requireLogin, getOrderController);

// all orders for admin
router.get("/all-orders", requireLogin, isAdmin, getAllOrderController);

// update order status
router.put(
  "/order-status/:orderId",
  requireLogin,
  isAdmin,
  orderStatusController
);

export default router;
