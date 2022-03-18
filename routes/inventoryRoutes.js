const express = require("express");
const router = express.Router();
const fs = require("fs");
const PORT = process.env.PORT;


router.get('', (req, res) => {
  fs.readFile('./data/inventories.json', 'utf8', (err, data) => {
      const inventoryData = JSON.parse(data);
      res.json(inventoryData);
  });
});


// get single inventory item
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

router.delete('/:id', (req, res) => {

  // res.send("delete request for inventory item");
})
module.exports = router;
