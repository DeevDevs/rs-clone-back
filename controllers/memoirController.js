const User = require("../models/userModel");
const Memoir = require("../models/memoirModel");
const Stats = require("../models/statsModel");
const { updateStats } = require("../helperFns/updatedStats");
const MyError = require("../helperFns/errorClass");

exports.addNewMemoir = async (req, res, next) => {
  try {
    const thisUserID = req.user._id;
    if ((thisUserID.toString() !== req.body.userID))
      return next(new MyError("You cannot create a memoir. Login or Signup first", 401));
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

    //now, update stats
    const oldStats = await Stats.findById(updatedUser.statsID);
    if (!oldStats)
      return next(new MyError("Could not find stats with that ID", 404));
    const updatedStatsBody = updateStats(oldStats, newMemoir, "add");
    const updatedStats = await Stats.findByIdAndUpdate(
      updatedUser.statsID,
      updatedStatsBody,
      {
        new: true,
      }
    );
    if (!updatedStats) return next(new MyError("Could not update stats", 500));

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
        new MyError("Please, specify the memoir ID you want to delete, or login first", 400)
      );
    const thisMemoir = await Memoir.findById(memoirID);
    if (!thisMemoir)
      return next(new MyError("No memoir found with that ID", 404));

    const thisUser = await User.findById(thisUserID);
    if (!thisUser) return next(new MyError("No user found with that ID", 404));

    //now, update stats
    const oldStats = await Stats.findById(thisUser.statsID);
    if (!oldStats)
      return next(new MyError("Could not find stats for this user", 404));
    const updatedStatsBody = updateStats(oldStats, thisMemoir, "remove");
    const updatedStats = await Stats.findByIdAndUpdate(
      thisUser.statsID,
      updatedStatsBody,
      {
        new: true,
      }
    );
    if (!updatedStats) return next(new MyError("Could not update stats", 500));

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
    if (!req.user.statsID || !req.query.id)
      return next(new MyError("Wrong query", 401));
    const userStatsID = req.user.statsID;
    const targetMemoirID = req.query.id;
    const oldStats = await Stats.findById(userStatsID);
    if (!oldStats) return next(new MyError("No stats found with that ID", 404));

    const oldMemoir = await Memoir.findById(targetMemoirID);
    if (!oldMemoir)
      return next(new MyError("No memoir found with that ID", 404));

    const initialStatsUpdateBody = updateStats(oldStats, oldMemoir, "remove");

    // const updatedStats = await Stats.findByIdAndUpdate(
    //   userStatsID,
    //   initialStatsUpdateBody,
    //   {
    //     new: true,
    //   }
    // );
    // if (!updatedStats)
    //   return next(
    //     new MyError("Could not update stats while memoir update", 500)
    //   );

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

    //now, update stats
    const updatedStatsBody = updateStats(
      initialStatsUpdateBody,
      updatedMemoir,
      "add"
    );
    const updatedStats = await Stats.findByIdAndUpdate(
      userStatsID,
      updatedStatsBody,
      {
        new: true,
      }
    );
    if (!updatedStats) return next(new MyError("Could not update stats", 500));

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
    if (!req.user) return next(new MyError("Please, fix the request URL", 400));
    console.log(req.user);
    console.log("I was initiated");
    const memoirIDs = req.user.memoirIDs;
    if (memoirIDs.length === 0) {
      res.status(200).json({
        status: "success",
        data: [],
      });
      return;
    }
    const promises = await memoirIDs.map((targetMemoirID) => {
      return new Promise(async (resolve) => {
        const memoir = await Memoir.findById(targetMemoirID);
        if (memoir) {
          const previewData = {
            memoirID: memoir._id,
            memoirLocation: memoir.longLat,
            memoirName: memoir.tripName,
          };
          resolve(previewData);
          return;
        } else reject('Smth went wrong');
      });
    });

    const promiseResults = await Promise.allSettled(promises);
    console.log(promiseResults);
    const previews = promiseResults.map((result) => result.value);
    res.status(200).json({
      status: "success",
      data: previews,
    });
  } catch (error) {
    console.log(error);
    return next(
      new MyError("Something went wrong while getting previews", 500)
    );
  }
};
