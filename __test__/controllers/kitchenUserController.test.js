const mongoose = require("mongoose");
const connectDB = require("../../config/db");
const dotenv = require("dotenv").config();
mongoose.set("strictQuery", true);
const colors = require("colors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { signUp } = require("../../controllers/kitchenUserController"); // import the signUp function
const KitchenUser = require("../../model/kitchenUserModel"); // import the KitchenUser model

describe("signUp", () => {
  let req;
  let res;
  let next;

  beforeEach(() => {
    req = {
      body: {
        name: "John",
        email: "john@example.com",
        password: "secret",
      },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis(),
    };
    next = jest.fn();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should create a new user with a hashed password and a token", async () => {
    const user = null; // Change this to a KitchenUser object if you want to simulate an existing user
    const genSaltMock = jest.spyOn(bcrypt, "genSalt").mockResolvedValue("salt");
    const hashMock = jest
      .spyOn(bcrypt, "hash")
      .mockResolvedValue("hashedPassword");
    const findOneMock = jest
      .spyOn(KitchenUser, "findOne")
      .mockResolvedValue(user);
    const createMock = jest.spyOn(KitchenUser, "create").mockResolvedValue({
      _id: "user_id",
      name: "John",
      email: "john@example.com",
      password: "hashedPassword",
      token: "user_token",
      save: jest.fn().mockResolvedValue({ token: "user_token" }),
    });

    await signUp(req, res, next);

    expect(genSaltMock).toHaveBeenCalledWith(10);
    expect(hashMock).toHaveBeenCalledWith("secret", "salt");
    expect(findOneMock).toHaveBeenCalledWith({ email: "john@example.com" });
    expect(createMock).toHaveBeenCalledWith({
      name: "John",
      email: "john@example.com",
      password: "hashedPassword",
    });
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.send).toHaveBeenCalledWith({
      name: "John",
      email: "john@example.com",
      token: "user_token",
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("should return a 400 error if the email is already in use", async () => {
    const user = {
      _id: "existing_user_id",
      name: "John",
      email: "john@example.com",
    };

    const genSaltMock = jest.spyOn(bcrypt, "genSalt").mockResolvedValue("salt");
    const findOneMock = jest
      .spyOn(KitchenUser, "findOne")
      .mockResolvedValue(user);
    console.log("Find one value", findOneMock);
    console.log("findOneMock before signUp", findOneMock);
    await signUp(req, res, next);

    expect(genSaltMock).toHaveBeenCalledWith(10);
    expect(findOneMock).toHaveBeenCalledWith({ email: "john@example.com" });
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.send).toHaveBeenCalledWith({ error: "Email already in use" });
    expect(next).not.toHaveBeenCalled();
  });

  it("should call next with an error if an error occurs", async () => {
    const error = new Error("Database error");
    const genSaltMock = jest.spyOn(bcrypt, "genSalt").mockRejectedValue(error);

    await signUp(req, res, next);

    expect(genSaltMock).toHaveBeenCalledWith(10);
    expect(next).toHaveBeenCalledWith(error);
  });
});
