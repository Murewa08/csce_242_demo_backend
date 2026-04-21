require ("dotenv").config();
const express = require("express");
const cors = require("cors");
const multer = require("multer");
const app = express();
app.use(express.static("public"));
app.use("/images", express.static("public/images"));
const Joi = require("joi");
app.use(express.json());
app.use(cors());
const mongoose  = require("mongoose");

//testdb is name of database, it will automatically make it
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to mongodb..."))
  .catch((err) => console.error("could not connect ot mongodb...", err));

/* const schema = new mongoose.Schema({
  name: String,
});

async function createMessage() {
  const result = await message.save();
  console.log(result);
}

//this creates a Message class in our app
const Message = mongoose.model("Message", schema);
const message = new Message({
  name: "Hello World",
});

createMessage();*/




const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/images/");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});


const upload = multer({storage: storage});

let destinations = [
  
  {
    "_id": 1,
    "name": "New York City",
    "country": "USA",
    "img_name": "images/NewYorkImage.png",
    "short_desc": "The city that never sleeps — skyline, museums, and nightlife."
  },
  {
    "_id": 2,
    "name": "Tokyo",
    "country": "Japan",
    "img_name": "images/TokyoImage.png",
    "short_desc": "Futuristic skyline, temples, and world-class food."
  },
  {
    "_id": 3,
    "name": "Bali",
    "country": "Indonesia",
    "img_name": "images/BaliImage.png",
    "short_desc": "Beaches, rice terraces, and wellness retreats."
  },
  {
    "_id": 4,
    "name": "London",
    "country": "United Kingdom",
    "img_name": "images/EnglandImage.webp",
    "short_desc": "History, theatre, and parks."
  },
  {
    "_id": 5,
    "name": "Bern",
    "country": "Switzerland",
    "img_name": "images/SwitzerlandImage.webp",
    "short_desc": "Medieval old town and Alpine access."
  },
  {
    "_id": 6,
    "name": "Sydney",
    "country": "Australia",
    "img_name": "images/AustraliaImage.jpg",
    "short_desc": "Harbour city with beaches and great food."
  }

];

app.get("/api/destinations", (req,res)=>{
  res.send(destinations);
});

app.get("/api/destinations/:id", (req, res) => {
  const destination=destinations.find((d)=>d._id===parseInt(req.params.id));
  res.send(destination);
});

const destinationSchema = Joi.object({
  name: Joi.string().min(2).required(),
  country: Joi.string().min(2).required(),
  short_desc: Joi.string().min(10).required()
});

app.post("/api/destinations", upload.single("image"), (req, res) => {

  console.log("POST Hit!");

  console.log("BODY:", req.body);
  console.log("FILE:", req.file);

  const { error } = destinationSchema.validate(req.body);

  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  const newDestination = {
    _id: destinations.length + 1,
    name: req.body.name,
    country: req.body.country,
    short_desc: req.body.short_desc,
    img_name: req.file ? `images/${req.file.filename}` : ""
  };

  destinations.push(newDestination);
  res.status(200).send(newDestination);
});

//listen for incoming requests
app.listen(3001, ()=> {
  console.log("Server is up and running");
});

app.delete("/api/destinations/:id", (req, res) =>  {
  const id = parseInt(req.params.id);
  const index = destinations.findIndex((d) => d._id === id);

  if(index === -1) {
    return res.status(404).send("Destination not found");
  }

  const deletedDestination = destinations.splice(index, 1)[0];
  res.status(200).send(deletedDestination);
});

app.put("/api/destinations/:id", upload.single("image"), (req, res) => {
  const id = parseInt(req.params.id);
  const destination = destinations.find((d) => d._id === id);

  if(!destination) {
    return res.status(404).send("Destination not found");
  }

  const {error} = destinationSchema.validate(req.body);

  if(error) {
    return res.status(400).send(error.details[0].message);
  }

  destination.name = req.body.name;
  destination.country = req.body.country;
  destination.short_desc = req.body.short_desc;

  if(req.file) {
    destination.img_name = `images/${req.file.filename}`;
  }

  res.status(200).send(destination);
});