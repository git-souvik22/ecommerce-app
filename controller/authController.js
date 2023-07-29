import userModel from "../model/userModel.js";
import orderModel from "../model/orderModel.js";
import { hashPassword, matchPassword } from "../util/authPass.js";
import jwt from "jsonwebtoken";

const registerController = async (req, res) => {
  try {
    const { name, email, password, phone, address, answer } = req.body;

    // if any data is not filled by user
    if (!name) {
      return res.send({ message: "Name is required" });
    }
    if (!email) {
      return res.send({ message: "Email is required" });
    }
    if (!password) {
      return res.send({ message: "Password is required" });
    }
    if (!phone) {
      return res.send({ message: "Phone no is required" });
    }
    if (!address) {
      return res.send({ message: "Address is required" });
    }
    if (!answer) {
      return res.send({ message: "Answer is required" });
    }
    // checking already registered user
    const userExist = await userModel.findOne({ email });
    if (userExist) {
      return res.status(200).send({
        success: true,
        message: "User already exist",
      });
    }

    // register user
    const hashedPassword = await hashPassword(password);

    const registerUser = new userModel({
      name,
      email,
      password: hashedPassword,
      phone,
      address,
      answer,
    });
    const savedUser = await registerUser.save();
    res.status(201).send({
      success: true,
      message: "Registered Successfully",
      savedUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "error in Registration",
      error,
    });
  }
};

// login controller
const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    const userCheck = await userModel.findOne({ email });
    const passCheck = await matchPassword(password, userCheck.password);

    if (userCheck && passCheck) {
      // generating token
      const token = jwt.sign({ _id: userCheck._id }, process.env.SECRET_KEY, {
        expiresIn: "5d",
      });

      return res.status(200).send({
        success: true,
        message: "successfully Logged in",
        user: {
          name: userCheck.name,
          email: userCheck.email,
          phone: userCheck.phone,
          address: userCheck.address,
          role: userCheck.role,
        },
        token,
      });
    } else {
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "error in Login",
      error,
    });
  }
};

// forgot password controller
const forgotPasswordController = async (req, res) => {
  try {
    const { email, answer, newpassword } = req.body;

    if (!email && !answer && !newpassword) {
      res.status(500).send({
        success: false,
        message: "All fields are required",
      });
    }
    const User = await userModel.findOne({ email, answer });
    if (!User) {
      res.status(404).send({
        success: false,
        message: "Wrong Email or Answer",
      });
    }

    if (User.answer === answer) {
      const hashed = await hashPassword(newpassword);
      await userModel.findByIdAndUpdate(User._id, { password: hashed });
      res.status(201).send({
        success: true,
        message: "Password is successfully updated",
      });
    } else {
      res.status(404).send({
        success: false,
        message: "Something went wrong please try again",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Something went wrong please try again",
      error,
    });
  }
};

const adminDashboardController = (req, res) => {
  res.send({
    ok: true,
    message: "protected route",
  });
};

// update profile
export const updateProfileController = async (req, res) => {
  try {
    const { name, password, address, phone } = req.body;
    const user = await userModel.findById(req.user._id);
    //password
    if (password && password.length < 6) {
      return res.json({ error: "Password is required and 6 character long" });
    }
    const hashedPassword = password ? await hashPassword(password) : undefined;
    const updatedUser = await userModel.findByIdAndUpdate(
      req.user._id,
      {
        name: name || user.name,
        password: hashedPassword || user.password,
        phone: phone || user.phone,
        address: address || user.address,
      },
      { new: true }
    );
    res.status(200).send({
      success: true,
      message: "Profile Updated SUccessfully",
      updatedUser,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Error WHile Update profile",
      error,
    });
  }
};

// order controller
export const getOrderController = async (req, res) => {
  try {
    const orders = await orderModel
      .find({ buyer: req.user._id })
      .populate("products", "-photo")
      .populate("buyer", "name");
    res.json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error While Getting Orders",
      error,
    });
  }
};

export const getAllOrderController = async (req, res) => {
  try {
    const orders = await orderModel
      .find({})
      .populate("products", "-photo")
      .populate("buyer", "name")
      .sort({ createdAt: "-1" });
    res.json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error While Getting Orders",
      error,
    });
  }
};

// get order status
export const orderStatusController = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    const orders = await orderModel.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );
    res.json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error While Updating Order",
      error,
    });
  }
};

export {
  registerController,
  loginController,
  adminDashboardController,
  forgotPasswordController,
};
