const router = require("express").Router();

router.post("/test", (req, res) => {
  res.json(req.body);
});

module.exports = router;
