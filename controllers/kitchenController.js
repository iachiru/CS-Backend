const asyncHandler = require("express-async-handler");
const Kitchen = require("../model/kitchenModel");
const KitchenUser = require("../model/kitchenUserModel");
const ShortUniqueId = require("short-unique-id");
const createHttpError = require("http-errors");

const uid = new ShortUniqueId({ dictionary: "number", length: 5 });

const getOneKitchen = async (req, res, next) => {
  try {
    const user = await KitchenUser.findById(req.params.userId);
    if (!user) {
      //next(res.status(404).send(`User with id ${req.params.userId} not found`));
      next(createHttpError(404, `User with id ${req.params.userId} not found`));
    }

    const kitchen = await Kitchen.findById(req.params.kitchenId);
    if (!kitchen) {
      res.status(400).send({
        message: `Kitchen with id: ${req.params.kitchenId} not found`,
      });
    }
    res.status(200).send(kitchen);
  } catch (error) {
    next(error);
  }
};

const getKitchensByUser = async (req, res, next) => {
  try {
    const user = await KitchenUser.findById(req.params.userId);
    if (!user) {
      next(res.status(404).send(`User with id ${req.params.userId} not found`));
    }
    //find user by id and disply the kitchens they have posted
    const userId = req.params.userId;
    const kitchenByUser = await KitchenUser.findById(userId).populate({
      path: "kitchen",
      select: "images ref price description kitchenType address",
    });

    if (!kitchenByUser) {
      res.status(400).send({
        message: `User with id:${req.params.userId} has not posted any kitchen`,
      });
    }
    res.status(200).send(kitchenByUser);
  } catch (error) {
    next(error);
  }
};

//Create new post
//Route POST
//Private

/* const postNewKitchen = asyncHandler(async (req, res) => {
  const ref = uid();
  const { image, price, description, kitchenType, address } = req.body;

  if (!image || !price || !description || !kitchenType || !address) {
    res.status(400);
    throw new Error("Please complete all fields");
  }

  //check if kitchen already exists by ref

  const kitchenExists = await Kitchen.findOne({ ref });

  if (kitchenExists) {
    res.status(400); //server error 500
    throw new Error("Oops something went wrong, please try again");
    create new uid
  }

  const newKitchen = await Kitchen.create({
    image,
    ref,
    price,
    description,
    kitchenType,
    address,
  });

  console.log("this is the new k", newKitchen);

  if (newKitchen) {
    /*     res.status(201).json({
      image: newKitchen.image,
      ref: newKitchen.ref,
      price: newKitchen.price,
      description: newKitchen.description,
      kitchenType: newKitchen.kitchenType,
      address: newKitchen.address,
    }); */
/*     res.status(201).send(newKitchen);
  } else {
    res.status(400);
    throw new Error("Invalid data");
  }
}); */

const postNewKitchen = async (req, res, next) => {
  try {
    const ref = uid();

    const user = await KitchenUser.findById(req.params.userId);
    if (!user) {
      next(res.status(404).send(`User with id ${req.params.userId} not found`));
    }

    const kitchenToAdd = {
      ...req.body,
      ref: ref,
      user: req.params.userId,
    };

    const kitchenExists = await Kitchen.findOne({ ref });
    if (kitchenExists) {
      res.status(400);
      throw new Error("Oops something went wrong, please try again");
    }
    const newKitchen = await Kitchen.create(kitchenToAdd);

    const { _id } = await newKitchen.save(); //save is deprecated try change for insertOne

    const addToUser = await KitchenUser.findByIdAndUpdate(
      {
        _id: req.params.userId,
      },
      {
        $push: { kitchen: _id },
      }
    );
    console.log("kitchen created", newKitchen);
    res
      .status(201)
      .send({ createdKitchen: newKitchen, kitchenIdAdded: addToUser });
  } catch (error) {
    next(error);
  }
};
//Modify post
//Route PUT
//Private

const editKitchen = asyncHandler(async (req, res) => {
  const user = await KitchenUser.findById(req.params.userId);
  if (!user) {
    next(res.status(404).send(`User with id ${req.params.userId} not found`));
  }

  const kitchen = await Kitchen.findById(req.params.kitchenId);

  if (!kitchen) {
    res.status(400);
    throw new Error("Kitchen not found");
  }

  /*   const user = await KitchenUser.findById(req.user.id);

  if (!req.user) {
    res.status(401);
    throw new Error("Log in is necessary");
  } */

  /*   if (user.id !== req.params.userId) {
    res.status(401);
    throw new Error("User not authorized");
  } */ //review this

  const updateKitchen = await Kitchen.findByIdAndUpdate(
    req.params.kitchenId,

    req.body,
    {
      new: true,
    }
  );

  return res.status(200).json(updateKitchen);
});

//Delete posting
//Route DELETE
//Private

//make sure to $pull kitchen id from user

const deleteKitchen = asyncHandler(async (req, res) => {
  const user = await KitchenUser.findById(req.params.userId);
  if (!user) {
    next(res.status(404).send(`User with id ${req.params.userId} not found`));
  }

  const kitchenToDelete = await Kitchen.findByIdAndDelete(req.params.kitchenId);

  const deleteFromUser = await KitchenUser.findByIdAndUpdate(
    {
      _id: req.params.userId,
    },
    {
      $pull: { kitchen: req.params.kitchenId },
    }
  );

  res
    .status(204)
    .send(`Kitchen with id:${req.params.kitchenId} has been deleted`);
});

const getAllKitchens = async (req, res) => {
  try {
    const kitchens = await Kitchen.find().populate({
      path: "user",
      select: "name email host", // -_id if I don't want it to show
    });

    res.status(200).send(kitchens);
  } catch (error) {
    next(error);
  }
};

const getKitchen = async (req, res, next) => {
  try {
    const kitchen = await Kitchen.findOne({ ref: req.params.kitchenRef });
    console.log(kitchen);
    if (!kitchen || kitchen === null) {
      next(
        res
          .status(404)
          .send(
            `Kitchen with reference number: ${req.params.kitchenRef} not found`
          )
      );
    }

    res.status(200).send(kitchen);
  } catch (error) {
    next(error);
  }
};

const uploadPics = async (req, res, next) => {
  try {
    const imagePaths = req.files.map((file) => file.path);
    const images = await Kitchen.findByIdAndUpdate(
      { _id: req.params.kitchenId },
      {
        $push: { images: imagePaths },
      },
      {
        new: true,
        runValidators: true,
      }
    );

    res.send({ images });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getKitchensByUser,
  getOneKitchen,
  postNewKitchen,
  editKitchen,
  deleteKitchen,
  getKitchen,
  getAllKitchens,
  uploadPics,
};
