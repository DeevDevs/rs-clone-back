const Stats = require("../models/statsModel");
const { updateStats } = require("../helperFns/updatedStats");
const Memoir = require("../models/memoirModel");
const MyError = require("../helperFns/errorClass");

exports.getOneStats = async (req, res, next) => {
  try {
    const stats = await Stats.findById(req.body.statsID);
    if (!stats)
      return next(new MyError("No statistics found for this user", 404));

    res.status(200).json({
      status: "success",
      data: stats,
    });
  } catch (error) {
    return next(
      new MyError("Something went wrong while getting user statistics", 500)
    );
  }
};

exports.updateOneStats = async (req, res, next) => {
  try {
    if (!req.body.statsID || !req.body.memoirID)
      return next(
        new MyError("Wrong stats or wrong memoir is selected (devError)", 400)
      );
    const statsID = req.body.statsID;
    const oldStats = await Stats.findById(statsID);
    if (!oldStats)
      return next(new MyError("Could not find stats with that ID", 404));

    const newMemoir = await Memoir.findById(req.body.memoirID);
    if (!oldStats)
      return next(new MyError("Could not find memoir with that ID", 404));

    const updateBody = updateStats(oldStats, newMemoir, req.body.condition);
    const updatedStats = await Stats.findByIdAndUpdate(statsID, updateBody, {
      new: true,
    });
    if (!updatedStats) return next(new MyError("Could not update stats", 500));

    res.status(200).json({
      status: "success",
      data: updatedStats,
    });
  } catch (error) {
    return next(
      new MyError("Something went wrong while updating user statistics", 500)
    );
  }
};
