const MongoClient = require('mongodb').MongoClient;
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
const fileUpload = require('express-fileupload');
const ObjectId = require('mongodb').ObjectId;
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static('images'));
app.use(fileUpload());
require("dotenv").config()

const uri = `mongodb+srv://sakibsheikh:${process.env.DB_PASS}@cluster0.6d4vl.mongodb.net/creative-agency?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
app.get('/', (req, res) => {
  res.send('Hello World!')
})
client.connect(err => {
  const collection = client.db("creative-agency").collection("orders");
    app.get('/order', (req, res) => {
    collection.find({})
      .toArray((err, data) => {
        res.send(data)
      })
    })
    app.post('/addOrder', (req, res) => {
    const info = req.body;
    collection.insertOne(info)
    .then(result => {
      res.send('data added successfully')
    })
    })
    app.delete('/delete/:id', (req, res) => {
    collection.deleteOne({ _id: ObjectId(req.params.id) })
      .then(result => {
        res.send('data deleted successfully')
    })
    })
  
  const reviewCollection = client.db("creative-agency").collection("reviews");
      app.get('/reviews', (req, res) => {
    reviewCollection.find({})
      .toArray((err, data) => {
        res.send(data)
      })
    })
    app.post('/addReview', (req, res) => {
    const info = req.body;
    reviewCollection.insertOne(info)
    .then(result => {
      res.send('data added successfully')
    })
    })
      
  const adminCollection = client.db("creative-agency").collection("admins");
      app.get('/admins', (req, res) => {
    adminCollection.find({})
      .toArray((err, data) => {
        res.send(data)
      })
    })
    app.post('/addAdmin', (req, res) => {
    const info = req.body;
    adminCollection.insertOne(info)
    .then(result => {
      res.send('data added successfully')
    })
    })
  
  const serviceCollection = client.db("creative-agency").collection("services");
  app.post('/addServices', (req, res) => {
        const file = req.files.file;
        const name = req.body.name;
        const description = req.body.description;
        const newImg = file.data;
        const encImg = newImg.toString('base64');

        var image = {
            contentType: file.mimetype,
            size: file.size,
            img: Buffer.from(encImg, 'base64')
        };

        serviceCollection.insertOne({ name, description, image })
            .then(result => {
                res.send(result.insertedCount > 0);
            })
    })
    app.get('/services', (req, res) => {
    serviceCollection.find({})
      .toArray((err, data) => {
        res.send(data)
      })
    })
});

app.listen(process.env.PORT || 4600, () => {
  console.log('port 4600 activated')
})