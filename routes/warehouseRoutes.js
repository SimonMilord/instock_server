const express = require("express");
const router = express.Router();
const fs = require("fs");
const PORT = process.env.PORT;
const { v4: uuidv4 } = require('uuid');

// GET list of all warehouses
router.get("/", (req, res) => {
  fs.readFile('./data/warehouses.json', 'utf8', (err, data) => {
    if (err) {
      res.send('error getting data');
    } else {
      const warehouseData = JSON.parse(data);
      if (warehouseData) {
        res.json(warehouseData);
      } else {
        return res.status(404).send({message: 'Could not find list of warehouses'});
      }
    }
  })
})

router.get("/:id/inventory", (req, res) => {
    fs.readFile('./data/inventories.json', 'utf8', (err, data) => {
        if (err) {
            res.send('error getting data');
        } else {
            const ID = '2922c286-16cd-4d43-ab98-c79f698aeab0'
            const inventory = JSON.parse(data)
            const foundInv = inventory.find(inv => inv.warehouseID === req.params.id);
            if(foundInv) {
                const warehouseInv = inventory.filter(item => item.warehouseID === req.params.id).map(inv => {
                    return {
                        id: inv.id,
                        warehouseID: inv.warehouseID,
                        warehouseName: inv.warehouseName,
                        itemName: inv.itemName,
                        description: inv.description,
                        category: inv.category,
                        status: inv.status,
                        quantity: inv.quantity
                    }
                });
                res.json(warehouseInv);
            } else {
                return res.status(404).send({message: 'warehouse does not exist'})
            }
        }
    })
})

router.get("/:id", (req, res) => {
    fs.readFile('./data/warehouses.json', 'utf8', (err, data) => {
        const warehouseData = JSON.parse(data)
        const foundWarehouse = warehouseData.find(warehouse => warehouse.id === req.params.id);
        if(foundWarehouse) {
            res.json(foundWarehouse)
        } else {
            return res.status(404).send({
                message: 'warehouse no bueno'
            })
        }
    })
})

//DELETE warehouse by ID
router.delete('/:id/delete', (req, res) => {
    fs.readFile("./data/warehouses.json", "utf8", (err, data) => {
    const warehouseData = JSON.parse(data);
    const warehouseInQuestion = req.params.id
    const newWarehouseData = warehouseData.filter(item =>  item.id !== warehouseInQuestion)
    fs.writeFile("./data/warehouses.json", JSON.stringify(newWarehouseData), (err) => {
        if (err) {
            console.error(err)
            return
        }
        res.send("deleted")})
    })
})

router.post('/', (req, res) => {
    fs.readFile("./data/warehouses.json", "utf8", (err, data) => {
        if(err) {
            res.send("error reading data");
        } else{
            const allWarehouses = JSON.parse(data);
            const newWarehouse = {
                ...req.body,
            }
            allWarehouses.push(newWarehouse);
            fs.writeFile('./data/warehouses.json', JSON.stringify(allWarehouses), (err) => {
                if(err) {
                    res.send("error writing data");
                } else {
                    res.json({ message: 'data written to file', data: newWarehouse});
                }
            })
        }
    }) 
})
module.exports = router;