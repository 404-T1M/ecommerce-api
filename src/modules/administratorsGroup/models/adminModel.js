const mongoose = require("mongoose");

const adminGroupSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    permissions: [
      {
        type: String,
        enum: [
          "customers.list",
          "customers.create",
          "customers.update",
          "customers.delete",

          "users.list",
          "users.create",
          "users.update",
          "users.delete",

          "adminGroups.list",
          "adminGroups.create",
          "adminGroups.update",
          "adminGroups.delete",

          "categories.list",
          "categories.create",
          "categories.update",
          "categories.delete",

          "products.list",
          "products.create",
          "products.update",
          "products.delete",

          "orders.list",
          "orders.update",
          "orders.delete",
          "orders.view",

          "coupons.list",
          "coupons.create",
          "coupons.update",
          "coupons.delete",

          "deliveryMen.list",
          "deliveryMen.create",
          "deliveryMen.update",
          "deliveryMen.delete",

          "contactUs.list",
          "contactUs.create",
          "contactUs.update",
          "contactUs.delete",

          "faq.list",
          "faq.create",
          "faq.update",
          "faq.delete",

          "banners.list",
          "banners.create",
          "banners.update",
          "banners.delete",

          "sliders.list",
          "sliders.create",
          "sliders.update",
          "sliders.delete",

          "settings.view",
          "settings.update",

          "reports.earnings",
          "reports.orders",
          "reports.customers",
          "reports.deliveryMen",
        ],
      },
    ],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

adminGroupSchema.index({ name: 1 }, { unique: true });

module.exports = mongoose.model("AdminGroup", adminGroupSchema);
