const express = require("express");
const router = express.Router();
const fs = require("fs");
const PORT = process.env.PORT;

// get single inventry item
router.get("/:id", (req, res) => {
  fs.readFile("./data/inventories.json", "utf8", (err, data) => {
    const inventoryData = JSON.parse(data);
    const foundInventory = inventoryData.find(
      (inventory) => inventory.id === req.params.id
    );
    if (foundInventory) {
      res.json(foundInventory);
    } else {
      return res.status(404).send({
        message: "Out of Stock",
      });
    }
  });
});

module.exports = router;
