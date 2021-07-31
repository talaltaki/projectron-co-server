const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();

const { MongoClient } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.9sjrg.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const app = express();

app.use(bodyParser.json());
app.use(cors());

const port = 8080;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
client.connect((err) => {
  const servicesCollection = client.db("projectron").collection("services");
  const feedbacksCollection = client.db("projectron").collection("feedbacks");

  app.post("/add-services", (req, res) => {
    const services = req.body;
    servicesCollection.insertMany(services).then((result) => {
      res.send(result.insertedCount);
    });
  });

  app.get("/services", (req, res) => {
    servicesCollection.find({}).toArray((err, documents) => {
      res.send(documents);
    });
  });

  app.post("/add-feedbacks", (req, res) => {
    const feedbacks = req.body;
    feedbacksCollection.insertMany(feedbacks).then((result) => {
      res.send(result.insertedCount);
    });
  });

  app.get("/feedbacks", (req, res) => {
    feedbacksCollection.find({}).toArray((err, documents) => {
      res.send(documents);
    });
  });
});

app.listen(port);
