import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
  {
    orderItems: [
      {
        name: { type: String, required: true },
        quantity: { type: Number, required: true },
        image: { type: String, required: true },
        price: { type: Number, required: true },
        item: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Item',
          required: true,
        },
        slug: { type: String, required: true },
      },
    ],
    buyerDetails: {
      fullName: { type: String, required: true },
      buyerId: { type: String, required: true },
    },
    paymentOption: { type: String, required: true },
    paymentResult: {
      id: String,
      status: String,
      update_time: String,
    },
    total: { type: Number, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    isPaid: { type: Boolean, default: false },
    paymentDate: { type: Date },
    isPrepared: { type: Boolean, default: false },
    preparedDate: { type: Date },
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model('Order', orderSchema);
export default Order;
