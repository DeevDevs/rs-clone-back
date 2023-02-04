import jwt from "jsonwebtoken";
import User from "./../models/userModel";
import Stats from "../models/statsModel";
import { defaultStats } from "../helperFns/staticValues";
import { promisify } from "util";
import { createCookieOptions } from "../helperFns/newCookieOpt";
import { createToken } from "../helperFns/newToken";

const sendToken = (user, statusCode, req, res) => {
  try {
    const token = createToken(user._id);
    const cookieOptions = createCookieOptions(90);
    // makes sure the connection is secure (проверяет безопасность соединения)
    // if (req.secure || req.headers["x-forwarded-proto"] === "https")
    //   cookieOptions.secure = true; // this is specific for HEROKU (это необходимо для работы с Heroku)
    // adds a cookie to response object (добавляет cookie в ответ)
    res.cookie("jwt", token, cookieOptions);
    user.password = undefined;
    res.status(statusCode).json({
      status: "success",
      token,
      data: {
        user,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: error.message,
    });
  }
};

export const signUp = async (req, res) => {
  try {
    const newUser = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      role: req.body.role === "admin" ? undefined : req.body.role,
      statsID: "",
      memoirIDs: [],
      passwordConfirm: req.body.passwordConfirm,
    });
    if (!newUser) throw new Error("Could not create a user");

    const newStats = await Stats.create(defaultStats);
    if (!newStats) throw new Error("Could not create stats default document");

    const readyUser = await User.findByIdAndUpdate(
      newUser.id,
      { statsID: newStats.id },
      {
        new: true,
        runValidators: true,
      }
    );
    if (!readyUser) throw new Error("Could not update user with stats ID");

    sendToken(readyUser, 201, req, res);
  } catch (error) {
    res.status(400).json({
      status: error.message,
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) throw new Error("Email or Password is missing");

    const user = await User.findOne({ email }).select("+password");
    if (!user || password !== user.password)
      throw new Error("There is no such user, or password is incorrect");

    sendToken(user, 200, req, res);
  } catch (error) {
    res.status(400).json({
      status: error.message,
    });
  }
};

export const logout = (req, res) => {
  res.cookie("jwt", "loggedout", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.status(200).json({ status: "success" });
};

export const isLoggedIn = async (req, res, next) => {
  try {
    if (req.cookies.jwt && req.cookies.jwt !== "loggedout") {
      const decoded = await promisify(jwt.verify)(
        req.cookies.jwt,
        process.env.JWT_SECRET
      );
      const currentUser = await User.findById(decoded.id);
      if (!currentUser) {
        res.status(200).json({
          status: "success",
          data: { message: "User is not logged in" },
        });
        return;
      }
      res.status(200).json({
        status: "success",
        data: currentUser,
      });
      return;
    }
    res.status(200).json({
      status: "success",
      data: { message: "User is not logged in" },
    });
    return;
  } catch (error) {
    res.status(400).json({
      status: error.message,
    });
  }
  next();
};

export const protect = async (req, res, next) => {
  try {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    } else if (req.cookies.jwt) token = req.cookies.jwt;
    if (!token) throw new Error("There is no token");

    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) throw new Error("There is no such user");

    req.user = currentUser;
    res.locals.user = currentUser;
    next();
  } catch (error) {
    res.status(400).json({
      status: error.message,
    });
  }
};
