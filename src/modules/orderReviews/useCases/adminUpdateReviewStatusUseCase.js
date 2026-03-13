const AppError = require("../../../core/errors/appError");
const ReviewRepository = require("../repositories/reviewRepository");
const { syncProductRating } = require("../../../shared/services/ratingService");

class AdminUpdateReviewStatusUseCase {
  constructor() {
    this.reviewRepository = new ReviewRepository();
  }

  async execute(reviewId, published) {
    const review = await this.reviewRepository.findOne({ _id: reviewId });

    if (!review) {
      throw new AppError("Review not found", 404);
    }

    review.published = published;
    const saved = await this.reviewRepository.save(review);

    await syncProductRating(review.product);

    return saved;
  }
}

module.exports = AdminUpdateReviewStatusUseCase;
