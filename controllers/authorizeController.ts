import jwt from "jsonwebtoken";
import User from "./../models/userModel";
import Stats from "../models/statsModel";
import { defaultStats } from "../helperFns/staticValues";
import { promisify } from "util";

const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  }); // arg1: payload, arg2: secret, arg3: expiration_timer
};

const sendToken = (user, statusCode, req, res) => {
  try {
    const token = createToken(user._id);
    const cookieOptions = {
      expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
      httpOnly: true,
    };
    // makes sure the connection is secure (проверяет безопасность соединения)
    // if (req.secure || req.headers["x-forwarded-proto"] === "https")
    //   cookieOptions.secure = true; // this is specific for HEROKU (это необходимо для работы с Heroku)
    // adds a cookie to response object (добавляет cookie в ответ)
    res.cookie("jwt", token, cookieOptions);
    // hides the user password (прячет пароль пользователя)
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

export const signUp = async (req, res, next) => {
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

    if (!newUser) {
      throw new Error("Could not create a user");
    }

    const newStats = await Stats.create(defaultStats);

    if (!newStats) {
      throw new Error("Could not create stats default document");
    }

    const readyUser = await User.findByIdAndUpdate(
      newUser.id,
      { statsID: newStats.id },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!readyUser) {
      throw new Error("Could not update user with stats ID");
    }

    // create and send token for the logged in session (отправляет токен для авторизованной сессии)
    sendToken(readyUser, 201, req, res);
  } catch (error) {
    res.status(400).json({
      status: error.message,
    });
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      throw new Error("Email or Password is missing");
    }
    // retrieve the encrypted password from the user profile (выводит зашифрованный пароль из базы данных)
    const user = await User.findOne({ email }).select("+password");
    // check if the entered password is correct (проверяет пароль)
    if (!user || password !== user.password) {
      throw new Error("There is no such user, or password is incorrect");
    }
    // create and send token for the logged in session (отправляет токен для авторизованной сессии)
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
    console.log(error);
    res.status(400).json({
      status: error.message,
    });
  }
  next();
};

export const protect = async (req, res, next) => {
  try {
    // check the token presence in headers or in cookies (проверяет наличие токена в headers и cookies)
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    } else if (req.cookies.jwt) token = req.cookies.jwt;

    if (!token) {
      // return next(
      //   new AppError("You are not logged in. Please, log in to get access", 401)
      // );
      throw new Error("There is no token");
    }
    // verify the token using the secret (проверяет токен)
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    // check if the user still exists (проверяет, существует ли пользователь)
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      // return next(new AppError("The user does not exist", 401));
      throw new Error("There is no such user");
    }
    // store user data (сохраняет данные пользователя в объектах запроса и ответа)
    req.user = currentUser;
    res.locals.user = currentUser;
    next();
  } catch (error) {
    res.status(400).json({
      status: error.message,
    });
  }
};
