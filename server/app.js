const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
// const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const multer = require("multer");
const fs = require("fs");
const { connectDb } = require("./dbConnection");
require("dotenv").config();
const app = express();
const imageDownloader = require("image-downloader");
const UserModel = require("./model/User");
const PlaceModel = require("./model/Place");
const BookingModel = require("./model/Booking");
// const { uploadToCloudinary } = require("./helper/upload");
const { authMiddleware } = require("./middleware/authToken");

// Database connection
connectDb();
const bcryptSalt = bcrypt.genSaltSync(10);
// const process.env.JWT_SECRET = "dshfoiyoifdhvlkcxvnhljkd";

app.use(express.json());
app.use(cookieParser());
app.use("/uploads", express.static(__dirname + "/uploads"));
app.use(
  cors({
    credentials: true,
    origin: true,
    exposedHeaders: "token",
  })
);

app.get("/api/test", (req, res) => {
  res.json("test ok");
});

app.get("/", (req, res) => {
  res.json("test ok");
});

app.post("/api/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    console.log(name, email, password);
    if (!name || !email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }
    const userDoc = await UserModel.findOne({ email });
    if (userDoc) {
      return res
        .status(409)
        .json({ error: "User with this email already exists" });
    }
    const hashedPassword = bcrypt.hashSync(password, bcryptSalt);
    const newUser = new UserModel({
      name,
      email,
      password: hashedPassword,
    });
    await newUser.save();
    res
      .status(201)
      .json({ message: "Registration successful. Now you can log in" });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({
      error: error.message || "An error occurred during registration",
    });
  }
});

app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }
    const userDoc = await UserModel.findOne({ email });
    if (!userDoc) {
      return res.status(404).json({ message: "User not found" });
    }
    const passOk = bcrypt.compareSync(password, userDoc.password);
    if (!passOk) {
      return res.status(422).json({ message: "Incorrect password" });
    }
    const token = jwt.sign(
      { email: userDoc.email, id: userDoc._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );
    res
      .cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 24 * 60 * 60 * 1000, // 1 day
      })
      .json({
        user: { id: userDoc._id, email: userDoc.email, name: userDoc.name },
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

app.get("/api/profile", authMiddleware, async (req, res) => {
  res.json(req.user);
});

app.post("/api/logout", (req, res) => {
  res.cookie("token", "").json(true);
});

app.post("/api/upload-by-link", authMiddleware, async (req, res) => {
  const { link } = req.body;
  if (!link) {
    return res.status(422).json({ message: "Please provide a link" });
  }
  const newName = "photo" + Date.now() + ".jpg";
  await imageDownloader.image({
    url: link,
    dest: __dirname + "/uploads/" + newName,
  });

  res.json(newName);
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const photosMiddleware = multer({ storage });
app.post(
  "/api/upload",
  photosMiddleware.array("photos", 10),
  async (req, res) => {
    try {
      const uploadedFiles = [];
      for (const file of req.files) {
        const { path } = file;
        uploadedFiles.push(path.replace("uploads", ""));
      }
      res.json(uploadedFiles);
    } catch (error) {
      console.error("Error uploading files:", error);
      res.status(500).send("Error uploading files");
    }
  }
);

app.post("/api/places", authMiddleware, async (req, res) => {
  try {
    const userData = req.user;
    const {
      title,
      address,
      addedPhotos,
      description,
      price,
      perks,
      extraInfo,
      checkIn,
      checkOut,
      maxGuests,
    } = req.body;

    if (
      !title ||
      !address ||
      !addedPhotos ||
      !description ||
      !price ||
      !perks ||
      !checkIn ||
      !checkOut ||
      !maxGuests
    ) {
      return res.status(400).json({ error: "All fields are required" });
    }

    let placeDoc = await PlaceModel.create({
      price,
      title,
      address,
      photos: addedPhotos,
      description,
      perks,
      extraInfo,
      checkIn,
      checkOut,
      maxGuests,
      owner: userData.id,
    });
    res.json(placeDoc);
  } catch (error) {
    res.status(422).json(error);
  }
});

app.put("/api/places", authMiddleware, async (req, res) => {
  const { token } = req.cookies;
  const {
    id,
    title,
    address,
    addedPhotos,
    description,
    perks,
    extraInfo,
    checkIn,
    checkOut,
    maxGuests,
    price,
  } = req.body;
  const userData = req.user;
  const placeDoc = await PlaceModel.findById(id);
  if (userData.id === placeDoc.owner.toString()) {
    placeDoc.set({
      title,
      address,
      photos: addedPhotos,
      description,
      perks,
      extraInfo,
      checkIn,
      checkOut,
      maxGuests,
      price,
    });
    await placeDoc.save();
    res.json("ok");
  }
});

app.get("/api/user-places", authMiddleware, async (req, res) => {
  try {
    const userData = req.user;
    // console.log(userData);
    const places = await PlaceModel.find({ owner: userData.id });
    console.log(places);
    res.json(places);
  } catch (error) {
    res.status(422).json(error);
  }
});

app.get("/api/places/:id", async (req, res) => {
  const { id } = req.params;
  res.json(await PlaceModel.findById(id));
});

app.get("/api/places", async (req, res) => {
  res.json(await PlaceModel.find());
});

app.post("/api/bookings", authMiddleware, async (req, res) => {
  const userData = req.user;
  const { place, checkIn, checkOut, numberOfGuests, name, phone, price } =
    req.body;

  if (
    !place ||
    !checkIn ||
    !checkOut ||
    !numberOfGuests ||
    !name ||
    !phone ||
    !price
  ) {
    return res.status(400).json({ error: "All fields are required" });
  }
  try {
    const newBooking = await BookingModel.create({
      place,
      checkIn,
      checkOut,
      numberOfGuests,
      name,
      phone,
      price,
      user: userData.id,
      status: "pending", // Set initial status to pending
    });

    // Update the status to confirmed after creation
    newBooking.status = "confirmed";
    await newBooking.save();

    res.json(newBooking);
  } catch (err) {
    console.error("Error creating booking:", err);
    res
      .status(500)
      .json({ error: "An error occurred while creating the booking" });
  }
});

app.get("/api/bookings", authMiddleware, async (req, res) => {
  const userData = req.user;
  console.log(userData);
  // const userData = await getUserDataFromReq(req);
  const bookData = await BookingModel.find({ user: userData.id }).populate(
    "place"
  );
  res.json(bookData);
});

// Add this new endpoint after your existing booking-related routes
app.post("/api/bookings/:id/cancel", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const userData = req.user;

    const booking = await BookingModel.findById(id);
    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    // Check if the user owns this booking
    if (booking.user.toString() !== userData.id) {
      return res
        .status(403)
        .json({ error: "Not authorized to cancel this booking" });
    }

    // Find the booking by ID and delete it
    await BookingModel.findByIdAndDelete(id);

    res.json({ message: "Booking cancelled successfully" });
  } catch (error) {
    console.error("Error cancelling booking:", error);
    res
      .status(500)
      .json({ error: "An error occurred while cancelling the booking" });
  }
});

app.delete("/api/places/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const userData = req.user;

    const place = await PlaceModel.findById(id);
    if (!place) {
      return res.status(404).json({ error: "Place not found" });
    }

    // Check if the user owns this place
    if (place.owner.toString() !== userData.id) {
      return res
        .status(403)
        .json({ error: "Not authorized to delete this place" });
    }

    // Delete the place
    await PlaceModel.findByIdAndDelete(id);

    res.json({ message: "Place deleted successfully" });
  } catch (error) {
    console.error("Error deleting place:", error);
    res
      .status(500)
      .json({ error: "An error occurred while deleting the place" });
  }
});

const serverPort = process.env.PORT || 6000;

// Start server
app.listen(serverPort, () => {
  console.log(`Server is running on port ${serverPort}`);
});
