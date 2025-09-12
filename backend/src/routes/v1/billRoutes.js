const router = require("express").Router();
const { createBill, getAllBills, getBill, deleteBill, updateBill, generatePdf } = require("../../controllers/bill.controller");

// Route for TEST
router.post("/test", (req, res) => {
  res.json(req.body);
});

// Route for CREATE NEW BILL
router.post("/create", createBill);

// Route for FETCH ALL BILLS
router.get("/all", getAllBills);

// Route for FETCH SINGLE BILL BY ID
router.get("/:id", getBill);

// Route for DELETE BILL BY ID
router.delete("/delete/:id", deleteBill);

// Route for UPDATE BILL BY ID
router.put("/update/:id", updateBill);

// Route for GENERATE BILL PDF BY ID
router.get("/generate-pdf/:id", generatePdf);

module.exports = router;
