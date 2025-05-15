import mongoose from 'mongoose';

const salesSchema = new mongoose.Schema({
  ProductName: { type: String, required: true },
  QuantitySold: { type: Number, required: true },
  PricePerUnit: { type: Number, required: true },
  TotalPrice: { type: Number, required: true },
  DateSold: { type: Date, default: Date.now }
});

export default mongoose.models.Sale || mongoose.model('Sale', salesSchema, "sale");
