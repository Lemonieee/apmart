import mongoose from 'mongoose';

//mongoose schema accepts 2 params, first: an obj as parameter and the obj defines the field of the product
//second: options
const itemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    price: { type: Number, required: true },
    image: { type: String, required: true },
    brand: { type: String, required: true },
    category: { type: String, required: true },
    stock: { type: Number, required: true },
  },
  {
    //when a item created, two fields will be added: last update time and create time
    timestamps: true,
  }
);

const Item = mongoose.model('Item', itemSchema);
export default Item;
