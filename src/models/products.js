import mongoose from "mongoose";
const productSchema=new mongoose.Schema({
    ProductName:{type: String,required:true},
    Quantity:{type:Number,required:true},
    Price:{type:Number,required:true}
});
const Inventory = mongoose.models.Inventory || mongoose.model("Inventory", productSchema, "inventory");
export default Inventory;