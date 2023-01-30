import User from "./../models/userModel";
import asyncWrap from "./../helperFns/asyncWrap";

export async function addNewUser(req, res, next) {
  // asyncWrap(async (req, res) => {
  console.log(req.body);
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    role: req.body.role === "admin" ? undefined : req.body.role,
    passwordConfirm: req.body.passwordConfirm,
  });
  res.status(201).json({
    status: "success",
    data: {
      data: newUser,
    },
  });
  // });
}
