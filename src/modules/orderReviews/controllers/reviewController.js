const catchAsync = require("../../../shared/utils/catchAsync");
const AppError = require("../../../core/errors/appError");
const AddReviewUseCase = require("../useCases/addReviewUseCase");
const UpdateReviewUseCase = require("../useCases/updateReviewUseCase");
const GetProductReviewsUseCase = require("../useCases/getProductReviewsUseCase");
const AdminGetReviewsUseCase = require("../useCases/adminGetReviewsUseCase");
const AdminUpdateReviewStatusUseCase = require("../useCases/adminUpdateReviewStatusUseCase");
const AdminDeleteReviewUseCase = require("../useCases/adminDeleteReviewUseCase");
const DeleteReviewUseCase = require("../useCases/deleteReviewUseCase");
const ReviewResponseDTO = require("../DTO/reviewResponseDTO");
const ProductReviewsDTO = require("../DTO/productReviewsDTO");

class ReviewController {
  constructor() {
    this.addReviewUseCase = new AddReviewUseCase();
    this.updateReviewUseCase = new UpdateReviewUseCase();
    this.getProductReviewsUseCase = new GetProductReviewsUseCase();
    this.adminGetReviewsUseCase = new AdminGetReviewsUseCase();
    this.adminUpdateReviewStatusUseCase = new AdminUpdateReviewStatusUseCase();
    this.adminDeleteReviewUseCase = new AdminDeleteReviewUseCase();
    this.deleteReviewUseCase = new DeleteReviewUseCase();
  }

  addReview = catchAsync(async (req, res, next) => {
    const { productId } = req.params;
    const { rating, comment } = req.body;

    if (!rating || !comment) {
      return next(new AppError("Rating and comment are required", 400));
    }

    const review = await this.addReviewUseCase.execute(
      req.user?.id,
      productId,
      {
        rating: Number(rating),
        comment,
      },
    );

    res.status(201).json({
      message:
        "Review submitted successfully. It will appear after admin approval.",
      review: new ReviewResponseDTO(review),
    });
  });

  updateReview = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const { rating, comment } = req.body;

    const review = await this.updateReviewUseCase.execute(req.user.id, id, {
      rating: rating !== undefined ? Number(rating) : undefined,
      comment,
    });

    res.status(200).json({
      message:
        "Review updated successfully. It requires re-approval before publishing.",
      review: new ReviewResponseDTO(review),
    });
  });

  getProductReviews = catchAsync(async (req, res, next) => {
    const { productId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const result = await this.getProductReviewsUseCase.execute(
      productId,
      req.user ?? null,
      Number(page),
      Number(limit),
    );

    res.status(200).json({
      message: "Success",
      ...new ProductReviewsDTO(
        result.reviews,
        result.canReview,
        result.hasReviewed,
        result.userReview,
        result.pagination,
      ),
    });
  });

  adminGetReviews = catchAsync(async (req, res, next) => {
    const { published, page = 1, limit = 10 } = req.query;

    const result = await this.adminGetReviewsUseCase.execute(
      req.user,
      published,
      Number(page),
      Number(limit),
    );

    res.status(200).json({
      message: "Success",
      ...result,
      reviews: result.reviews.map((r) => new ReviewResponseDTO(r)),
    });
  });

  adminUpdateReviewStatus = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const { published } = req.body;

    if (typeof published !== "boolean") {
      return next(new AppError("published must be a boolean", 400));
    }

    const review = await this.adminUpdateReviewStatusUseCase.execute(
      req.user,
      id,
      published,
    );

    res.status(200).json({
      message: `Review ${published ? "published" : "unpublished"} successfully`,
      review: new ReviewResponseDTO(review),
    });
  });

  adminDeleteReview = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const { reason } = req.body;

    if (!reason) {
      return next(new AppError("Deletion reason is required", 400));
    }

    await this.adminDeleteReviewUseCase.execute(req.user, id, reason);

    res
      .status(200)
      .json({ message: "Review deleted and user notified via email" });
  });

  deleteReview = catchAsync(async (req, res, next) => {
    const { id } = req.params;

    await this.deleteReviewUseCase.execute(req.user.id, id);

    res.status(200).json({ message: "Review deleted successfully" });
  });
}

module.exports = ReviewController;
