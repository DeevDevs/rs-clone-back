import express from "express";
import { addNewUser } from "../controllers/userController";

// export async function addNewUser(req, res, next) {
//   console.log(req.body);
//   // const newUser = await User.create({
//   //   name: req.body.name,
//   //   email: req.body.email,
//   //   password: req.body.password,
//   //   role: req.body.role === "admin" ? undefined : req.body.role,
//   //   passwordConfirm: req.body.passwordConfirm,
//   // });
//   res.status(201).json({
//     status: "success",
//     data: {
//       data: req.body,
//     },
//   });
// }

const router = express.Router();

router.post("/", addNewUser);

export default router;
