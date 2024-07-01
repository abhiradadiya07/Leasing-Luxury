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
const { log } = require("console");

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
  })
);

// async function uploadToS3(path, originalFilename, mimetype) {
//   const client = new S3Client({
//     region: 'us-east-1',
//     credentials: {
//       accessKeyId: process.env.S3_ACCESS_KEY,
//       secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
//     },
//   });
//   const parts = originalFilename.split('.');
//   const ext = parts[parts.length - 1];
//   const newFilename = Date.now() + '.' + ext;
//   await client.send(new PutObjectCommand({
//     Bucket: bucket,
//     Body: fs.readFileSync(path),
//     Key: newFilename,
//     ContentType: mimetype,
//     ACL: 'public-read',
//   }));
//   return `https://${bucket}.s3.amazonaws.com/${newFilename}`;
// }

// function getUserDataFromReq(req) {
//   return new Promise((resolve, reject) => {
//     jwt.verify(req.cookies.token, process.env.JWT_SECRET, {}, async (err, userData) => {
//       if (err) throw err;
//       resolve(userData);
//     });
//   });
// }

app.get("/api/test", (req, res) => {
  res.json("test ok");
});

app.get("/", (req, res) => {
  res.json("test ok");
});

app.post("/api/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }
    let savedUser = new UserModel({
      name,
      email,
      password: bcrypt.hashSync(password, bcryptSalt),
    }).save();
    res.json(savedUser);
  } catch (e) {
    res.status(422).json(e);
  }
});

app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;
  try {
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
    jwt.sign(
      { email: userDoc.email, id: userDoc._id },
      process.env.JWT_SECRET,
      {},
      (err, token) => {
        if (err) {
          return res.status(500).json({ message: "Error signing token" });
        }
        console.log(token, userDoc);
        // req.user = userData;
        // res.json("***********")
        // req.session.user = userData;
        res.cookie("token", token).json(userDoc);
      }
    );
  } catch (error) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

app.get("/api/profile", async (req, res) => {
  // console.log(req.user);
  // const userData = req.user;
  // console.log(userData);
  // const { name, email, _id } = await UserModel.findById(userData._id);
  // res.json({ name, email, _id });
  const { token } = req.cookies;
  console.log(token);
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, {}, async (err, userData) => {
      if (err) throw err;
      const { name, email, _id } = await UserModel.findById(userData.id);
      res.json({ name, email, _id });
    });
  } else {
    res.json(null);
  }
});

app.post("/api/logout", (req, res) => {
  res.cookie("token", "").json(true);
});

app.post("/api/upload-by-link", async (req, res) => {
  const { link } = req.body;
  if (!link) {
    return res.status(422).json({ message: "Please provide a link" });
  }
  const newName = "photo" + Date.now() + ".jpg";
  await imageDownloader.image({
    url: link,
    dest: __dirname + "/uploads/" + newName,
  });
  // const urlOfImage = await uploadToCloudinary(file.path);
  // const url = await uploadToS3(
  //   "/tmp/" + newName,
  //   newName,
  //   mime.lookup("/tmp/" + newName)
  // );
  res.json(newName);
});

// app.post('/api/upload-by-link', async (req,res) => {
//   const {link} = req.body;
//   const newName = 'photo' + Date.now() + '.jpg';
//   await imageDownloader.image({
//     url: link,
//     dest: '/tmp/' +newName,
//   });
//   const url = await uploadToS3('/tmp/' +newName, newName, mime.lookup('/tmp/' +newName));
//   res.json(url);
// });

// const photosMiddleware = multer({ dest: "/tmp" });

// Multer configuration

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
        // const { path, originalname } = file;
        // console.log(path);
        // const parts = originalname.split(".");
        // console.log(parts);
        // const ext = parts[parts.length - 1];
        // console.log(ext, "***********");
        // const newPath = path + '.' + ext;
        // console.log(newPath, "-----------");
        // fs.renameSync(path, newPath);
        uploadedFiles.push(path.replace("uploads", ""));
      }
      // for (let i = 0; i < req.files.length; i++) {
      //   const { path, originalname, mimetype } = req.files[i];
      //   const url = await uploadToCloudinary();
      //   uploadedFiles.push(url);
      // }
      // console.log(uploadedFiles);
      res.json(uploadedFiles);
    } catch (error) {
      console.error("Error uploading files:", error);
      res.status(500).send("Error uploading files");
    }
  }
);

// app.post(
//   "/api/upload",
//   photosMiddleware.array("photos", 100),
//   async (req, res) => {
//     const uploadedFiles = [];
//     for (let i = 0; i < req.files.length; i++) {
//       const { path, originalname, mimetype } = req.files[i];
//       const url = await uploadToS3(path, originalname, mimetype);
//       uploadedFiles.push(url);
//     }
//     res.json(uploadedFiles);
//   }
// );

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
    // console.log(userData.id);

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
  BookingModel.create({
    place,
    checkIn,
    checkOut,
    numberOfGuests,
    name,
    phone,
    price,
    user: userData.id,
  })
    .then((doc) => {
      res.json(doc);
    })
    .catch((err) => {
      throw err;
    });
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

const serverPort = process.env.PORT || 6000;

// Start server
app.listen(serverPort, () => {
  console.log(`Server is running on port ${serverPort}`);
});
