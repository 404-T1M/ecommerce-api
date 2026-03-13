const ReviewRepository = require("../repositories/reviewRepository");

class AdminGetReviewsUseCase {
  constructor() {
    this.reviewRepository = new ReviewRepository();
  }

  async execute(published, page = 1, limit = 10) {
    const filter = {};

    if (published === "true") filter.published = true;
    else if (published === "false") filter.published = false;

    const { reviews, total } = await this.reviewRepository.find(
      filter,
      page,
      limit,
    );

    return {
      reviews,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    };
  }
}

module.exports = AdminGetReviewsUseCase;
