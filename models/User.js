const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  fullname: String,
  email: String,
  pass: String,
  img: String
},
{
    collection:"user"
}
);

const UserModel = mongoose.model("user", userSchema); 

module.exports = UserModel;