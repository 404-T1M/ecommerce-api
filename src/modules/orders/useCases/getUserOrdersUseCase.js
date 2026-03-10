const OrderRepository = require("../repositories/orderRepository");

class GetUserOrdersUseCase {
  constructor() {
    this.orderRepository = new OrderRepository();
  }

  async execute(loggedInUser, page = 1, limit = 10) {
    const { orders, total } = await this.orderRepository.findByUser(
      loggedInUser.id,
      page,
      limit,
    );

    return {
      orders,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    };
  }
}

module.exports = GetUserOrdersUseCase;
