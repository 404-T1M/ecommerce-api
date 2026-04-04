require("dotenv").config();
const app = require("./app");
const startDiscountCron = require("./cron/discountCron");
const startCouponCron = require("./cron/couponDiscount");

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
  startDiscountCron();
  startCouponCron();
});
