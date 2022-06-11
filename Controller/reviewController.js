const reviewModel = require("../Models/reviewModel");
const planModel = require("../Models/planModel");

module.exports.getAllReviews = async function getAllReviews(req, res){
    try{
        const reviews = await reviewModel.find();
        if(reviews){
            res.json({
                message: "Reviews Found",
                data: reviews,
            });
        }
        else{
            res.json({
                message: "Reviews Not Found",
            })
        }
    }
    catch(err){
        res.json({
            message:err.message
          })
    }
};

module.exports.top3reviews = async function top3reviews(req, res){
    try{
        const reviews = await reviewModel.find().sort({
            rating: -1}).limit(3);
            if(reviews){
                res.json({
                  message:"Reviews Found",
                  data:reviews
                })
              }
              else{
                res.json({
                  message:"Reviews Not Found"
                })
              }
            }
            catch(err){
              res.json({
                message:err.message
              })
            }
          }

module.exports.getPlanReviews = async function getPlanReviews(req, res){
    try{
        const planid = req.params.id;
        let reviews = await reviewModel.find();

        reviews=reviews.filter(review=>review.plan["_id"]==planid);
        return res.json({
            data: reviews,
            message: "Reviews Retrieved for this Plan",
        });
    }
    catch(err){
        return res.json({
            message: err.message,
        });
    }
}

module.exports.createReview = async function createReview(req, res){
    try{
        const id = req.params.plan;
        let plan = await planModel.findById(id);
        let review = await reviewModel.create(req.body);
        plan.ratingsAverage=(plan.ratingsAverage*plan.numOfReviews +req.body.rating) / (plan.numOfReviews + 1);

        await review.save(); //await plan.save
        res.json({
          message: "Review Created Successfully",
          data: review,
        });
      }
      catch(err){
        return res.json({
          message: err.message,
        });
      }
      }
      
      module.exports.updateReview=async function updateReview(req,res){
        try{
        let planid=req.params.plan;
        let id=req.body.id;
        let plan = await planModel.findById(planid);
        let review = await reviewModel.findById(id);

        let dataToBeUpdated=req.body;

        let keys=[];

        for(let key in dataToBeUpdated){
          if(key=="id") continue;
          keys.push(key);
        }
       
        for(let i=0;i<keys.length;i++){
          review[keys[i]]=dataToBeUpdated[keys[i]];
        }

        await review.save();

        return res.json({
          message:'Plan Updated Succesfully',
          data:review
      });
        }
        catch(err){
          return res.json({
            message:err.message
        });
        }
      }

      
      
      module.exports.deleteReview=async function deleteReview(req,res){
        try{
            let planID = req.params.plan;
            let id=req.body.id;
            let plan = await planModel.findById(planID);
            let review = await reviewModel.findById(id);
        
            let newNoOfReviews = (plan.numOfReviews <=0) ? 0: plan.numOfReviews-1;

            plan.ratingsAverage = (newNoOfReviews ==0 || plan.numOfReviews == 0)? 5 : (plan.ratingsAverage*plan.numOfReviews - review.rating) / (newNoOfReviews);

            plan.numOfReviews = newNoOfReviews;
            await plan.save();
            await reviewModel.findByIdAndDelete(id);
        res.json({
          message: "Review Deleted",
          data: review,
        });
      } 
      catch (err) {
        return res.json({
          message: err.message,
        });
      }  
      }