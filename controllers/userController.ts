import User from "./../models/userModel";
import Stats from "../models/statsModel";
import Memoir from "../models/memoirModel";
import MyError from "../helperFns/errorClass";

export async function deleteOneUser(req, res, next) {
  try {
    const thisUser = await User.findById(req.body.id);
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

    await User.findByIdAndDelete(req.body.id);

    res.status(204).json({
      status: "success",
      data: null,
    });
  } catch (error) {
    return next(
      new MyError("Something went wrong while deleting user profile", 500)
    );
  }
}

export async function getOneUser(req, res, next) {
  try {
    const user = await User.findById(req.body.id);
    if (!user) return next(new MyError("No user found with that ID", 404));

    res.status(200).json({
      status: "success",
      data: user,
    });
  } catch (error) {
    return next(
      new MyError("Something went wrong while getting user profile", 500)
    );
  }
}

export async function updateOneUser(req, res, next) {
  try {
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
      data: {
        data: updatedUser,
      },
    });
  } catch (error) {
    return next(
      new MyError(
        "Something went wrong while updating user profile",
        error.code
      )
    );
  }
}
