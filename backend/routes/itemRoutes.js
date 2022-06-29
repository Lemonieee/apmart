import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import Item from '../models/itemModel.js';

//itemRoutes for all item related API

const itemRouter = express.Router();

//returns all the products
itemRouter.get('/', async (req, res) => {
  const items = await Item.find();
  res.send(items);
});

itemRouter.get(
  '/category',
  expressAsyncHandler(async (req, res) => {
    //use distinct to return a unique category
    const category = await Item.find().distinct('category');
    //send back to frontend
    res.send(category);
  })
);

//findOne and findById from Mongoose
itemRouter.get('/slug/:slug', async (req, res) => {
  const item = await Item.findOne({ slug: req.params.slug });
  if (item) {
    res.send(item);
  } else {
    res.status(404).send({ message: 'Item Not Found' });
  }
});

itemRouter.get('/:id', async (req, res) => {
  const item = await Item.findById(req.params.id);
  if (item) {
    res.send(item);
  } else {
    res.status(404).send({ message: 'Item Not Found' });
  }
});

export default itemRouter;
