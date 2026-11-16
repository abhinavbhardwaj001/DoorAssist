import { createReviewSchema } from "./review.validation.js";
import { createReview, getProviderReviews } from "./review.service.js";

export const createReviewController = async (req, res, next) => {
  try {
    const reviewData = createReviewSchema.parse(req.body);

    const review = await createReview(req.user.id, reviewData);

    return res.status(201).json({
      success: true,
      message: "Review submitted successfully",
      data: { review },
    });
  } catch (error) {
    next(error);
  }
};

export const getProviderReviewsController = async (req, res, next) => {
  try {
    const { providerId } = req.params;
    const { page, limit } = req.query;

    const result = await getProviderReviews(providerId, {
      page,
      limit,
    });

    return res.status(200).json({
      success: true,
      message: "Provider reviews fetched successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
