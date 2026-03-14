const OrderRepository = require("../repositories/orderRepository");

class GetUserOrdersUseCase {
  constructor() {
    this.orderRepository = new OrderRepository();
  }

  async execute(loggedInUser, { page = 1, limit = 10, sort: sortParam, status }) {
    const filter = { user: loggedInUser.id };
    if (status) filter.status = status;

    const sortMap = {
      newest: { createdAt: -1 },
      oldest: { createdAt: 1 },
    };
    const sort = sortMap[sortParam] || { createdAt: -1 };

    const { orders, total } = await this.orderRepository.find(
      filter,
      Number(page),
      Number(limit),
      sort
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
