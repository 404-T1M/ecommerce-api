const express = require("express");
const connectDB = require("./config/database");
const globalError = require("./core/errors/globalErrors");
const app = express();
app.use(express.json());

//ROUTES
const usersRoutes = require("./modules/users/routes/usersRoutes");
const adminGroupRoutes = require("./modules/administratorsGroup/routes/adminGroupRoutes");
const categoriesRoutes = require("./modules/categories/routes/categoryRoutes");
const productsRoutes = require("./modules/products/routes/productRoutes");
const productsVariantRoutes = require("./modules/products/routes/variantsRoutes");
const attributeRoutes = require("./modules/attributes/routes/attributeRoutes");
const cartRoutes = require("./modules/cart/routes/cartRoutes");
const couponRoutes = require("./modules/coupons/routes/couponRoutes");
const customerAddressesRoutes = require("./modules/customerAddresses/routes/customersAddressesRoutes");
const shippingMethodRoutes = require("./modules/shippingMethods/routes/shippingMethodRoutes");
const paymentMethodRoutes = require("./modules/paymentMethods/routes/paymentMethodRoutes");

connectDB();

app.use("/api/v1", usersRoutes);
app.use("/api/v1/admin", adminGroupRoutes);
app.use("/api/v1", categoriesRoutes);
app.use("/api/v1", productsRoutes);
app.use("/api/v1", productsVariantRoutes);
app.use("/api/v1", attributeRoutes);
app.use("/api/v1", couponRoutes);
app.use("/api/v1", cartRoutes);
app.use("/api/v1", customerAddressesRoutes);
app.use("/api/v1", shippingMethodRoutes);
app.use("/api/v1", paymentMethodRoutes);

app.get("/", (req, res) => {
  res.status(200).json({ status: "ok" });
});

app.use(globalError);
module.exports = app;
