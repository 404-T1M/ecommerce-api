const AppError = require("../../../core/errors/appError");
const {
  assertAdminPermission,
} = require("../../../core/authorization/checkAdminAndHisPermission");
const OrderRepository = require("../repositories/orderRepository");

const VALID_STATUSES = [
  "pending",
  "confirmed",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
];

const VALID_PAYMENT_STATUSES = ["pending", "paid", "failed", "refunded"];

class GetAllOrdersUseCase {
  constructor() {
    this.orderRepository = new OrderRepository();
  }

  async execute(adminUser, { status, paymentStatus, orderNumber, page = 1, limit = 10, sort: sortParam }) {
    await assertAdminPermission(adminUser, "orders.list");

    const filter = {};
    if (status) {
      if (!VALID_STATUSES.includes(status)) {
        throw new AppError(`Invalid status filter: ${status}`, 400);
      }
      filter.status = status;
    }
    if (paymentStatus) {
      if (!VALID_PAYMENT_STATUSES.includes(paymentStatus)) {
        throw new AppError(
          `Invalid paymentStatus filter: ${paymentStatus}`,
          400,
        );
      }
      filter.paymentStatus = paymentStatus;
    }

    if (orderNumber) {
      filter.orderNumber = { $regex: orderNumber, $options: "i" };
    }

    const sortMap = {
      newest: { createdAt: -1 },
      oldest: { createdAt: 1 },
      total_asc: { totalAmount: 1 },
      total_desc: { totalAmount: -1 },
    };
    const sort = sortMap[sortParam] || { createdAt: -1 };

    return await this.orderRepository.find(filter, Number(page), Number(limit), sort);
  }
}

module.exports = GetAllOrdersUseCase;
