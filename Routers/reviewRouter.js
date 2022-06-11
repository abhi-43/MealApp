const express = require("express");
const { protectRoute } = require("../Controller/authController");
const { getAllReviews, top3reviews, getPlanReviews, createReview, updateReview, deleteReview } = require("../Controller/reviewController");
const reviewRouter = express.Router();

reviewRouter.route('/all').get(getAllReviews);

reviewRouter.route('/top3').get(top3reviews);

reviewRouter.route('/:id').get(getPlanReviews);

reviewRouter.use(protectRoute);
reviewRouter.route('/crud/:plan').post(createReview)
                                 .patch(updateReview)
                                 .delete(deleteReview);

module.exports=reviewRouter;