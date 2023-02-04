import User from "./../models/userModel";
import Memoir from "../models/memoirModel";
import Stats from "../models/statsModel";
import { updateStats } from "../helperFns/updatedStats";
import MyError from "../helperFns/errorClass";

export async function addNewMemoir(req, res, next) {
  try {
    const newMemoir = await Memoir.create({ ...req.body });
    if (!newMemoir) return next(new MyError("Could not create a memoir", 404));

    const thisUser = await User.findById(res.locals.user._id);
    if (!thisUser) return next(new MyError("No user found with that ID", 404));

    const updateUserBody = {
      memoirIDs: [newMemoir.id, ...thisUser.memoirIDs],
    };
    const updatedUser = await User.findByIdAndUpdate(
      res.locals.user._id,
      updateUserBody,
      {
        new: true,
        runValidators: true,
      }
    );
    if (!updatedUser)
      return next(new MyError("Could not update user with that ID", 500));

    res.status(201).json({
      status: "success",
      data: {
        data: newMemoir,
      },
    });
  } catch (error) {
    return next(
      new MyError("Something went wrong while creating a memoir", 500)
    );
  }
}

export async function deleteOneMemoir(req, res, next) {
  try {
    const thisMemoir = await Memoir.findById(req.body.id);
    if (!thisMemoir)
      return next(new MyError("No memoir found with that ID", 404));

    const thisUser = await User.findById(res.locals.user._id);
    if (!thisUser) return next(new MyError("No user found with that ID", 404));

    await Memoir.findByIdAndDelete(req.body.id);

    const updateBody = {
      memoirIDs: thisUser.memoirIDs.filter((id) => id !== req.body.id),
    };

    const updatedUser = await User.findByIdAndUpdate(
      res.locals.user._id,
      updateBody,
      {
        new: true,
        runValidators: true,
      }
    );
    if (!updatedUser)
      return next(
        new MyError("Could not update user DB after memoir was deleted", 500)
      );

    res.status(204).json({
      status: "success",
      data: null,
    });
  } catch (error) {
    return next(
      new MyError("Something went wrong while deleting a memoir", 500)
    );
  }
}

export async function getOneMemoir(req, res, next) {
  try {
    const memoir = await Memoir.findById(req.body.id);
    if (!memoir) return next(new MyError("No memoir found with that ID", 404));

    res.status(200).json({
      status: "success",
      data: memoir,
    });
  } catch (error) {
    return next(
      new MyError("Something went wrong while getting a memoir", 500)
    );
  }
}

export async function updateOneMemoir(req, res, next) {
  try {
    const userStatsID = res.locals.user.statsID;
    const targetMemoirID = req.body.id;
    const oldStats = await Stats.findById(userStatsID);
    if (!oldStats) return next(new MyError("No stats found with that ID", 404));

    const oldMemoir = await Memoir.findById(targetMemoirID);
    if (!oldStats)
      return next(new MyError("No memoir found with that ID", 404));

    const initialStatsUpdateBody = updateStats(oldStats, oldMemoir, "remove");

    const updatedStats = await Stats.findByIdAndUpdate(
      userStatsID,
      initialStatsUpdateBody,
      {
        new: true,
      }
    );
    if (!updatedStats)
      return next(
        new MyError("Could not update stats while memoir update", 500)
      );

    const updateBody = { ...req.body };

    const updatedMemoir = await Memoir.findByIdAndUpdate(
      targetMemoirID,
      updateBody,
      {
        new: true, // return the new/updated document/data (возвращает новую версию документа)
        runValidators: true,
      }
    );
    if (!updatedMemoir) return next(new MyError("No memoir found with that ID", 404));

    res.status(200).json({
      status: "success",
      data: {
        data: updatedMemoir,
      },
    });
  } catch (error) {
    return next(
      new MyError("Something went wrong while updating a memoir", 500)
    );
  }
}
