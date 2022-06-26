import express from 'express';
import data from '../data.js';
import Item from '../models/itemModel.js';

//seedRoutes to generate sample data

const seedRouter = express.Router();

//first param is path, second is async function
seedRouter.get('/', async (req, res) => {
  //remove all prev record in Item model
  await Item.remove({});
  const newItems = await Item.insertMany(data.items);
  res.send({ newItems });
});
export default seedRouter;
