import Stats from "../models/statsModel";

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
    if (!oldStats) {
      throw new Error("No document found with that ID");
    }
    console.log(oldStats, req.body.rateValue);
    const newRate =
      (oldStats.averageRate * oldStats.places + req.body.rateValue) /
      (oldStats.places + 1);
    console.log(newRate);
    const updateBody = {
      places: oldStats.places + 1,
      stats: oldStats.days + req.body.days,
      averageRate: newRate,
      sites: [...oldStats.sites, ...req.body.sites],
      countries: [...oldStats.countries, req.body.countryName],
      continents: [...oldStats.continents, req.body.continentName],
    };
    const doc = await Stats.findByIdAndUpdate(statsID, updateBody, {
      new: true,
    });
    if (!doc) {
      throw new Error("No document found with that ID");
    }
    res.status(200).json({
      status: "success",
      data: {
        data: doc,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: error.message,
    });
  }
}
