const mongoose = require("mongoose");
const connectDB = require("../../config/db");
const dotenv = require("dotenv").config();
mongoose.set("strictQuery", true);
const colors = require("colors");

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
