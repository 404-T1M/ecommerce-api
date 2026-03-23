/**
 * ============================================================
 *  E-Commerce API – 100% MODULE COVERAGE - ULTIMATE SCALE SEED
 *  Run: node src/seed.js
 *  Scale: 300 Users, 500 Products, 1500 Variants, 500 Orders,
 *         20+ Banners, 10+ Attributes, 20+ Coupons, 11 Section Types
 * ============================================================
 */

require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// ── Models (All 17 identifying collections) ──────────────────
const AdminGroup = require("./modules/administratorsGroup/models/adminModel");
const User = require("./modules/users/models/userModel");
const Attribute = require("./modules/attributes/models/attributeModel");
const Category = require("./modules/categories/models/categoryModel");
const Product = require("./modules/products/models/productModel");
const ProductVariant = require("./modules/products/models/productVariantModel");
const Banner = require("./modules/banners/model/bannerModel");
const Section = require("./modules/sections/model/sectionModel");
const ShippingMethod = require("./modules/shippingMethods/model/shippingMethodsModel");
const PaymentMethod = require("./modules/paymentMethods/model/paymentMethodsModel");
const Coupon = require("./modules/coupons/models/couponModel");
const Order = require("./modules/orders/models/orderModel");
const OrderReview = require("./modules/orderReviews/model/orderReviewModel");
const Cart = require("./modules/cart/models/cartModel");
const Address = require("./modules/customerAddresses/models/customerAddressesModel");
const Wallet = require("./modules/customerWallet/model/customerWalletModel");
const WalletTransaction = require("./modules/customerWallet/model/walletTransactionModel");

// ── Helpers ─────────────────────────────────────────────────
const IMG = (name) => ({ fileName: `seed_${name}_${Math.random().toString(36).slice(-5)}`, size: Math.floor(Math.random() * 200000) + 50000 });
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
const pickN = (arr, n) => arr.sort(() => 0.5 - Math.random()).slice(0, n);
const genOrderNumber = (i) => `ORD-${Date.now().toString(36).toUpperCase()}-${Math.floor(Math.random() * 9000) + 1000}-${i}`;

const fNames = ["Ahmed", "Sara", "Omar", "Nour", "Karim", "Mona", "Zaid", "Layla", "Hassan", "Amira", "Youssef", "Fatima", "Mahmoud", "Dina", "Ali", "Hoda", "Khaled", "Rania", "Tarek", "Salma"];
const lNames = ["Hassan", "Mohamed", "Ali", "Ibrahim", "Saad", "Zaki", "Sami", "Gaber", "Fawzy", "Kamal", "Nasr", "Salah", "Ezz", "Hamdy", "Farouk", "Salem", "Nabil", "Bakr", "Moussa", "Said"];
const productAdjs = ["Premium", "Elite", "Pro", "Ultra", "Classic", "Modern", "Eco", "Smart", "Luxury", "Essential", "Advanced", "Slim", "Powerful", "Compact", "High-End", "Master", "Elegant"];

const productNouns = {
  Smartphones: ["Phone", "Mobile", "Handset", "Device", "Z-Phone", "X-Unit"],
  Laptops: ["Laptop", "Notebook", "Workstation", "Ultrabook", "Desktop", "Station"],
  Headphones: ["Headset", "Earbuds", "Audio", "Buds", "Pod", "SoundBox"],
  "Men's Clothing": ["T-Shirt", "Shirt", "Pants", "Hoodie", "Jacket", "Suit", "Coat"],
  "Women's Clothing": ["Dress", "Top", "Skirt", "Blouse", "Coat", "Leggings", "Scarf"],
  Shoes: ["Sneakers", "Boots", "Sandals", "Heels", "Loafers", "Runners", "Casuals"],
  "Beauty & Care": ["Serum", "Cream", "Lotion", "Oil", "Mask", "Shampoo", "Conditioner"],
  "Home & Living": ["Vase", "Lamp", "Chair", "Table", "Cushion", "Curtain", "Rug"],
  "Sports & Fitness": ["Mat", "Dumbbell", "Cycle", "Ball", "Racket", "Weights", "Grip"]
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("✔ Connected to MongoDB");

  // ── 1. Clear All ──────────────────────────────────────────
  const models = [AdminGroup, User, Attribute, Category, Product, ProductVariant, Banner, Section, ShippingMethod, PaymentMethod, Coupon, Order, OrderReview, Cart, Address, Wallet, WalletTransaction];
  await Promise.all(models.map(m => m.deleteMany({})));
  console.log("✔ Cleared all collections");

  // ── 2. Admins & Users (300) ───────────────────────────────
  const group = await AdminGroup.create({ name: "Super Admins", permissions: ["customers.list", "users.list", "products.list", "orders.list", "banners.list", "categories.list", "attributes.list", "coupons.list"] });
  const hashedPass = await bcrypt.hash("Test@1234", 12);
  const users = [{ name: "Admin", email: "admin@shop.com", mobilePhone: "+201000000000", password: hashedPass, role: "admin", adminGroup: group._id, status: true, emailVerified: true }];

  for (let i = 1; i <= 300; i++) {
    users.push({
      name: `${pick(fNames)} ${pick(lNames)}`,
      email: `user${i}@test.com`,
      mobilePhone: `+201${Math.floor(Math.random()*1000000000).toString().padStart(9, '0')}`,
      password: hashedPass,
      role: "user",
      status: true,
      emailVerified: true
    });
  }
  const iUsers = await User.insertMany(users);
  const adminId = iUsers[0]._id;
  const custs = iUsers.slice(1);
  console.log(`✔ ${iUsers.length} Users seeded`);

  // ── 3. Wallets & Addresses ──────────────────────────────────
  await Wallet.insertMany(custs.map(u => ({ user: u._id, balance: Math.floor(Math.random() * 5000) })));
  await Address.insertMany(custs.map(u => ({
    user: u._id, country: "Egypt", governorate: pick(["Cairo", "Giza", "Alex"]), city: "City", recipientName: u.name,
    recipientMobilePhone: u.mobilePhone, address: "Test St.", isPrimary: true
  })));
  console.log("✔ Wallets and Addresses seeded");

  // ── 4. Attributes (10 types) ───────────────────────────────
  const attrs = await Attribute.insertMany([
    { name: { en: "Color", ar: "اللون" }, type: "select", options: ["Red","Blue","Black","White","Green","Gold","Silver","Navy"], createdBy: adminId },
    { name: { en: "Size", ar: "المقاس" }, type: "select", options: ["S","M","L","XL","38","39","40","41","42"], createdBy: adminId },
    { name: { en: "Material", ar: "الخامة" }, type: "select", options: ["Cotton","Polyester","Silk","Leather","Metal"], createdBy: adminId },
    { name: { en: "Storage", ar: "السعة" }, type: "select", options: ["64GB","128GB","256GB","512GB"], createdBy: adminId },
    { name: { en: "RAM", ar: "الرام" }, type: "select", options: ["4GB","8GB","16GB","32GB"], createdBy: adminId },
    { name: { en: "Brand", ar: "الماركة" }, type: "select", options: ["Apple","Samsung","Sony","Nike","Adidas"], createdBy: adminId },
    { name: { en: "Warranty", ar: "الضمان" }, type: "select", options: ["1 Year","2 Years","No Warranty"], createdBy: adminId },
    { name: { en: "Condition", ar: "الحالة" }, type: "select", options: ["New","Like New","Refurbished"], createdBy: adminId },
    { name: { en: "Gender", ar: "الجنس" }, type: "select", options: ["Men","Women","Unisex"], createdBy: adminId },
    { name: { en: "Fit", ar: "المقاس" }, type: "select", options: ["Slim","Regular","Oversized"], createdBy: adminId }
  ]);
  console.log(`✔ ${attrs.length} Attributes seeded`);

  // ── 5. Categories & Taxonomy ──────────────────────────────
  const parents = await Category.insertMany(["Electronics", "Fashion", "Beauty", "Home", "Sports"].map(n => ({
    name: { en: n, ar: n }, slug: n.toLowerCase(), description: { en: `${n} Category`, ar: `فئة ${n}` },
    image: IMG(n.toLowerCase()), published: true, createdBy: adminId, isFeatured: true
  })));
  const subs = await Category.insertMany([
    { name: { en: "Smartphones", ar: "هواتف" }, parent: parents[0]._id },
    { name: { en: "Laptops", ar: "لابتوب" }, parent: parents[0]._id },
    { name: { en: "Men's Clothing", ar: "ملابس رجالي" }, parent: parents[1]._id },
    { name: { en: "Women's Clothing", ar: "ملابس حريمي" }, parent: parents[1]._id },
    { name: { en: "Shoes", ar: "أحذية" }, parent: parents[1]._id }
  ].map(c => ({ ...c, slug: c.name.en.toLowerCase().replace(/ /g, '-'), description: { en: c.name.en, ar: c.name.en }, image: IMG("sub"), published: true, createdBy: adminId })));
  console.log(`✔ ${parents.length + subs.length} Categories seeded`);

  // ── 6. Products & Variants (500) ──────────────────────────
  console.log("⏳ Products & Variants...");
  const ps = [];
  for (let i = 1; i <= 500; i++) {
    const sCat = pick(subs);
    ps.push({
      name: { en: `${pick(productAdjs)} ${pick(productNouns[sCat.name.en] || ["Item"])} ${i}`, ar: `منتج ${i}` },
      description: { en: "High quality features.", ar: "مواصفات ممتازة." },
      category: sCat._id, images: [IMG("p1"), IMG("p2")], published: true, createdBy: adminId, soldCount: Math.floor(Math.random() * 500)
    });
  }
  const iPs = await Product.insertMany(ps);
  const vars = [];
  for (const p of iPs) {
    const base = Math.floor(Math.random() * 5000) + 500;
    for (let j = 0; j < 3; j++) {
      vars.push({
        product: p._id, image: IMG("v"),
        attributes: [{ attribute: attrs[0]._id, nameSnapshot: attrs[0].name, value: pick(attrs[0].options) }, { attribute: attrs[1]._id, nameSnapshot: attrs[1].name, value: pick(attrs[1].options) }],
        price: { originalPrice: base + 100, salePrice: base, finalPrice: base },
        stock: Math.floor(Math.random() * 50) + 10, sku: `SKU-${p._id.toString().slice(-4)}-${j}`,
        published: true, createdBy: adminId
      });
    }
  }
  const iVs = await ProductVariant.insertMany(vars);
  console.log(`✔ ${iPs.length} Products / ${iVs.length} Variants seeded`);

  // ── 7. Banners & Shipping/Payment (20+ Banners) ────────────
  const banners = [];
  for (let i = 1; i <= 25; i++) {
    banners.push({ title: { en: `Promo Banner ${i}`, ar: `بانر إعلاني ${i}` }, image: IMG("banner"), link: "/products", order: i, isActive: true, createdBy: adminId });
  }
  const iBanners = await Banner.insertMany(banners);
  const [ship] = await ShippingMethod.insertMany([{ name: { en: "Express", ar: "سريع" }, price: 55, createdBy: adminId }]);
  await PaymentMethod.insertMany([{ name: { en: "COD", ar: "كاش" }, key: "cod", createdBy: adminId }, { name: { en: "Wallet", ar: "محفظة" }, key: "wallet", createdBy: adminId }]);
  console.log(`✔ ${iBanners.length} Banners and methods seeded`);

  // ── 8. Coupons (20+) ───────────────────────────────────────
  const coupons = [];
  for (let i = 1; i <= 20; i++) {
    coupons.push({
      code: `PROMO${i}${Math.floor(Math.random()*100)}`,
      discountType: Math.random() > 0.5 ? "percentage" : "fixed",
      discountValue: Math.floor(Math.random() * 30) + 5,
      isActive: true, minOrderTotal: 300, createdBy: adminId
    });
  }
  await Coupon.insertMany(coupons);
  console.log(`✔ 20 Coupons seeded`);

  // ── 9. Orders & History (500) ─────────────────────────────
  const os = [];
  for (let i = 1; i <= 500; i++) {
    const u = pick(custs);
    const v = pick(iVs);
    os.push({
      orderNumber: genOrderNumber(i), user: u._id,
      items: [{ variant: v._id, price: v.price.finalPrice, quantity: 1, total: v.price.finalPrice }],
      pricing: { subtotal: v.price.finalPrice, discount: 0, shipping: 55, total: v.price.finalPrice + 55 },
      address: { country: "Egypt", recipientName: u.name, address: "Sample Address", recipientMobilePhone: u.mobilePhone },
      shippingMethod: { id: ship._id, name: "Express", price: 55 },
      paymentMethod: { key: "cod", name: "COD" },
      status: pick(["delivered", "processing", "pending", "shipped", "cancelled"]),
      paymentStatus: pick(["paid", "pending"])
    });
  }
  const iOs = await Order.insertMany(os);
  console.log(`✔ ${iOs.length} Orders seeded`);

  // ── 10. Reviews & Carts ─────────────────────────────────────
  await OrderReview.insertMany(iOs.filter(o => o.status === "delivered").slice(0, 100).map(o => ({
    user: o.user, product: pick(iPs)._id, order: o._id, rating: 5, comment: "Top quality!", published: true
  })));
  await Cart.insertMany(custs.slice(0, 100).map(u => ({ user: u._id, items: [{ variant: pick(iVs)._id, quantity: 1, priceSnapshot: 100 }] })));
  console.log("✔ Reviews and Carts seeded");

  // ── 11. Sections (11 Types Coverage) ───────────────────────
  const sectionTypes = ["hero_banner","slider","categories","customCategoriesSection","customProductsSection","mostSellingProducts","productsWithOffers","newArrivals","topRatedProducts","forYouRecommendations","similarProducts"];
  await Section.insertMany(sectionTypes.map((t, i) => ({
    title: { en: `Section ${t}`, ar: `قسم ${t}` },
    description: { en: `Description for ${t}`, ar: `وصف ${t}` },
    type: t,
    data: t === "hero_banner" ? { bannerIds: pickN(iBanners.map(b => b._id), 3) } : 
          t.includes("Categories") ? { categoryIds: pickN(subs.map(c => c._id), 4) } : 
          t.includes("Products") ? { productIds: pickN(iPs.map(p => p._id), 6) } : {},
    order: i + 1,
    isActive: true,
    createdBy: adminId
  })));
  console.log(`✔ All 11 Section types seeded`);

  console.log("\n🚀 COMPLETE! Full dataset scale achieved across all modules.");
  await mongoose.disconnect();
}

seed().catch(err => { console.error("❌ Failed:", err); process.exit(1); });
