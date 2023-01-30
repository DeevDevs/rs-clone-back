import express from "express";

const router = express.Router();

const hello = async function (req, res) {
  const body = {
    name: "Vova",
    age: 23,
  };
  res.body = JSON.stringify(body);
  console.log("I was called");
  console.log(res.body);
  res.status(200).json({ status: "success", body });
};

router.get("/", hello);

export default router;
