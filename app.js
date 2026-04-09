const express = require("express");
const cors = require("cors");
const multer = require("multer");
const app = express();
app.use(express.static("public"));
const Joi = require("joi");
app.use(express.json());
app.use(cors());

/*const mongoose = require("mongoose");

//testdb is name of database, it will automatically make it
mongoose
  .connect("mongodb+srv://I5Ic2TtVsbGXB9y8:svQGGj9ylRElkYUX@cluster0.zg2xlbp.mongodb.net/")
  .then(() => console.log("Connected to mongodb..."))
  .catch((err) => console.error("could not connect ot mongodb...", err));

const schema = new mongoose.Schema({
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

/*Extra code Ms. Portia said she would explain Week of April 5th */
/*const storage = multer.diskStorage({
  destination: (req, file, cb) => {cb(null, "./images/");},
  filename: (req, file, cb) => {cb(null, file.originalname);},
});*/

const upload = multer({storage: storage});

let destinations = [
  
  {
    "_id": 1,
    "name": "New York City",
    "country": "USA",
    "img_name": "images/new-york.jpg",
    "short_desc": "The city that never sleeps — skyline, museums, and nightlife."
  },
  {
    "_id": 2,
    "name": "Tokyo",
    "country": "Japan",
    "img_name": "images/tokyo.jpg",
    "short_desc": "Futuristic skyline, temples, and world-class food."
  },
  {
    "_id": 3,
    "name": "Bali",
    "country": "Indonesia",
    "img_name": "images/bali.jpg",
    "short_desc": "Beaches, rice terraces, and wellness retreats."
  },
  {
    "_id": 4,
    "name": "London",
    "country": "United Kingdom",
    "img_name": "images/london.jpg",
    "short_desc": "History, theatre, and parks."
  },
  {
    "_id": 5,
    "name": "Bern",
    "country": "Switzerland",
    "img_name": "images/bern.jpg",
    "short_desc": "Medieval old town and Alpine access."
  },
  {
    "_id": 6,
    "name": "Sydney",
    "country": "Australia",
    "img_name": "images/sydney.jpg",
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

app.post("api/destinations", upload.single("image"), (req, res) => {
  console.log("In post request");
});

//listen for incoming requests
app.listen(3001, ()=> {
  console.log("Server is up and running");
});