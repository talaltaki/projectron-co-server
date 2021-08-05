const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();
const ObjectId = require("mongodb").ObjectId;

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
  const ordersCollection = client.db("projectron").collection("orders");
  const adminsCollection = client.db("projectron").collection("admins");

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

  app.post("/place-order", (req, res) => {
    const order = req.body;
    ordersCollection.insertOne(order).then((result) => {
      res.send(result);
    });
  });

  app.get("/orders", (req, res) => {
    ordersCollection
      .find({ email: req.query.email })
      .toArray((err, documents) => {
        res.send(documents);
      });
  });

  app.post("/add-feedback", (req, res) => {
    const feedback = req.body;
    feedbacksCollection.insertOne(feedback).then((result) => {
      res.send(result);
    });
  });

  app.get("/all-orders", (req, res) => {
    ordersCollection.find({}).toArray((err, documents) => {
      res.send(documents);
    });
  });

  app.post("/admin", (req, res) => {
    const email = req.body.email;
    adminsCollection.find({ email: email }).toArray((err, documents) => {
      res.send(documents.length > 0);
    });
  });

  app.patch("/update-status", (req, res) => {
    ordersCollection
      .updateOne(
        { _id: ObjectId(req.body.id) },
        {
          $set: { status: req.body.status },
        }
      )
      .then((result) => {
        res.send(result.modifiedCount > 0);
      });
  });
});

app.listen(port);
