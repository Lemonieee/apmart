import express from 'express';
import data from './data.js';

//creating express app that return express
const app = express();

// get two params (url going to serve, function that respond to this API)
app.get('/api/products', (req, res) => {
  res.send(data.products);
});

// get the port from the process
// process.env.PORT is a convention to get free port, if not, then 5000
const port = process.env.PORT || 5000;

// server starts and ready to responding to the frontend
// first param : port | second param : callback func run when server is ready
app.listen(port, () => {
  console.log(`serve at http://localhost:${port}`);
});
