const router = require("express").Router();
const billRoutes = require("./v1/billRoutes");

router.use("/api", billRoutes);

module.exports = router;
