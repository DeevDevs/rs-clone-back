import Stats from "../models/statsModel";
import { updateStats } from "../helperFns/updatedStats";
import Memoir from "../models/memoirModel";

export async function getOneStats(req, res, next) {
  try {
    const stats = await Stats.findById(req.body.statsID);

    if (!stats) {
      throw new Error("No document found with that ID");
    }
    res.status(200).json({
      status: "success",
      data: stats,
    });
  } catch (error) {
    res.status(400).json({
      status: error.message,
    });
  }
}

export async function updateOneStats(req, res, next) {
  try {
    const statsID = req.body.statsID;
    const oldStats = await Stats.findById(statsID);
    if (!oldStats) throw new Error("Could not find stats with that ID");

    const newMemoir = await Memoir.findById(req.body.memoirID);
    if (!oldStats) throw new Error("Coud not find memoir with that ID");

    const updateBody = updateStats(oldStats, newMemoir, req.body.condition);
    const updatedStats = await Stats.findByIdAndUpdate(statsID, updateBody, {
      new: true,
    });
    if (!updatedStats) throw new Error("Could not update stats");

    res.status(200).json({
      status: "success",
      data: {
        data: updatedStats,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: error.message,
    });
  }
}
