const express = require("express");
require("dotenv").config();

const inventoryRoutes = require("./routes/inventoryRoutes");
const warehouseRoutes = require("./routes/warehouseRoutes");

const cors = require("cors");
const app = express();
const PORT = process.env.PORT;

// middleware
app.use(express.json());
app.use(express.static("public"));
app.use(cors());
app.use("/inventory", inventoryRoutes);
app.use("/warehouses", warehouseRoutes);

app.listen(PORT, () => {
  console.log(`Hello! My server is listening on ${PORT}`);
});
