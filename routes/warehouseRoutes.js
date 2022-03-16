const express = require("express");
const router = express.Router();
const fs = require("fs");
const PORT = process.env.PORT;

router.get("/:id/inventory", (req, res) => {
    fs.readFile('./data/inventories.json', 'utf8', (err, data) => {
        if (err) {
            res.send('error getting data');
        } else { 
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

module.exports = router;