const mongoose = require("mongoose");

const billSchema = new mongoose.Schema(
  {
    customerName: {
      type: String,
      required: [true, "Customer Name is required"],
      trim: true,
      uppercase: true,
    },
    items: [
      {
        name: {
          type: String,
          required: [true, "Item Name is required"],
          trim: true,
          uppercase: true,
        },
        quantity: {
          type: Number,
          required: [true, "Quantity is required"],
          min: [1, "Quantity must be at least 1"],
        },
        price: {
          type: Number,
          required: [true, "Item Price is required"],
          min: [0, "Price must be positive"],
        },
        discount: {
          type: Number,
          default: 0,
          min: [0, "Discount must be positive"],
          max: [100, "Discount cannot exceed 100%"],
        },
        sellingPrice: {
          type: Number,
          required: [true, "Selling Price is required"],
          min: [0, "Selling Price must be positive"],
        },
      },
    ],
    totalAmount: { type: Number, required: [true, "Total Amount is required"] },
  },
  {
    timestamps: true,
  }
);

const Bill = mongoose.model("bill", billSchema);

module.exports = Bill;
