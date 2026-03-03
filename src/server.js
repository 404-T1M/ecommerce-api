require("dotenv").config();
const app = require("./app");
const startDiscountCron = require("./cron/discountCron");
const startCouponCron = require("./cron/couponDiscount");

app.listen(5000, () => {
  console.log("server running on port 5000");
  startDiscountCron();
  startCouponCron();
});
