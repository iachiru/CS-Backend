const express = require("express");
const dotenv = require("dotenv").config();
const colors = require("colors");
const cors = require("cors");
const connectDB = require("./config/db");
const errorHandler = require("./middleware/errorMiddleware");
const listEndpoints = require("express-list-endpoints");
const createHttpError = require("http-errors");
const mongoose = require("mongoose");

mongoose.set("strictQuery", true);
const cloudinary = require("cloudinary").v2;
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_SECRET,
  secure: true,
});

const app = express();
const port = process.env.PORT || 4000;

const whiteList = [process.env.FE_DEV_URL, process.env.FE_PROD_URL];
const corsOptions = {
  origin: (origin, corsNext) => {
    if (!origin || whiteList.indexOf(origin) !== -1) {
      corsNext(null, true);
    } else {
      corsNext(
        corsNext(
          createHttpError(400, `origin ${origin} is not in the whiteList`)
        )
      );
    }
  },
};

connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(cors(corsOptions));

app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/users", require("./routes/kitchenRoutes"));

app.use(errorHandler);

app.listen(port, () => {
  console.table(listEndpoints(app));
  console.log(`Server running on port ${port}`);
});

app.get("/", (req, res) => res.send("Server up and running"));
