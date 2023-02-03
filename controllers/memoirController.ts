import User from "./../models/userModel";
import Memoir from "../models/memoirModel";

export async function addNewMemoir(req, res, next) {
  try {
    const newMemoir = await Memoir.create({ ...req.body });
    if (!newMemoir) throw new Error("Could not create a memoir");
    console.log(newMemoir);

    const thisUser = await User.findById(res.locals.user._id);
    if (!thisUser) throw new Error("No user found with that ID");
    const updateBody = {
      memoirIDs: [newMemoir.id, ...thisUser.memoirIDs],
    };
    const updatedUser = await User.findByIdAndUpdate(
      res.locals.user._id,
      updateBody,
      {
        new: true,
        runValidators: true,
      }
    );
    if (!updatedUser) throw new Error("No user found with that ID");

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

export async function deleteOneMemoir(req, res, next) {
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

export async function getOneMemoir(req, res, next) {
  try {
    const memoir = await Memoir.findById(req.body.id);
    // do not forget to remove password copy from the object later
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

export async function updateOneMemoir(req, res, next) {
  try {
    const id = req.body.id;
    const updateBody = {
      memoirPhoto: req.body.memoirPhoto,
    };

    const updatedMemoir = await Memoir.findByIdAndUpdate(id, updateBody, {
      new: true, // return the new/updated document/data (возвращает новую версию документа)
      runValidators: true,
    });
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
