const planModel = require("../Models/planModel");

//Get ALL Plans
module.exports.getAllPlans = async function getAllPlans(req, res){
    try{
        let plans = await planModel.find();
        if(plans){
            return res.json({
                message: "All Plans Retrieved",
                data: plans,
            });
        }
        else{
            return res.json({
                message: "Plans Not Found !",
            });
        }
    }
    catch(err){
        res.status(500).json({
            message: err.message,
        });
    }
};

// Get Single Plan
module.exports.getPlan = async function getPlan(req, res){
    try{
        let id = req.params.id;
        let plan = await planModel.findById(id);
        if(plan){
            return res.json({
                message: "Plan Retrieved",
                data: plan,
            });
        }
        else{
            return res.json({
                message: "Plan Not Found !",
            });
        }
    }
    catch(err){
        return res.status(500).json({
            message: err.message,
        });
    }
};

//Create Plan
module.exports.createPlan = async function createPlan(req, res){
    try{
        let planData = req.body;
        let createdPlan = await planModel.create(planData);
        return res.json({
            message: "Plan created Succesfully",
            data: createdPlan,
          });
    }
    catch(err){
        res.status(500).json({
            message: err.message,
          });
    }
};

//Delete Plan
module.exports.deletePlan = async function deletePlan(req, res){
    try{
        let id = req.params.id;
        let deletedPlan = await planModel.findByIdAndDelete(id);
        return res.json({
            message: "Plan Deleted Successfully",
            data: deletedPlan,
        });
    }
    catch(err){
        res.status(500).json({
            message: err.message,
          });
    }   
};

//Update Plan
module.exports.updatePlan = async function updatePlan(req, res){
    try{
        let id = req.params.id;
        let dataToBeUpdated = req.body;

        let keys = [];
        for (let key in dataToBeUpdated) {
          keys.push(key);
        }

        let plan = await planModel.findById(id);
        for (let i = 0; i < keys.length; i++) {
            plan[keys[i]] = dataToBeUpdated[keys[i]];
        }
        await plan.save();
        return res.json({
            message:'Plan Updated Succesfully',
            data:plan
        });
    }
    catch(err){
        res.status(500).json({
            message: err.message,
          });
    }
}

// Get Top 3 Plans
module.exports.top3Plans=async function top3Plans(req,res){ 
    try{
        const plans=await planModel.find().sort({
            ratingsAverage:-1
        }).limit(3);
        return res.json({
            message:'Top 3 Plans',
            data: plans
        })
    }
    catch(err){
        res.status(500).json({
            message: err.message,
          });
    }
}