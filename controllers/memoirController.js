const User = require("../models/userModel");
const Memoir = require("../models/memoirModel");
const Stats = require("../models/statsModel");
const { updateStats } = require("../helperFns/updatedStats");
const MyError = require("../helperFns/errorClass");

exports.addNewMemoir = async (req, res, next) => {
  try {
    const thisUserID = req.user._id;
    const newMemoir = await Memoir.create({ ...req.body });
    if (!newMemoir) return next(new MyError("Could not create a memoir", 404));

    const thisUser = await User.findById(thisUserID);
    if (!thisUser) return next(new MyError("No user found with that ID", 404));

    const updateUserBody = {
      memoirIDs: [newMemoir.id, ...thisUser.memoirIDs],
    };
    const updatedUser = await User.findByIdAndUpdate(
      thisUserID,
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
      data: newMemoir,
    });
  } catch (error) {
    console.log(error);
    return next(
      new MyError("Something went wrong while creating a memoir", 500)
    );
  }
};

exports.deleteOneMemoir = async (req, res, next) => {
  try {
    const thisUserID = req.user._id;
    const memoirID = req.query.id;
    if (!memoirID)
      return next(
        new MyError("Please, the memoir ID you want to delete ", 400)
      );
    const thisMemoir = await Memoir.findById(memoirID);
    if (!thisMemoir)
      return next(new MyError("No memoir found with that ID", 404));

    const thisUser = await User.findById(thisUserID);
    if (!thisUser) return next(new MyError("No user found with that ID", 404));

    await Memoir.findByIdAndDelete(memoirID);

    const updateBody = {
      memoirIDs: thisUser.memoirIDs.filter((id) => id !== memoirID),
    };

    const updatedUser = await User.findByIdAndUpdate(thisUserID, updateBody, {
      new: true,
      runValidators: true,
    });
    if (!updatedUser)
      return next(
        new MyError("Could not update user DB after memoir was deleted", 500)
      );

    res.status(204).json({
      status: "success",
      data: null,
    });
  } catch (error) {
    console.log(error);
    return next(
      new MyError("Something went wrong while deleting a memoir", 500)
    );
  }
};

exports.getOneMemoir = async (req, res, next) => {
  try {
    const memoir = await Memoir.findById(req.query.id);
    if (!memoir) return next(new MyError("No memoir found with that ID", 404));

    res.status(200).json({
      status: "success",
      data: memoir,
    });
  } catch (error) {
    console.log(error);
    return next(
      new MyError("Something went wrong while getting a memoir", 500)
    );
  }
};

exports.updateOneMemoir = async (req, res, next) => {
  try {
    const userStatsID = req.user.statsID;
    const targetMemoirID = req.query.id;
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
    delete updateBody.id;

    const updatedMemoir = await Memoir.findByIdAndUpdate(
      targetMemoirID,
      updateBody,
      {
        new: true, // return the new/updated document/data (возвращает новую версию документа)
        runValidators: true,
      }
    );
    if (!updatedMemoir)
      return next(new MyError("No memoir found with that ID", 404));

    res.status(200).json({
      status: "success",
      data: updatedMemoir,
    });
  } catch (error) {
    console.log(error);
    return next(
      new MyError("Something went wrong while updating a memoir", 500)
    );
  }
};

exports.getPreviewData = async (req, res, next) => {
  try {
    if (!req.user)
      return next(
        new MyError("Please, signup or login to perform this action", 400)
      );
    const memoirIDs = req.user.memoirIDs;
    if (memoirIDs.length === 0) {
      res.status(200).json({
        status: "success",
        data: [],
      });
    }
    const promises = await memoirIDs.map((memoirID) => {
      return new Promise(async (resolve) => {
        const memoir = await Memoir.findById(targetMemoirID);
        if (memoir) {
          const previewData = {
            memoirID: memoir._id,
            memoirLocation: memoir.longLat,
            memoirName: memoir.tripName,
          };
          resolve(previewData);
        }
        reject(new MyError("Could not find a memoir for preview", 404));
      });
    });

    const previews = await Promise.allSettled(promises);

    res.status(200).json({
      status: "success",
      data: previews,
    });
  } catch (error) {
    console.log(error);
    return next(
      new MyError("Something went wrong while updating a memoir", 500)
    );
  }
};
