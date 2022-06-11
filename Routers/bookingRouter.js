const express = require('express');
const bookingRouter = express.Router();
const { createSession } = require('../Controller/bookingController');
const { protectRoute } = require("../Controller/authController");



bookingRouter.post("/createSession", protectRoute, createSession);

bookingRouter.get("/createSession", function(req, res){
    res.sendFile("C:/Users/abhis/Documents/WebDev/FoodApp/Backend/booking.html");
});

module.exports = bookingRouter;