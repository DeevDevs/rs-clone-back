import User from "./../models/userModel";
import Stats from "../models/statsModel";

export async function addNewUser(req, res, next) {
  try {
    console.log(req.body);
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

    const newStats = await Stats.create({
      places: 0,
      days: 0,
      averageRate: 0,
      sites: [],
      countries: [],
      continents: [],
    });

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

    res.status(201).json({
      status: "success",
      data: {
        data: readyUser,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: error.message,
    });
  }
}

export async function deleteOneUser(req, res, next) {
  try {
    const thisUser = await User.findById(req.body.id);
    if (!thisUser) {
      throw new Error("No user found with that ID");
    }
    console.log(thisUser.statsID);

    const statsDeleted = await Stats.findByIdAndDelete(thisUser.statsID);
    if (!statsDeleted) {
      throw new Error("No stats found with that ID");
    }
    const thisUserDeleted = await User.findByIdAndDelete(req.body.id);
    if (!thisUserDeleted) {
      throw new Error("No user found with that ID");
    }
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

export async function getOneUser(req, res, next) {
  try {
    const user = await User.findById(req.body.id);
    // do not forget to remove password copy from the object later
    if (!user) {
      throw new Error("No document found with that ID");
    }
    res.status(200).json({
      status: "success",
      data: user,
    });
  } catch (error) {
    res.status(400).json({
      status: error.message,
    });
  }
}

export async function updateOneUser(req, res, next) {
  try {
    const id = req.body.id;
    const updateBody = {
      name: req.body.name,
    };
    const doc = await User.findByIdAndUpdate(id, updateBody, {
      new: true, // return the new/updated document/data (возвращает новую версию документа)
      runValidators: true,
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
