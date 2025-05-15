import { NextResponse } from "next/server";
import connectionToDatabase from "@/lib/mongodb";
import Inventory from "@/models/products";
export async function GET(request) {
  // Replace the uri string with your connection string.
  await connectionToDatabase();
  try {
     const products=await Inventory.find();
     console.log(products)
    return NextResponse.json( products,{ status: 200 })
  } catch(error){
    console.log(error)
  }
}


export async function POST(request) {
  await connectionToDatabase();

  try {
    const body = await request.json();

    // Check if a product with the same name already exists
    const existingProduct = await Inventory.findOne({
      ProductName: { $regex: new RegExp(`^${body.ProductName}$`, 'i') }, // case-insensitive match
    });

    if (existingProduct) {
      return NextResponse.json(
        { message: "Product already exists." },
        { status: 409 }
      );
    }

    const newProduct = await Inventory.create({
      ProductName: body.ProductName,
      Quantity: body.Quantity,
      Price: body.Price,
    });

    return NextResponse.json(
      { success: true, product: newProduct },
      { status: 201 }
    );
  } catch (err) {
    console.error("Error creating product:", err);
    return NextResponse.json(
      { message: "Server error while adding product." },
      { status: 500 }
    );
  }
}
