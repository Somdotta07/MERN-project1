const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const JWT_SECRET = "007hfhumiafjplfmjfmvimxvjfvmfjkfmv"

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

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return res.json({error: "User Not found"})
  }
  if (await bcrypt.compare(password, user.password)) {
    const token = jwt.sign({email:user.email}, JWT_SECRET)
    if (res.status(201)) {
      return res.json({ status: "ok", data: token });
    } else {
      return res.json({error: "error"})
    }
  }
 return res.json({status:"error",error:"Invalid Password"})
})

app.post("/user", async (req, res) => {
  const { token } = req.body;
  try {
    const user = jwt.verify(token, JWT_SECRET)
    const userEmail = user.email;
    User.findOne({ email: userEmail }).then((data) => {
      res.send({status: "ok", data: data})
    }).catch((error) => {
      res.send({status:"error", data:error})
    })
  }
  catch(error){}
})

app.listen(8000, () => {
  console.log("Server started at 8000");
});
