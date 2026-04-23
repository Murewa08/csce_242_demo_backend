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

 const schema = new mongoose.Schema({
  name: String,
  country: String,
  short_desc: String,
  img_name: String
});

const Destination = mongoose.model("Destination", schema);

/*async function createMessage() {
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

app.get("/api/destinations", async (req,res)=>{
  console.log("Look at me!")
  const destinations =  await Destination.find();
  res.send(destinations);
});

app.get("/api/destinations/:id", async (req, res) => {
  const destination=await Destination.findById(req.params.id);
  res.send(destination);
});

const destinationSchema = Joi.object({
  name: Joi.string().min(2).required(),
  country: Joi.string().min(2).required(),
  short_desc: Joi.string().min(10).required()
});

app.post("/api/destinations", upload.single("image"), async (req, res) => {

  console.log("POST Hit!");

  console.log("BODY:", req.body);
  console.log("FILE:", req.file);

  const { error } = destinationSchema.validate(req.body);

  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  const destination = new Destination({
    name: req.body.name,
    country: req.body.country,
    short_desc: req.body.short_desc,
    img_name: req.file ? `images/${req.file.filename}` : ""
  });

  const newDestination = await destination.save();
//console.log(newDestination);
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

app.put("/api/destinations/:id", upload.single("image"), async (req, res) => {
  //const id = parseInt(req.params.id);
  //const destination = destinations.find((d) => d._id === id);

  if(!destination) {
    return res.status(404).send("Destination not found");
  }

  const {error} = destinationSchema.validate(req.body);

  if(error) {
    return res.status(400).send(error.details[0].message);
  }

  const fieldsToUpdate = {
    name: req.body.name,
    country: req.body.country,
    short_desc: req.body.short_desc
  };

  if(req.file) {
    fieldsToUpdate.img_name = req.file.filename;
  }

  const success = await Destination.updateOne({ _id: req.params.id }, fieldsToUpdate);

  if(!success)
  {
    res.status(404).send("Destination not found");
  }
  else {
    const destination = await Destination.findById(req.params.id);
    res.status(200).send(Destination);
  }
  res.status(200).send(destination);
});