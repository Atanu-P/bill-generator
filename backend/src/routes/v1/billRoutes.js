const router = require("express").Router();
const Bill = require("../../models/bill");
const ApiResponse = require("../../utils/ApiResponse");
const ApiError = require("../../utils/ApiError");

function billInputValidation(customerName, items) {
  const validationErrors = [];
  if (!customerName) {
    validationErrors.push({ message: "Customer Name is required" });
  }

  if (!items || !Array.isArray(items) || items.length === 0) {
    validationErrors.push({ message: "Item is required" });
  }

  items?.forEach((item, index) => {
    const name = item && item.name;
    const quantity = item && Number(item.quantity);
    const price = item && Number(item.price);

    if (!name || String(name).trim() === "") {
      validationErrors.push({ itemIndex: index, field: "name", message: "Item name is required" });
    }

    if (!Number.isFinite(quantity) || quantity < 1) {
      validationErrors.push({
        itemIndex: index,
        field: "quantity",
        message: "Quantity is required and must be a number >= 1",
        input: item.quantity || "empty",
      });
    }

    if (!Number.isFinite(price) || price <= 0) {
      validationErrors.push({
        itemIndex: index,
        field: "price",
        message: "Price is required and must be a number > 0",
        input: item.price || "empty",
      });
    }

    if (item && item.discount !== undefined && item.discount !== null) {
      const discount = Number(item.discount);
      if (!Number.isFinite(discount) || discount < 0 || discount > 100) {
        validationErrors.push({
          itemIndex: index,
          field: "discount",
          message: "Discount must be a number between 0 and 100",
          input: discount,
        });
      }
    }
  });

  return validationErrors;
}

function calculateBillItems(items) {
  let totalAmount = 0;
  let totalItems = 0;
  const calculatedItems = items.map((item) => {
    const name = item.name || "";
    const quantity = Number(item.quantity) || 0;
    const price = Number(item.price) || 0;
    let discount = item.discount === undefined || item.discount === null ? 0 : Number(item.discount);

    // if (discount < 0) discount = 0;
    // if (discount > 100) discount = 100;

    const sellingPrice = quantity * price * (1 - discount / 100);
    totalAmount += sellingPrice;
    totalItems += quantity;

    return { name, quantity, price, discount, sellingPrice };
  });

  return { calculatedItems, totalAmount, totalItems };
}

// Route for TEST
router.post("/test", (req, res) => {
  res.json(req.body);
});

// Route for CREATE NEW BILL
router.post("/create", async (req, res, next) => {
  try {
    const { customerName, items } = req.body;

    const inputValidationErrors = billInputValidation(customerName, items);

    if (inputValidationErrors.length > 0) {
      return res.status(400).json(new ApiResponse(400, inputValidationErrors, "Input validation failed"));
    }

    const { calculatedItems, totalAmount, totalItems } = calculateBillItems(items);

    const bill = new Bill({
      customerName,
      items: calculatedItems,
      totalAmount,
      totalItems,
    });
    const savedBill = await bill.save();

    return res.status(200).json(new ApiResponse(200, savedBill, "Bill created successfully"));
  } catch (error) {
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json(new ApiResponse(400, { errors }, "Mongoose Validation failed"));
    }

    // Unexpected error
    // return next(new ApiError(500, error.message || "Failed to create bill"));
    return next(error);
  }
});

// Route for FETCH ALL BILLS
router.get("/all", async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;
    const sort = {};

    if (req.query.sort === "default" || req.query.sort === undefined) sort.createdAt = -1;
    else if (req.query.sort === "higestamount") sort.totalAmount = -1;
    else if (req.query.sort === "lowestamount") sort.totalAmount = 1;

    const bills = await Bill.find()
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(limit);

    const totalBills = await Bill.countDocuments();

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { bills, pagination: { total: totalBills, limit, page, totalPages: Math.ceil(totalBills / limit) } },
          "Bills fetched successfully"
        )
      );
  } catch (error) {
    return next(error);
  }
});

// Route for FETCH SINGLE BILL BY ID
router.get("/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const bill = await Bill.findById(id);

    if (!bill) {
      return res.status(404).json(new ApiResponse(404, null, "Bill not found"));
    }

    return res.status(200).json(new ApiResponse(200, bill, "Bill fetched successfully"));
  } catch (error) {
    // console.error(error);

    // invalid ObjectId error
    if (error.name === "CastError") {
      return res.status(400).json(new ApiResponse(400, { input: req.params.id }, "Invalid bill ID"));
    }

    return next(error);
  }
});

module.exports = router;
