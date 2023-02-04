import User from "./../models/userModel";
import Memoir from "../models/memoirModel";
import Stats from "../models/statsModel";
import { updateStats } from "../helperFns/updatedStats";

export async function addNewMemoir(req, res) {
  try {
    const newMemoir = await Memoir.create({ ...req.body });
    if (!newMemoir) throw new Error("Could not create a memoir");
    const thisUser = await User.findById(res.locals.user._id);
    if (!thisUser) throw new Error("No user found with that ID");

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
    if (!updatedUser) throw new Error("Could not update the user with that ID");

    res.status(201).json({
      status: "success",
      data: {
        data: newMemoir,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: error.message,
    });
  }
}

export async function deleteOneMemoir(req, res) {
  try {
    const thisMemoir = await Memoir.findById(req.body.id);
    if (!thisMemoir) throw new Error("No memoir found with that ID");

    const thisUser = await User.findById(res.locals.user._id);
    if (!thisUser) throw new Error("No user found with that ID");

    const thisMemoirDeleted = await Memoir.findByIdAndDelete(req.body.id);
    if (!thisMemoirDeleted) throw new Error("No user found with that ID");

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
      throw new Error("Could not update user DB after memoir was deleted");

    res.status(204).json({
      status: "success",
      data: null,
    });
  } catch (error) {
    res.status(400).json({
      status: error.message,
    });
  }
}

export async function getOneMemoir(req, res) {
  try {
    const memoir = await Memoir.findById(req.body.id);
    if (!memoir) throw new Error("No document found with that ID");

    res.status(200).json({
      status: "success",
      data: memoir,
    });
  } catch (error) {
    res.status(400).json({
      status: error.message,
    });
  }
}

export async function updateOneMemoir(req, res) {
  try {
    const userStatsID = res.locals.user.statsID;
    const targetMemoirID = req.body.id;
    const oldStats = await Stats.findById(userStatsID);
    if (!oldStats) throw new Error("Could not find stats with that ID");

    const oldMemoir = await Memoir.findById(targetMemoirID);
    if (!oldStats) throw new Error("Could not find memoir with that ID");

    const initialStatsUpdateBody = updateStats(oldStats, oldMemoir, "remove");

    const updatedStats = await Stats.findByIdAndUpdate(
      userStatsID,
      initialStatsUpdateBody,
      {
        new: true,
      }
    );
    if (!updatedStats)
      throw new Error("Could not update stats while memoir update");

    const updateBody = { ...req.body };

    const updatedMemoir = await Memoir.findByIdAndUpdate(
      targetMemoirID,
      updateBody,
      {
        new: true, // return the new/updated document/data (возвращает новую версию документа)
        runValidators: true,
      }
    );
    if (!updatedMemoir) throw new Error("No document found with that ID");

    res.status(200).json({
      status: "success",
      data: {
        data: updatedMemoir,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: error.message,
    });
  }
}
