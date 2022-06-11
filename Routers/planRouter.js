const express = require("express");
const { protectRoute, isAuthorised } = require("../Controller/authController");
const { getAllPlans, top3Plans, getPlan, createPlan, updatePlan, deletePlan } = require("../Controller/planController");
const planRouter = express.Router();

planRouter.route('/allPlans').get(getAllPlans);

planRouter.route('/top3').get(top3Plans);

planRouter.use(protectRoute);
planRouter.route('/plan/:id').get(getPlan);

planRouter.use(isAuthorised(['admin', 'restaurantowner']));
planRouter.route('/crudPlan').post(createPlan);

planRouter.route('/crudPlan/:id').patch(updatePlan).delete(deletePlan);

module.exports = planRouter;