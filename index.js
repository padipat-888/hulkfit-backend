const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const UserModel = require('./models/User');
const multer  = require('multer')
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');
const ActivityModel = require('./models/Activity');


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

app.get('/:id', (req, res) => {
  const _id = req.params.id
  UserModel.find({_id:_id})
    .then((user) => res.json(user))
    .catch((err) => res.json(err));
});

app.get('/activitylist/', (req, res) => {
  ActivityModel.find({})
    .then((user) => res.json(user))
    .catch((err) => res.json(err));
});

app.get('/activitylist/:id', (req, res) => {
  const userId = req.params.id
  ActivityModel.find({userId:userId})
    .then((user) => res.json(user))
    .catch((err) => res.json(err));
});

app.delete('/activitylist/delete/:id', (req, res) => {
  const actId = req.params.id
  console.log(actId)
  ActivityModel.findByIdAndDelete(actId)
    .then((user) => res.json(user))
    .catch((err) => res.json(err));
});

app.post('/login', async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  console.log(`
  User Login !
  Email:${req.body.email}
  Pass:${req.body.password}
  `)

  try {
    const user = await UserModel.findOne({ email });

    if (!user) {
      console.log(`Email Not Found : ${email}`);
      res.status(400).json({ message: 'Invalid E-mail' });
      return 
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
  console.log('User SignUp!!')
  
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


app.post('/addactivity',async (req, res) => {
  console.log('User Add Activity!!')
  //////////////////
  const userId = req.body.userId
  const actName = req.body.actName;
  const actDescription = req.body.actDescription;
  const actType = req.body.actType;
  const actDuration = req.body.actDuration;
  const actDate = req.body.actDate;
  console.log(userId)
  console.log(actName)
  console.log(actDescription)
  console.log(actType)
  console.log(actDuration)
  console.log(actDate)
  const newAct = new ActivityModel({
    userId,
    actName,
    actDescription,
    actType,
    actDuration,
    actDate
  })

  try {
    const savedUser = await newAct.save();
    res.status(200).json(savedUser);
    console.log(savedUser)
  } catch (error) {
    res.status(500).json({ message: 'Error saving user', error });
  }
});


const port = 4000;
app.listen(port, () => {
  console.log(`Server Start in Port ${port}`);
});
