const mongoose = require("mongoose");

const db_link='mongodb+srv://admin:abhishek@cluster0.n7lzipv.mongodb.net/?retryWrites=true&w=majority';

mongoose.connect(db_link)
.then(function(db){
  console.log('review db connected');
})
.catch(function(err){
  console.log(err);
});

const reviewSchema = new mongoose.Schema({
    review: {
        type: String,
        required: [true, "Review is Required"]
    },
    rating: {
        type: Number,
        min:1,
        max: 10,
        required: [true, "Rating is Required"],
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref:'userModel',
        required: [true, "Review Must belong to a User"],
    },
    plan: {
        type: mongoose.Schema.ObjectId,
        ref: 'planModel',
        required: [true, "Review Must Belong to a Plan"]
    },
});

// Regex for find findById, findOne in pre hook
reviewSchema.pre(/^find/, function (next) {
    this.populate({
      path: "user",
      select: "name profileImage"
    }).populate("plan");
    next();
});

const reviewModel=mongoose.model('reviewModel',reviewSchema);

module.exports=reviewModel;