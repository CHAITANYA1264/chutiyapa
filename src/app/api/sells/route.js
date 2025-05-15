// app/api/sell/route.js
import { NextResponse } from 'next/server';
import connectionToDatabase from '@/lib/mongodb';
import Inventory from '@/models/products';
import Sale from '@/models/sales';

export async function POST(req) {
  await connectionToDatabase();

  try {
    const { productId, quantity } = await req.json();

    const product = await Inventory.findById(productId);
    if (!product) {
      return NextResponse.json({ message: 'Product not found' }, { status: 404 });
    }

    if (product.Quantity < quantity) {
      return NextResponse.json({ message: 'Insufficient stock' }, { status: 400 });
    }

    product.Quantity -= quantity;
    await product.save();

    const sale = new Sale({
      ProductName: product.ProductName,
      QuantitySold: quantity,
      PricePerUnit: product.Price,
      TotalPrice: product.Price * quantity,
    });

    await sale.save();

    return NextResponse.json({ message: 'Sale recorded successfully', sale });
  } catch (error) {
    console.error('Sell API error:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
export async function GET() {
    await connectionToDatabase();
    try {
      const sales = await Sale.find().sort({ createdAt: -1 });
      return NextResponse.json(sales);
    } catch (err) {
      console.error(err);
      return NextResponse.json({ message: 'Server error' }, { status: 500 });
    }
  }