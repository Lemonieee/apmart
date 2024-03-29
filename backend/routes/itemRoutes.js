import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import Item from '../models/itemModel.js';
import { isAuth, isAdmin } from '../utils.js';

const itemRouter = express.Router();

//returns all the products
itemRouter.get('/', async (req, res) => {
  const items = await Item.find();
  res.send(items);
});

//add item
itemRouter.post(
  '/',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const newItem = new Item({
      name: req.body.name,
      slug: req.body.slug,
      image: req.body.image,
      price: req.body.price,
      category: req.body.category,
      brand: req.body.brand,
      stock: req.body.stock,
      description: req.body.description,
    });
    const item = await newItem.save();
    res.send({ message: 'Item Created', item });
  })
);

itemRouter.put(
  '/:id',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const itemId = req.params.id;
    const item = await Item.findById(itemId);
    if (item) {
      item.name = req.body.name;
      item.slug = req.body.slug;
      item.price = req.body.price;
      item.image = req.body.image;
      item.category = req.body.category;
      item.brand = req.body.brand;
      item.stock = req.body.stock;
      item.description = req.body.description;
      await item.save();
      res.send({ message: 'Item Updated' });
    } else {
      res.status(404).send({ message: 'Item Not Found' });
    }
  })
);
/////////////////////////////////////////////////////////////////
itemRouter.put(
  '/:id',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const itemId = req.params.id;
    const item = await Item.findById(itemId);
    if (item) {
      item.stock = item.stock - req.body.quantity;
      await item.save();
    } else {
      res.status(404).send({ message: 'Item Not Found' });
    }
  })
);
//////////////////////////////////////////////////////////////////
itemRouter.delete(
  '/:id',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const item = await Item.findById(req.params.id);
    if (item) {
      await item.remove();
      res.send({ message: 'Item Deleted' });
    } else {
      res.status(404).send({ message: 'Item Not Found' });
    }
  })
);

const PAGE_SIZE = 9;
const ITEM_PAGE_SIZE = 8;

itemRouter.get(
  '/admin',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const { query } = req;
    const page = query.page || 1;
    const pageSize = query.pageSize || ITEM_PAGE_SIZE;

    const items = await Item.find()
      .skip(pageSize * (page - 1))
      .limit(pageSize);

    const countItems = await Item.countDocuments();

    res.send({
      items,
      countItems,
      page,
      pages: Math.ceil(countItems / pageSize),
    });
  })
);

itemRouter.get(
  '/search',
  expressAsyncHandler(async (req, res) => {
    const { query } = req;
    const pageSize = query.pageSize || PAGE_SIZE;
    const page = query.page || 1;
    const category = query.category || '';
    const price = query.price || '';
    const order = query.order || '';
    const searchQuery = query.query || '';

    const queryFilter =
      searchQuery && searchQuery !== 'all'
        ? //object passed to the fine() method on the Item model in Mongo
          {
            name: {
              $regex: searchQuery,
              //case insensitive
              $options: 'i',
            },
          }
        : {};
    const categoryFilter = category && category !== 'all' ? { category } : {};
    const priceFilter =
      price && price !== 'all'
        ? {
            // 1-50
            price: {
              $gte: Number(price.split('-')[0]),
              $lte: Number(price.split('-')[1]),
            },
          }
        : {};
    const sortOrder =
      order === 'featured'
        ? { featured: -1 }
        : order === 'lowest'
        ? //ascending by 1
          { price: 1 }
        : order === 'highest'
        ? //descending by -1
          { price: -1 }
        : order === 'newest'
        ? { createdAt: -1 }
        : { _id: -1 };

    const items = await Item.find({
      ...queryFilter,
      ...categoryFilter,
      ...priceFilter,
    })
      .sort(sortOrder)
      .skip(pageSize * (page - 1))
      .limit(pageSize);

    const countItems = await Item.countDocuments({
      ...queryFilter,
      ...categoryFilter,
      ...priceFilter,
    });
    res.send({
      items,
      countItems,
      page,
      //.ceil is get the higher figure (eg: 0.95 = 1)
      pages: Math.ceil(countItems / pageSize),
    });
  })
);

itemRouter.get(
  '/categories',
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
