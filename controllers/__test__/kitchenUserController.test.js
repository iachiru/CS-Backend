const mongoose = require("mongoose");
const connectDB = require("../../config/db");
const dotenv = require("dotenv").config();
mongoose.set("strictQuery", true);
const colors = require("colors");

/* const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { signUp } = require("../../controllers/kitchenUserController"); // import the signUp function
const KitchenUser = require("../../model/kitchenUserModel"); // import the KitchenUser model

describe("connectDB function", () => {
  beforeAll(async () => {
    const connection = await connectDB();
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  it("should connect to the MongoDB database", async () => {
    await expect(connectDB()).resolves.not.toThrow();
  });
});

jest.mock("../../model/kitchenUserModel"); // mock the KitchenUser model

describe("signUp function", () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      body: {
        email: "test@example.com",
        password: "password123",
      },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };
    next = jest.fn();

    // Mock genSalt and hash functions
    jest.spyOn(bcrypt, "genSalt").mockResolvedValue(salt);
    jest.spyOn(bcrypt, "hash").mockResolvedValue("hashedPassword");
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("should create a new user and return a token", async () => {
    // set up mock implementation for KitchenUser.findOne
    KitchenUser.findOne.mockResolvedValue(null);

    // set up mock implementation for KitchenUser.create
    const newUser = {
      _id: "user123",
      ...req.body,
      password: "hashedPassword",
    };
    const newToken = "token123";
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    const createUser = {
      ...newUser,
      password: hashedPassword,
      save: jest.fn().mockResolvedValue({ token: newToken }),
    };
    KitchenUser.create.mockResolvedValue(createUser);

    // call the signUp function
    await signUp(req, res, next);

    // assert that KitchenUser.findOne was called with the correct arguments
    expect(KitchenUser.findOne).toHaveBeenCalledWith({ email: req.body.email });

    // assert that bcrypt.genSalt and bcrypt.hash were called with the correct arguments
    expect(bcrypt.genSalt).toHaveBeenCalledWith(10);
    expect(bcrypt.hash).toHaveBeenCalledWith(req.body.password, salt);

    // assert that KitchenUser.create was called with the correct arguments
    expect(KitchenUser.create).toHaveBeenCalledWith(newUser);

    // assert that createUser.save was called with the correct argument
    expect(createUser.save).toHaveBeenCalledWith(newToken);

    // assert that res.send was called with the correct data
    expect(res.send).toHaveBeenCalledWith({
      name: createUser.name,
      email: createUser.email,
      token: newToken,
    });

    // assert that next was not called
    expect(next).not.toHaveBeenCalled();
  });

  it("should return an error if the email is already in use", async () => {
    // set up mock implementation for KitchenUser.findOne
    const userExists = {
      _id: "user123",
      email: req.body.email,
    };
    KitchenUser.findOne.mockResolvedValue(userExists);

    // call the signUp function
    await signUp(req, res, next);

    // assert that KitchenUser.findOne was called with the correct arguments
    expect(KitchenUser.findOne).toHaveBeenCalledWith({ email: req.body.email });

    // assert that res.status and res.send were called with the correct data
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.send).toHaveBeenCalledWith({
      message: "Email already in use",
    });

    // assert that next was not called
    expect(next).not.toHaveBeenCalled();
  });

  it("should call next with an error if an error occurs", async () => {
    // set up mock implementation for KitchenUser.findOne to throw an error
    const error = new Error("Database error");
    KitchenUser.findOne.mockRejectedValue(error);

    // call the signUp function
    await signUp(req, res, next);

    // assert that KitchenUser.findOne was called with the correct arguments
    expect(KitchenUser.findOne).toHaveBeenCalledWith({ email: req.body.email });
  });
}); */

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { signUp } = require("../../controllers/kitchenUserController"); // import the signUp function
const KitchenUser = require("../../model/kitchenUserModel"); // import the KitchenUser model

describe("connectDB function", () => {
  beforeAll(async () => {
    const connection = await connectDB();
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  it("should connect to the MongoDB database", async () => {
    await expect(connectDB()).resolves.not.toThrow();
  });
});

jest.mock("../../model/kitchenUserModel"); // mock the KitchenUser model
jest.mock("bcryptjs");

describe("signUp function", () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      body: {
        email: "test@example.com",
        password: "password123",
      },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };
    next = jest.fn();
    // mock bcrypt.genSalt and bcrypt.hash
    bcrypt.genSalt = jest.fn().mockResolvedValue("salt123");
    bcrypt.hash = jest.fn().mockResolvedValue("hashedPassword");
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("should create a new user and return a token", async () => {
    // set up mock implementation for KitchenUser.findOne
    KitchenUser.findOne.mockResolvedValue(null);

    // set up mock implementation for KitchenUser.create
    const newUser = {
      _id: "user123",
      ...req.body,
      password: "hashedPassword",
    };
    const newToken = "token123";
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    const createUser = {
      ...newUser,
      password: hashedPassword,
      save: jest.fn().mockResolvedValue({ token: newToken }),
    };
    KitchenUser.create.mockResolvedValue(createUser);

    // call the signUp function
    await signUp(req, res, next);

    // assert that KitchenUser.findOne was called with the correct arguments
    expect(KitchenUser.findOne).toHaveBeenCalledWith({ email: req.body.email });

    // assert that bcrypt.genSalt and bcrypt.hash were called with the correct arguments
    expect(bcrypt.genSalt).toHaveBeenCalledWith(10);
    console.log("salt check", bcrypt.hash.mock.calls[0][0], salt);
    expect(bcrypt.hash).toHaveBeenCalledWith(req.body.password, salt);

    // assert that KitchenUser.create was called with the correct arguments
    expect(KitchenUser.create).toHaveBeenCalledWith(newUser);

    // assert that createUser.save was called with the correct argument
    expect(createUser.save).toHaveBeenCalledWith(newToken);

    // assert that res.send was called with the correct data
    expect(res.send).toHaveBeenCalledWith({
      name: createUser.name,
      email: createUser.email,
      token: newToken,
    });

    // assert that next was not called
    expect(next).not.toHaveBeenCalled();
  });

  it("should return an error if the email is already in use", async () => {
    // set up mock implementation for KitchenUser.findOne
    const userExists = {
      _id: "user123",
      email: req.body.email,
    };
    KitchenUser.findOne.mockResolvedValue(userExists);

    // call the signUp function
    await signUp(req, res, next);

    // assert that KitchenUser.findOne was called with the correct arguments
    expect(KitchenUser.findOne).toHaveBeenCalledWith({ email: req.body.email });

    // assert that res.status and res.send were called with the correct data
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.send).toHaveBeenCalledWith({
      message: "Email already in use",
    });

    // assert that next was not called
    expect(next).not.toHaveBeenCalled();
  });

  it("should call next with an error if an error occurs", async () => {
    // set up mock implementation for KitchenUser.findOne to throw an error
    const error = new Error("Database error");
    KitchenUser.findOne.mockRejectedValue(error);

    // call the signUp function
    await signUp(req, res, next);

    // assert that KitchenUser.findOne was called with the correct arguments
    expect(KitchenUser.findOne).toHaveBeenCalledWith({ email: req.body.email });
  });
});
