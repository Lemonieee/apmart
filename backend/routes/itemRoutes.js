import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import Item from '../models/itemModel.js';
import { isAuth, isAdmin } from '../utils.js';

//itemRoutes for all item related API

const itemRouter = express.Router();

//returns all the products
itemRouter.get('/', async (req, res) => {
  const items = await Item.find();
  res.send(items);
});

itemRouter.post(
  '/',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const newItem = new Item({
      name: 'sample name ' + Date.now(),
      slug: 'sample-name-' + Date.now(),
      image: '/images/p1.jpg',
      price: 0,
      category: 'sample category',
      brand: 'sample brand',
      stock: 0,
      rating: 0,
      reviewNum: 0,
      description: 'sample description',
    });
    const item = await newItem.save();
    res.send({ message: 'Item Created', item });
  })
);

const PAGE_SIZE = 3;

itemRouter.get(
  '/admin',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const { query } = req;
    const page = query.page || 1;
    const pageSize = query.pageSize || PAGE_SIZE;

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
    const rating = query.rating || '';
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
    const ratingFilter =
      rating && rating !== 'all'
        ? {
            rating: {
              $gte: Number(rating),
            },
          }
        : {};
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
        : order === 'toprated'
        ? { rating: -1 }
        : order === 'newest'
        ? { createdAt: -1 }
        : { _id: -1 };

    const items = await Item.find({
      ...queryFilter,
      ...categoryFilter,
      ...priceFilter,
      ...ratingFilter,
    })
      .sort(sortOrder)
      .skip(pageSize * (page - 1))
      .limit(pageSize);

    const countItems = await Item.countDocuments({
      ...queryFilter,
      ...categoryFilter,
      ...priceFilter,
      ...ratingFilter,
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
