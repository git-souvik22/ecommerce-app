import jwt from "jsonwebtoken";
import userModel from "../model/userModel.js";

const requireLogin = async (req, res, next) => {
  try {
    const decode = jwt.verify(
      req.headers.authorization,
      process.env.SECRET_KEY
    );
    req.user = decode;
    next();
  } catch (error) {
    console.log(error);
  }
};

const isAdmin = async (req, res, next) => {
  try {
    const user = await userModel.findById(req.user._id);
    if (user.role !== 1) {
      res.status(401).send({
        success: false,
        message: "Unauthorize access",
      });
    } else {
      next();
    }
  } catch (error) {
    console.log(error);
  }
};

export { requireLogin, isAdmin };
