const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const Stats = require("../models/statsModel");
const { defaultStats } = require("../helperFns/staticValues");
const { promisify } = require("util");
const { createCookieOptions } = require("../helperFns/newCookieOpt");
const { createToken } = require("../helperFns/newToken");
const MyError = require("../helperFns/errorClass");

const sendToken = async (user, statusCode, req, res) => {
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

exports.signUp = async (req, res, next) => {
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
    if (!newUser) return next(new MyError("Could not create a user", 503));

    const newStats = await Stats.create(defaultStats);
    if (!newStats)
      return next(new MyError("Could not create default stats", 503));

    const readyUser = await User.findByIdAndUpdate(
      newUser.id,
      { statsID: newStats.id },
      {
        new: true,
        runValidators: true,
      }
    );
    if (!readyUser)
      return next(new MyError("Could not update user with that stats ID", 503));

    sendToken(readyUser, 201, req, res);
    return;
  } catch (error) {
    if (error.name === "ValidationError")
      return next(new MyError(error.name, 99000));
    return next(new MyError("Something went wrong while signup", error.code));
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return next(new MyError("Email or Password is missing", 401));

    const user = await User.findOne({ email }).select("+password");
    if (!user || password !== user.password)
      return next(new MyError("Email or Password is incorrect", 401));

    sendToken(user, 200, req, res);
  } catch (error) {
    return next(new MyError("Something went wrong while login", 500));
  }
};

exports.logout = (req, res) => {
  res.cookie("jwt", "loggedout", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.status(200).json({ status: "success" });
};

exports.isLoggedIn = async (req, res, next) => {
  try {
    if (req.cookies.jwt && req.cookies.jwt !== "loggedout") {
      const decoded = await promisify(jwt.verify)(
        req.cookies.jwt,
        process.env.JWT_SECRET
      );
      const currentUser = await User.findById(decoded.id);
      if (!currentUser) return next(new MyError("User is not logged in", 401));

      res.status(200).json({
        status: "success",
        data: currentUser,
      });
      return;
    }
    next(new MyError("User is not logged in", 401));
  } catch (error) {
    return next(
      new MyError("Something went wrong while checking authorization", 500)
    );
  }
  next();
};

exports.protect = async (req, res, next) => {
  try {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    } else if (req.cookies.jwt) token = req.cookies.jwt;
    if (!token)
      return next(
        new MyError("Please, signup or login to perform this action", 401)
      );

    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    const currentUser = await User.findById(decoded.id);
    if (!currentUser)
      return next(new MyError("No use found with such ID", 404));

    req.user = currentUser;
    res.locals.user = currentUser;
    next();
  } catch (error) {
    return next(
      new MyError("You are not authorized to perform this action", 401)
    );
  }
};
