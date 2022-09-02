const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
app.use(cors());
require("./userDetails");
app.use(express.json());

const mongoUrl =
  "mongodb+srv://jhilick:Somdotta27@cluster0.b9uwjxt.mongodb.net/?retryWrites=true&w=majority";
mongoose
  .connect(mongoUrl, {
    useNewUrlParser: true,
  })
  .then(() => {
    console.log("Connected to database");
  })
  .catch((error) => console.log(error));

const User = mongoose.model("UserInfo");

app.post("/register", async (req, res) => {
  const { fname, lname, email, password } = req.body;
  const encryptedPwd = await bcrypt.hash(password, 10);
  try {
    const userPresent = await User.findOne({ email });
    if (userPresent) {
      return res.send({ error: "User exists" });
    }
    await User.create({
      fname,
      lname,
      email,
      password: encryptedPwd,
    });
    res.send({ status: "OK" });
  } catch (error) {
    res.send({ status: "Error" });
  }
});

app.listen(8000, () => {
  console.log("Server started at 8000");
});
