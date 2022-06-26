import express from 'express';
import data from './data.js';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import seedRouter from './routes/seedRoutes.js';
import itemRouter from './routes/itemRoutes.js';

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
app.use('/api/seed', seedRouter);

//get two params (url going to serve, function that respond to this API)
// app.get('/api/items', (req, res) => {
//   res.send(data.items);
// });
app.use('/api/items', itemRouter);

// get the port from the process
// process.env.PORT is a convention to get free port, if not, then 5000
const port = process.env.PORT || 5000;

// server starts and ready to responding to the frontend
// first param : port | second param : callback func run when server is ready
app.listen(port, () => {
  console.log(`serve at http://localhost:${port}`);
});
