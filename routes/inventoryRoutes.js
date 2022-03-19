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


//DELETE inventory item by ID
router.delete('/:id/delete', (req, res) => {
  fs.readFile("./data/inventories.json", "utf8", (err, data) => {
  const inventoryData = JSON.parse(data);
  const itemInQuestion = req.params.id
  const newInventoryData = inventoryData.filter(item =>  item.id !== itemInQuestion)
  fs.writeFile("./data/inventories.json", JSON.stringify(newInventoryData), (err) => {
    if (err) {
      console.error(err)
      return
    }
    res.send("deleted")})

  })
})

router.patch('/:id/edit', (req, res) =>{
  fs.readFile("./data/inventories.json", "utf8", (err, data) => {
    if(err) {
      res.send("inventory item does not exist")
    } else {
      const inventoryData = JSON.parse(data);
      const updatedInventory = inventoryData.filter(item =>  item.id !== req.params.id);
      const updatedItem = req.body;
      updatedInventory.push(updatedItem);
      fs.writeFile("./data/inventories.json", JSON.stringify(updatedInventory), (err) => {
        if (err) {
          res.send("error updating item ")
        } 
        res.send("item updated")
      })
    }
  })
})
module.exports = router;
