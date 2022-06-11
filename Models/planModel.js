const mongoose = require("mongoose");

const db_link='mongodb+srv://admin:abhishek@cluster0.n7lzipv.mongodb.net/?retryWrites=true&w=majority';

mongoose.connect(db_link)
.then(function(db){
  console.log('plan db connected');
})
.catch(function(err){
  console.log(err);
});

const planSchema  = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        maxlength: [20, "Plan Name should not exceed 20 characters !"],
    },
    duration: {
        type: Number,
        required: true,
    },
    price: {
        type: Number,
        required: [true, "Price not Entered !"],
    },
    numOfReviews: {
        type: Number,
        default: 0,
    },
    ratingsAverage: {
        type: Number,
        default: 0,
    },
    discount: {
        type: Number,
        validate: [function(){
            return this.discount < 100;
        }, "Discount should not exceed Price"],
    },
});

const planModel = mongoose.model("planModel", planSchema);

module.exports = planModel;