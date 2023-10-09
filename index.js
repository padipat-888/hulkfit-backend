const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require('body-parser')
const UserModel = require("./models/User");

const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

const uri = "mongodb+srv://admin:mongodb@clusteruser.5pf96sm.mongodb.net/hulkfit?retryWrites=true&w=majority"

mongoose
  .connect(
    uri,{ useNewUrlParser: true, useUnifiedTopology: true }
  );

app.get("/", (req, res) => {
  UserModel.find({})
    .then((user) => res.json(user))
    .catch((err) => res.json(err));
});

app.post('/login', async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  try {
    const user = await UserModel.findOne({ email:email, password:password });
    console.log(user)
    if (user) {
      res.json({ success: true, message: 'Login successful', id:user._id });
    } else {
      res.status(401).json({ success: false, message: `Invalid credentials` });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'An error occurred' });
  }

});


app.get("/getUserById/:id", (req, res) => {
  const id = req.params.id;
  UserModel.findById({ _id: id })
    .then((user) => res.json(user))
    .catch((err) => res.json(err));
});

app.post("/createUser", (req, res) => {
  UserModel.create(req.body)
    .then((user) => res.json(user))
    .catch((err) => res.json(err));
});

app.put("/updateUser/:id", (req, res) => {
  const id = req.params.id;
  UserModel.findByIdAndUpdate(
    { _id: id },
    { name: req.body.name, email: req.body.email, age: req.body.age })
    .then((user) => res.json(user))
    .catch((err) => res.json(err));
});

app.delete(`/deleteUser/:id`, (req, res) => {
    const id = req.params.id;
    UserModel.deleteOne({ _id: id })
    .then((user) => res.json(user))
    .catch((err) => res.json(err));
})

const port = 4000;
app.listen(port, () => {
  console.log(`Server Start in Port ${port}`);
});
