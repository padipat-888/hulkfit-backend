const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const UserModel = require('./models/User');
const multer  = require('multer')
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/uploads");
  },
  filename: function (req, file, cb) {
    const name = uuidv4();
    const extension = file.mimetype.split("/")[1];
    const filename = `${name}.${extension}`;
    cb(null, filename);
  },
});
const upload = multer({ storage });

const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));



const uri =
  'mongodb+srv://admin:mongodb@clusteruser.5pf96sm.mongodb.net/hulkfit?retryWrites=true&w=majority';

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

app.get('/', (req, res) => {
  UserModel.find({})
    .then((user) => res.json(user))
    .catch((err) => res.json(err));
});

app.post('/login', async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  console.log(req.body.email)
  console.log(req.body.password)

  try {
    const user = await UserModel.findOne({ email });
    
    console.log("got that user : ",user);

    if (!user) {
      return res.status(400).json({ message: 'Invalid E-mail' });
    }
    
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    console.log(`Password match is : ${isPasswordMatch}`)

    if (isPasswordMatch) {
      return res.status(200).json({ message: 'Login successful', user });
    } else {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    
  } catch (error) {
    res.status(500).json({ message: 'Error during login', error });
  }
});

app.post('/signup',upload.single('image'), async (req, res) => {
  const fullname = req.body.fullname;
  const email = req.body.email;
  const password = req.body.password;
  
  // Access the file path of the uploaded image
  const image = req.file ? req.file.path : null;

  // Create a new user document in MongoDB using Mongoose
  const newUser = new UserModel({
    fullname,
    email,
    password,
    image,
  });

  try {
    const savedUser = await newUser.save();
    res.status(200).json(savedUser);
    console.log(savedUser)
  } catch (error) {
    res.status(500).json({ message: 'Error saving user', error });
  }
});


app.put('/updateUser/:id', (req, res) => {
  const id = req.params.id;
  UserModel.findByIdAndUpdate(
    { _id: id },
    { name: req.body.name, email: req.body.email, age: req.body.age }
  )
    .then((user) => res.json(user))
    .catch((err) => res.json(err));
});

app.delete(`/deleteUser/:id`, (req, res) => {
  const id = req.params.id;
  UserModel.deleteOne({ _id: id })
    .then((user) => res.json(user))
    .catch((err) => res.json(err));
});

const port = 4000;
app.listen(port, () => {
  console.log(`Server Start in Port ${port}`);
});
