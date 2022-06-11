const userModel = require("../Models/userModel");

// Get User - See own profile
module.exports.getUser = async function getUser(req, res){
    let id = req.id;
    let user = await userModel.findById(id);
    if(user){
        return res.json(user);
    }
    else{
        return res.json({
            message: "User Not Found !",
        });
    };
};

// Update User Details
module.exports.updateUser = async function(req, res){
    // console.log("req.body ->", req.body);

    try{
        let id = req.params.id;
        let user = await userModel.findById(id);
        let dataToBeUpdated = req.body;

        if(user){
            const keys = [];
            for(let key in dataToBeUpdated){
                keys.push(key);
            }
            for(let i = 0; i<keys.length; i++){
                user[keys[i]] = dataToBeUpdated[keys[i]];
            }
            // user.confirmPassword = user.password;
            const updatedData = await user.save();

            res.json({
                message: "data updated successfully",
                data: updatedData,
            });
        }
        else{
            res.json({
                message: "Data Not Found",
            })
        }
     } catch(err){
            res.json({
            message: err.message,
        });
    }
};

// Delete User
module.exports.deleteUser = async function deleteUser(req,res) {
    try{
        let id = req.params.id;
        let user = await userModel.findByIdAndDelete(id);
        if(!user){
            res.json({
                message: "User Not Found",
            })
        }

        res.json({
            message: "User Deleted",
            data: user,
        });
    }
    catch(err){
        res.json({
            message: err.message,
        })
    }
};

//Get All Users
module.exports.getAllUser = async function getAllUser(req, res){
    try{
        let users = await userModel.find();
        if(users){
            res.json({
                message: "Users Retrieved",
                data: users
            });
        }
    }
    catch(err){
        res.json({
            message: err.message,
        });
    };
};

module.exports.updateProfileImage=function updateProfileImage(req,res){
    res.json({
      message:'File Uploaded Succesfully'
    });
  }