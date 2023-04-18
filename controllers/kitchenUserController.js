const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const KitchenUser = require("../model/kitchenUserModel");

//Create new user
//Route POST/
//Access public

/* const signUp = asyncHandler(async (req, res) => {
  const { name, password, email, host } = req.body;

  if (!name || !password || !email) {
    res.status(400);
    throw new Error("Please complete all fields");
  }

  //Check if the user exists by email

  const userExists = await KitchenUser.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error("Email already in use!");
  }

  // Hash password

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await KitchenUser.create({
    name,
    email,
    password: hashedPassword,
    host,
  });

  if (user) {
    res.status(201).json({
      _id: user.id,
      name: user.name,
      email: user.email,
      host: user.host,
      token: generateToken(user._id), Possibly only need to generate token here if i want to redirect to profile page
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
  res.json({ message: "User registered" });
}); */

// User is being created even if there is an error.
const signUp = async (req, res, next) => {
  try {
    const { email } = req.body;

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    const userExists = await KitchenUser.findOne({ email });
    if (userExists) {
      res.status(400);
      throw new Error("Email already in use");
    }

    const newUser = {
      ...req.body,
      password: hashedPassword,
    };

    const createUser = await KitchenUser.create(newUser);
    const newToken = generateToken(newUser._id);
    const { token } = await createUser.save(newToken);

    console.log(createUser);
    console.log(token);
    res.status(201).send({
      name: createUser.name,
      email: createUser.email,
      token: createUser.token,
    });
  } catch (error) {
    next(error);
  }
};

const logIn = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await KitchenUser.findOne({ email });
  const passwordCompare = await bcrypt.compare(password, user.password);

  if (user && passwordCompare) {
    res.status(200).json({
      _id: user.id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("Invalid credentials, please try again");
  }
});

const getMe = asyncHandler(async (req, res) => {
  const { name, email } = await KitchenUser.findById(req.user.id);
  return res.status(200).json({ name, email });
});

const getAllUsers = async (req, res, next) => {
  try {
    const users = await KitchenUser.find();
    console.log("These are the users", users);
    if (!users) {
      res
        .status(400)
        .send({ message: "We've not been able to find any users" });
    }

    res.status(200).send(users);
  } catch (error) {
    next(error);
  }
};

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

module.exports = { signUp, logIn, getMe, getAllUsers };
