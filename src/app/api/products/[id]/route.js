import { NextResponse } from 'next/server';
import connectionToDatabase from '@/lib/mongodb';
import Inventory from '@/models/products';

// PUT: Update a product
export async function PUT(req, { params }) {
  await connectionToDatabase();
  const { id } = params;

  try {
    const body = await req.json();

    const updatedProduct = await Inventory.findByIdAndUpdate(
      id,
      {
        ProductName: body.name,
        Quantity: body.stock,
        Price: body.price
      },
      { new: true }
    );

    if (!updatedProduct) {
      return NextResponse.json({ message: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Product updated successfully', product: updatedProduct });
  } catch (error) {
    console.error('Update Error:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}

// DELETE: Delete a product
export async function DELETE(req, { params }) {
  await connectionToDatabase();
  const { id } = params;

  try {
    const deletedProduct = await Inventory.findByIdAndDelete(id);

    if (!deletedProduct) {
      return NextResponse.json({ message: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Product deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Delete Error:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
