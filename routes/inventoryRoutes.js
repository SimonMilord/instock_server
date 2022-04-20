const express = require("express");
const router = express.Router();
const fs = require("fs");
const PORT = process.env.PORT;
const { v4: uuidv4 } = require("uuid");

// GET all inventory items
router.get("/", (req, res) => {
  fs.readFile("./data/inventories.json", "utf8", (err, data) => {
    const inventoryData = JSON.parse(data);
    res.json(inventoryData);
  });
});

// GET single inventory item
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

// POST request to add new inventory item
router.post("/add", (req, res) => {
  fs.readFile("./data/inventories.json", "utf8", (err, data) => {
    if (err) {
      res.send("error reading data");
    } else {
      const allInventories = JSON.parse(data);
      const newInventoryItem = {
        id: uuidv4(),
        ...req.body,
      };
      allInventories.push(newInventoryItem);
      fs.writeFile(
        "./data/inventories.json",
        JSON.stringify(allInventories),
        (err) => {
          if (err) {
            res.send("error writing data");
          } else {
            res.send({
              message: "data written to file",
              data: newInventoryItem,
            });
          }
        }
      );
    }
  });
});

//DELETE inventory item by ID
router.delete("/:id/delete", (req, res) => {
  fs.readFile("./data/inventories.json", "utf8", (err, data) => {
    const inventoryData = JSON.parse(data);
    const itemInQuestion = req.params.id;
    const newInventoryData = inventoryData.filter(
      (item) => item.id !== itemInQuestion
    );
    fs.writeFile(
      "./data/inventories.json",
      JSON.stringify(newInventoryData),
      (err) => {
        if (err) {
          console.error(err);
          return;
        }
        res.send("deleted");
      }
    );
  });
});
// PATCH edit inventory item
router.patch("/:id/edit", (req, res) => {
  fs.readFile("./data/inventories.json", "utf8", (err, data) => {
    if (err) {
      res.send("inventory item does not exist");
    } else {
      const inventoryData = JSON.parse(data);
      const updatedInventory = inventoryData.filter(
        (item) => item.id !== req.params.id
      );
      const updatedItem = req.body;
      updatedInventory.push(updatedItem);
      fs.writeFile(
        "./data/inventories.json",
        JSON.stringify(updatedInventory),
        (err) => {
          if (err) {
            res.send("error updating item ");
          }
          res.send("item updated");
        }
      );
    }
  });
});
module.exports = router;
