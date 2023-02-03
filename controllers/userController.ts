import User from "./../models/userModel";
import Stats from "../models/statsModel";
import { createUserBody } from "./../helperFns/newUserBody";
import { defaultStats } from "../helperFns/staticValues";

export async function addNewUser(req, res) {
  try {
    const newUser = await User.create(createUserBody(req.body));
    if (!newUser) throw new Error("Could not create a user");

    const newStats = await Stats.create(defaultStats);
    if (!newStats) throw new Error("Could not create stats default document");

    const readyUser = await User.findByIdAndUpdate(
      newUser.id,
      { statsID: newStats.id },
      {
        new: true,
        runValidators: true,
      }
    );
    if (!readyUser) throw new Error("Could not update user with stats ID");

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

export async function deleteOneUser(req, res) {
  try {
    const thisUser = await User.findById(req.body.id);
    if (!thisUser) throw new Error("No user found with that ID");

    const statsDeleted = await Stats.findByIdAndDelete(thisUser.statsID);
    if (!statsDeleted) throw new Error("No stats found with that ID");

    const thisUserDeleted = await User.findByIdAndDelete(req.body.id);
    if (!thisUserDeleted) throw new Error("No user found with that ID");

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

export async function getOneUser(req, res) {
  try {
    const user = await User.findById(req.body.id);
    // do not forget to remove password copy from the object later
    if (!user) throw new Error("No document found with that ID");

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

export async function updateOneUser(req, res) {
  try {
    const id = req.body.id;
    const updateBody = JSON.parse(JSON.stringify(req.body));
    if (updateBody.password) delete updateBody.password;
    if (updateBody.passwordConfirm) delete updateBody.passwordConfirm;

    const updatedUser = await User.findByIdAndUpdate(id, updateBody, {
      new: true,
      runValidators: true,
    });
    if (!updatedUser) throw new Error("No document found with that ID");

    res.status(200).json({
      status: "success",
      data: {
        data: updatedUser,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: error.message,
    });
  }
}
