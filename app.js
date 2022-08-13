const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");
require("dotenv/config");

const app = express();

const api = process.env.API_URL;
app.use(morgan("tiny"));

const ProductSchema = mongoose.Schema({
  name: String,
  length: { type: Number, required: true },
});
const Product = mongoose.model("Product", ProductSchema);

app.get(`${api}/products`, async (req, res) => {
  const productList = await Product.find();
  if(!productList) {
    res.status(500).json({success: false})
  }
  res.send(productList);
});

app.use(express.json());

app.post(`${api}/products`, (req, res) => {
  const newProduct = new Product({
    name: req.body.name,
    length: req.body.length,
  });
  newProduct
    .save()
    .then((createdProduct) => {
      res.status(201).json(createdProduct);
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
        success: false,
      });
    });
  res.send(newProduct);
});
mongoose
  .connect(process.env.CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: "pldr-db",
  })
  .then(() => {
    console.log("connected to database pldr-db");
  })
  .catch((err) => {
    console.log(err);
  });
app.listen(3000, () => {
  //console.log(api)
  //console.log('localhost i s running on 3000')
});
