import express from 'express';
import data from './data.js';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('connected to db');
  })
  .catch((err) => {
    console.log(err.message);
  });

//creating express app that return express
const app = express();

// get two params (url going to serve, function that respond to this API)
app.get('/api/items', (req, res) => {
  res.send(data.items);
});

//backend API for returning product information based on the slug of the prod
//:slug can get slug that user enter to get data about this product from backend
app.get('/api/items/slug/:slug', (req, res) => {
  const item = data.items.find((i) => i.slug === req.params.slug);
  if (item) {
    res.send(item);
  } else {
    res.status(404).send({ message: 'Item Not Found' });
  }
});

//api to get product id
app.get('/api/items/:id', (req, res) => {
  const item = data.items.find((x) => x._id === req.params.id);
  if (item) {
    res.send(item);
  } else {
    res.status(404).send({ message: 'Item Not Found' });
  }
});

// get the port from the process
// process.env.PORT is a convention to get free port, if not, then 5000
const port = process.env.PORT || 5000;

// server starts and ready to responding to the frontend
// first param : port | second param : callback func run when server is ready
app.listen(port, () => {
  console.log(`serve at http://localhost:${port}`);
});
