const AppError = require("../../../core/errors/appError");
const OrderRepository = require("../repositories/orderRepository");
const ProductVariantRepository = require("../../products/repositories/productVariantRepository");
const RefundWalletUseCase = require("../../customerWallet/useCases/refundWalletUseCase");

const CANCELLABLE_STATUSES = ["pending", "confirmed"];

class CancelOrderUseCase {
  constructor() {
    this.orderRepository = new OrderRepository();
    this.variantRepository = new ProductVariantRepository();
    this.refundWalletUseCase = new RefundWalletUseCase();
  }

  async execute(loggedInUser, orderId) {
    const order = await this.orderRepository.findByIdAndUser(
      orderId,
      loggedInUser.id,
    );

    if (!order) {
      throw new AppError("Order not found", 404);
    }

    if (!CANCELLABLE_STATUSES.includes(order.status)) {
      throw new AppError(
        `Order cannot be cancelled once it is ${order.status}`,
        400,
      );
    }

    order.status = "cancelled";

    for (const item of order.items) {
      await this.variantRepository.incrementStock(item.variant, item.quantity);
    }

    if (
      order.paymentMethod?.key === "wallet" &&
      order.paymentStatus === "paid"
    ) {
      await this.refundWalletUseCase.execute(
        String(order.user._id ?? order.user),
        {
          amount: order.pricing.total,
          referenceId: order.orderNumber,
          note: `Refund for cancelled order ${order.orderNumber}`,
          performedBy: loggedInUser.id,
        },
      );
      order.paymentStatus = "refunded";
    }

    return await this.orderRepository.save(order);
  }
}

module.exports = CancelOrderUseCase;
