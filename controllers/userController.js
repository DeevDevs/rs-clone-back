const User = require("../models/userModel");
const Stats = require("../models/statsModel");
const Memoir = require("../models/memoirModel");
const MyError = require("../helperFns/errorClass");
const { promisify } = require("util");
const jwt = require("jsonwebtoken");

exports.deleteOneUser = async (req, res, next) => {
  try {
    if (!req.user)
      return next(new MyError("Please, login to delete user data", 401));
    const thisUser = await User.findById(req.query.id);
    if (!thisUser) return next(new MyError("No user found with that ID", 404));

    const statsDeleted = await Stats.findByIdAndDelete(thisUser.statsID);
    if (!statsDeleted)
      return next(new MyError("No stats found with that ID", 404));

    const memoirsDeleted = thisUser.memoirIDs.map((memoir) => {
      return new Promise((resolve, reject) => {
        const deletedMemoir = Memoir.findByIdAndDelete(memoir);
        if (!deletedMemoir) {
          reject(new Error("Could not find memoir"));
        }
        resolve(deletedMemoir);
      });
    });
    await Promise.allSettled(memoirsDeleted);

    await User.findByIdAndDelete(req.query.id);

    res.status(204).json({
      status: "success",
      data: null,
    });
  } catch (error) {
    return next(
      new MyError("Something went wrong while deleting user profile", 500)
    );
  }
};

exports.getOneUser = async (req, res, next) => {
  try {
    if (!req.user)
      return next(new MyError("Please, login to get user data", 401));
    const user = await User.findById(req.query.id);
    if (!user) return next(new MyError("No user found with that ID", 404));

    res.status(200).json({
      status: "success",
      data: user,
    });
  } catch (error) {
    console.log(error);
    return next(
      new MyError("Something went wrong while getting user profile", 500)
    );
  }
};

exports.updateOneUser = async (req, res, next) => {
  try {
    if (!req.user)
      return next(new MyError("Please, login to update user data", 401));
    if (!req.body) return next(new MyError("Please, provide user data", 400));
    const id = req.body.id;
    const updateBody = JSON.parse(JSON.stringify(req.body));

    const updatedUser = await User.findByIdAndUpdate(id, updateBody, {
      new: true,
      runValidators: true,
    });
    if (!updatedUser)
      return next(new MyError("No user found with that ID", 404));

    res.status(200).json({
      status: "success",
      data: updatedUser,
    });
  } catch (error) {
    return next(
      new MyError(
        "Something went wrong while updating user profile",
        error.code
      )
    );
  }
};
