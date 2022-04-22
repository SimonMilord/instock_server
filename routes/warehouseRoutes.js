const express = require("express");
const router = express.Router();
const fs = require("fs");
const PORT = process.env.PORT;
const { v4: uuidv4 } = require("uuid");

// GET list of all warehouses
router.get("/", (req, res) => {
  fs.readFile("./data/warehouses.json", "utf8", (err, data) => {
    if (err) {
      res.send("error getting data");
    } else {
      const warehouseData = JSON.parse(data);
      if (warehouseData) {
        res.json(warehouseData);
      } else {
        return res
          .status(404)
          .send({ message: "Could not find list of warehouses" });
      }
    }
  });
});
// GET request to get the inventory of a specific warehouse
router.get("/:id/inventory", (req, res) => {
  fs.readFile("./data/inventories.json", "utf8", (err, data) => {
    if (err) {
      res.send("error getting data");
    } else {
      const ID = "2922c286-16cd-4d43-ab98-c79f698aeab0";
      const inventory = JSON.parse(data);
      const foundInv = inventory.find(
        (inv) => inv.warehouseID === req.params.id
      );
      if (foundInv) {
        const warehouseInv = inventory
          .filter((item) => item.warehouseID === req.params.id)
          .map((inv) => {
            return {
              id: inv.id,
              warehouseID: inv.warehouseID,
              warehouseName: inv.warehouseName,
              itemName: inv.itemName,
              description: inv.description,
              category: inv.category,
              status: inv.status,
              quantity: inv.quantity,
            };
          });
        res.json(warehouseInv);
      } else {
        return res.status(404).send({ message: "warehouse has no inventory" });
      }
    }
  });
});
// POST request to add new warehouse
router.post("/add", (req, res) => {
  fs.readFile("./data/warehouses.json", "utf8", (err, data) => {
    if (err) {
      res.send("error reading data");
    } else {
      const allWarehouses = JSON.parse(data);
      const newWarehouse = {
        id: uuidv4(),
        ...req.body,
      };
      allWarehouses.unshift(newWarehouse);
      fs.writeFile(
        "./data/warehouses.json",
        JSON.stringify(allWarehouses),
        (err) => {
          if (err) {
            res.send("error writing data");
          } else {
            res.json({ message: "data written to file", data: newWarehouse });
          }
        }
      );
    }
  });
});

// GET request to get a warehouse by an ID
router.get("/:id", (req, res) => {
  fs.readFile("./data/warehouses.json", "utf8", (err, data) => {
    const warehouseData = JSON.parse(data);
    const foundWarehouse = warehouseData.find(
      (warehouse) => warehouse.id === req.params.id
    );
    if (foundWarehouse) {
      res.json(foundWarehouse);
    } else {
      return res.status(404).send({
        message: "warehouse no bueno",
      });
    }
  });
});

//DELETE warehouse by ID
router.delete("/:id/delete", (req, res) => {
  fs.readFile("./data/warehouses.json", "utf8", (err, data) => {
    const warehouseData = JSON.parse(data);
    const warehouseInQuestion = req.params.id;
    const newWarehouseData = warehouseData.filter(
      (item) => item.id !== warehouseInQuestion
    );
    fs.writeFile(
      "./data/warehouses.json",
      JSON.stringify(newWarehouseData),
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

// PATCH edit warehouse item
router.patch("/:id/edit", (req, res) => {
  fs.readFile("./data/warehouses.json", "utf8", (err, data) => {
    if (err) {
      res.send("warehouse does not exist");
    } else {
      const warehousesData = JSON.parse(data);
      const updatedWarehouses = warehousesData.filter(
        (item) => item.id !== req.params.id
      );
      const updatedItem = req.body;
      updatedWarehouses.unshift(updatedItem);
      fs.writeFile(
        "./data/warehouses.json",
        JSON.stringify(updatedWarehouses),
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
