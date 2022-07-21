import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
//import seedRouter from './routes/seedRoutes.js';
import itemRouter from './routes/itemRoutes.js';
import userRouter from './routes/userRoutes.js';
import orderRouter from './routes/orderRoutes.js';
import uploadRouter from './routes/uploadRoutes.js';

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

//this will convert the form data in the POST request to JSON object inside record
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//api to return client ID to frontend
app.get('/api/keys/paypal', (req, res) => {
  res.send(process.env.PAYPAL_CLIENT_ID || 'sandbox');
});

app.use('/api/upload', uploadRouter);

//get two params (url going to serve, function that respond to this API)
// app.get('/api/items', (req, res) => {
//   res.send(data.items);
// });
app.use('/api/items', itemRouter);
app.use('/api/users', userRouter);
app.use('/api/orders', orderRouter);

//inside userRoutes.js expressAsyncHandler, if there is an error, this will run the error msg and return to the user
app.use((err, req, res, next) => {
  res.status(500).send({ message: err.message });
});

// get the port from the process
// process.env.PORT is a convention to get free port, if not, then 5000
const port = process.env.PORT || 5000;
// server starts and ready to responding to the frontend
// first param : port | second param : callback func run when server is ready
app.listen(port, () => {
  console.log(`serve at http://localhost:${port}`);
});
