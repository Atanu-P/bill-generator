const router = require("express").Router();
const billRoutes = require("./v1/billRoutes");

router.use("/api/v1", billRoutes);

module.exports = router;
