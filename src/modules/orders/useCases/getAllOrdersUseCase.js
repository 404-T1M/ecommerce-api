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
  "refunded",
];

class GetAllOrdersUseCase {
  constructor() {
    this.orderRepository = new OrderRepository();
  }

  async execute(adminUser, { status, page = 1, limit = 10 }) {
    await assertAdminPermission(adminUser, "orders.read");

    const filter = {};
    if (status) {
      if (!VALID_STATUSES.includes(status)) {
        throw new AppError(`Invalid status filter: ${status}`, 400);
      }
      filter.status = status;
    }

    return await this.orderRepository.find(filter, page, limit);
  }
}

module.exports = GetAllOrdersUseCase;
