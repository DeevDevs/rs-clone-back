import User from "./../models/userModel";
import Memoir from "../models/memoirModel";

export async function addNewMemoir(req, res, next) {
  try {
    console.log(req.body);
    const newMemoir = await Memoir.create({ ...req.body });

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
    if (!thisMemoir) {
      throw new Error("No user found with that ID");
    }
    const thisMemoirDeleted = await Memoir.findByIdAndDelete(req.body.id);
    if (!thisMemoirDeleted) {
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

export async function getOneMemoir(req, res, next) {
  try {
    const memoir = await Memoir.findById(req.body.id);
    // do not forget to remove password copy from the object later
    if (!memoir) {
      throw new Error("No document found with that ID");
    }
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
    const doc = await Memoir.findByIdAndUpdate(id, updateBody, {
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
