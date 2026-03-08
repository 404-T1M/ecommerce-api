const AppError = require("../../core/errors/appError");

class CartPricingService {
  static refreshPrices(cart) {
    let changed = false;
    for (const item of cart.items) {
      const currentPrice = item.variant.finalPrice;
      if (item.priceSnapshot !== currentPrice) {
        item.priceSnapshot = currentPrice;
        changed = true;
      }
    }
    return changed;
  }

  static verifyCoupons(coupon, loggedInUser) {
    const now = new Date();
    if (coupon.startsAt && now < coupon.startsAt) {
      throw new AppError("Coupon is not yet active", 400);
    }
    if (coupon.endsAt && now > coupon.endsAt) {
      throw new AppError("Coupon has expired", 400);
    }

    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
      throw new AppError("Coupon usage limit has been reached", 400);
    }

    if (
      coupon.allowedUsers.length > 0 &&
      !coupon.allowedUsers.some(
        (id) => id.toString() === loggedInUser.id.toString(),
      )
    ) {
      throw new AppError("You are not eligible to use this coupon", 403);
    }
  }

  static calculateTotal(cartItems) {
    return cartItems.reduce((total, item) => {
      return total + item.priceSnapshot * item.quantity;
    }, 0);
  }

  static checkItemEligibility(item, coupon) {
    if (coupon.applicableProducts.length > 0) {
      if (
        !coupon.applicableProducts.some(
          (id) => id.toString() === item.variant.product._id.toString(),
        )
      ) {
        return false;
      }
    }

    if (coupon.applicableCategories.length > 0) {
      if (
        !coupon.applicableCategories.some(
          (id) => id.toString() === item.variant.product.category?.toString(),
        )
      ) {
        return false;
      }
    }
    return true;
  }

  static calculateDiscountedTotal(items, coupon) {
    let discount = 0;

    if (coupon.discountType === "percentage") {
      discount =
        (coupon.discountValue / 100) * CartPricingService.calculateTotal(items);
    } else if (coupon.discountType === "fixed") {
      discount = coupon.discountValue;
    }

    if (coupon.maxDiscountAmount) {
      discount = Math.min(discount, coupon.maxDiscountAmount);
    }
    return discount;
  }
}

module.exports = CartPricingService;
