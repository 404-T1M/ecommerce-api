const AppError = require("../../../core/errors/appError");
const {
  assertAdminPermission,
} = require("../../../core/authorization/checkAdminAndHisPermission");
const OrderRepository = require("../repositories/orderRepository");
const ProductVariantRepository = require("../../products/repositories/productVariantRepository");
const RefundWalletUseCase = require("../../customerWallet/useCases/refundWalletUseCase");

const VALID_STATUSES = [
  "pending",
  "confirmed",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
];

const ALLOWED_TRANSITIONS = {
  pending: ["confirmed", "cancelled"],
  confirmed: ["processing", "cancelled"],
  processing: ["shipped", "cancelled"],
  shipped: ["delivered"],
  delivered: [],
  cancelled: [],
};

class UpdateOrderStatusUseCase {
  constructor() {
    this.orderRepository = new OrderRepository();
    this.variantRepository = new ProductVariantRepository();
    this.refundWalletUseCase = new RefundWalletUseCase();
  }

  async execute(adminUser, orderId, status) {
    await assertAdminPermission(adminUser, "orders.update");

    if (!VALID_STATUSES.includes(status)) {
      throw new AppError(`Invalid status: ${status}`, 400);
    }

    const order = await this.orderRepository.findById(orderId);
    if (!order) {
      throw new AppError("Order not found", 404);
    }

    const allowed = ALLOWED_TRANSITIONS[order.status] ?? [];
    if (!allowed.includes(status)) {
      throw new AppError(
        `Cannot transition order from "${order.status}" to "${status}"`,
        400,
      );
    }

    order.status = status;

    if (status === "cancelled") {
      for (const item of order.items) {
        await this.variantRepository.incrementStock(
          item.variant,
          item.quantity,
        );
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
            note: `Admin refund for cancelled order ${order.orderNumber}`,
            performedBy: String(adminUser._id ?? adminUser.id),
          },
        );
        order.paymentStatus = "refunded";
      }
    }

    if (status === "delivered" && order.paymentStatus !== "paid") {
      if (order.paymentMethod?.key !== "wallet") {
        order.paymentStatus = "paid";
      }
    }

    return await this.orderRepository.save(order);
  }
}

module.exports = UpdateOrderStatusUseCase;
