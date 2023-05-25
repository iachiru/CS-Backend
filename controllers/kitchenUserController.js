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
    console.log("checking method querying DB", userExists);
    if (userExists) {
      res.status(400).send({ error: "Email already in use" });
    }

    const newUser = {
      ...req.body,
      password: hashedPassword,
    };

    const createUser = await KitchenUser.create(newUser);
    const newToken = generateToken(newUser._id);
    const { token } = await createUser.save(newToken);

    res.status(201).send({
      name: createUser.name,
      email: createUser.email,
      token: newToken,
      image: createUser.image,
      address: createUser.address,
      companyName: createUser.companyName,
      companyAddress: createUser.companyAddress,
      companyType: createUser.companyType,
      hostType: createUser.hostType,
    });
  } catch (error) {
    next(error);
  }
};

const logIn = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await KitchenUser.findOne({ email });

  if (!user) {
    res.status(404);
    throw new Error("Email is incorrect, please try again");
  }

  const passwordCompare = await bcrypt.compare(password, user.password);

  if (!passwordCompare) {
    res.status(400);
    throw new Error("Password is incorrect, please try again");
  }

  if (user && passwordCompare) {
    res.status(200).json({
      _id: user.id,
      name: user.name,
      email: user.email,
      image: user.image,
      address: user.address,
      companyName: user.companyName,
      companyAddress: user.companyAddress,
      companyType: user.companyType,
      token: generateToken(user._id),
      kitchen: user.kitchen,
      hostType: user.hostType,
    });
  } else {
    res.status(400);
    throw new Error("Invalid credentials, please try again");
  }
});

const editUser = async (req, res, next) => {
  try {
    console.log("called on BE");
    const user = await KitchenUser.findById(req.params.userId);

    if (!user) {
      next(res.status(404).send(`User with id ${req.params.userId} not found`));
    }

    Object.keys(req.body).forEach((key) => {
      if (key !== "password") {
        user[key] = req.body[key];
      }
    });

    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(req.body.password, salt);
      console.log("hashed pass", hashedPassword);
      if (hashedPassword !== user.password) {
        user.password = hashedPassword;
      }
    }
    const updateUser = await user.save();

    return res.status(200).json(updateUser);
  } catch (error) {
    next(error);
  }
};

const getMe = asyncHandler(async (req, res) => {
  const {
    name,
    email,
    image,
    address,
    companyName,
    companyAddress,
    companyType,
    kitchen,
    host,
    hostType,
  } = await KitchenUser.findById(req.user.id);

  return res.status(200).json({
    name,
    email,
    image,
    address,
    companyName,
    companyAddress,
    companyType,
    kitchen,
    host,
    hostType,
  });
});

const getAllUsers = async (req, res, next) => {
  try {
    const users = await KitchenUser.find();

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

const deleteUser = async (req, res, next) => {
  try {
    const user = await KitchenUser.findById(req.params.userId);
    if (!user) {
      next(res.status(404).send(`User with id ${req.params.userId} not found`));
    }

    const userToDelete = await KitchenUser.findByIdAndDelete(req.params.userId);

    res.status(204).send("User has been deleted");
  } catch (error) {
    next(error);
  }
};

const uploadUserPics = async (req, res, next) => {
  try {
    const avatar = await KitchenUser.findByIdAndUpdate(
      req.params.userId,
      {
        ...req.body,
        image: req.file.path,
      },
      {
        new: true,
        runValidators: true,
      }
    );
    console.log("this is the avatar", avatar);
    res.send({ avatar });
  } catch (error) {
    next(error);
  }
};

/* const testPic = async (res, req, next) => {
  console.log("endpoint reached", req.file.path);
}; */

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

module.exports = {
  signUp,
  logIn,
  getMe,
  editUser,
  getAllUsers,
  deleteUser,
  uploadUserPics,
};
