const express = require("express");
const jwt = require("jsonwebtoken");
const { sendMail } = require("../utility/nodemailer");
const { JWT_KEY }= require("../secret");


const userModel = require("../Models/userModel");

//SignUp User
module.exports.signUp = async function signUp(req, res){
    try{
        let dataObj = req.body;
        let user = await userModel.create(dataObj);
        sendMail("signup",user);
        if(user){
            return res.json({
                message: "User Registered Successfully",
                data: user
            });
        }
        else{
            return res.json({
                message: "Error while SignUp",
                data: user
            });
        }
    }
    catch(err){
        return res.json({
            message: err.message,
        });
    };
};


//Login User
module.exports.loginUser = async function loginUser(req, res){
    try{
        let data = req.body;
        if(data.email) 
        {
            let user = await userModel.findOne({email: data.email});

            if(user){
                if(user.password == data.password){
                    let uid = user["_id"];  // Unique Id
                    let token = jwt.sign({ payload: uid }, JWT_KEY);
                
                    res.cookie("login", token, { httpOnly: true });

                    return res.json({
                        message: "User Logged In",
                        data: user,
                    });
                }
            else{
                return res.json({
                    message: "Wrong Credentials",
                });
            }
        }    
    }
    else{
        return res.json({
            message: "User Not Found",
        });
    }
}
    catch(err)
    {
        return res.status(500).json({
            message: err.message,
        });
    }
};

// isAuthorised -> to check the user's role [admin,user,restaurant,deliveryboy]

module.exports.isAuthorised = function isAuthorised(roles){
    return function(req, res, next){
        if(roles.includes(req.role) == true){
            next();
        }
        else{
            res.status(401).json({
                message: "Operation Not Allowed",
            });
        }
    };
};

//ProtectRoute
module.exports.protectRoute = async function protectRoute(req, res, next){
    try{
        let token;

        if(req.cookies.login){
            token = req.cookies.login;
            let payload = jwt.verify(token, JWT_KEY);

            if(payload){
                const user = await userModel.findById(payload.payload);
                req.role = user.role;
                req.id = user.id;

                next();
            }
            else{
                //browser
                const client=req.get('User-Agent');
                if(client.includes("Mozilla")==true){
                     return res.redirect('/login');
                }
                //postman
                return res.json({
                    message: "User Not Verified"
                });
            }
        }
        else{
            res.json({
                message: "Please Login First !",
            })
        }
    }
    catch(err){
        return res.send({
            message: err.message
        });
    }
}

//Forgot password
module.exports.forgetpassword = async function forgetpassword(req, res){
    let { email } = req.body;

    try {
        const user = await userModel.findOne({ email: email});
        if(user){
            //createResetToken is used to create a new token
            const resetToken = user.createResetToken();

            // http://abc.com/resetpassword/resetToken
            let resetPasswordLink = `${req.protocol}://${req.get("host")}/resetpassword/${resetToken}`;

            let obj={
                resetPasswordLink: resetPasswordLink,
                email:email
            }
            sendMail("resetpassword", obj);

            return res.json({
                message: "Reset Passsword Link Sent",
                data: resetPasswordLink,
            });
        }
        else {
            return res.json({
                message: "No such user exists !",
            })
        }
    }
    catch(err){
        res.status(500).json({
            message: err.message,
        });
    }
};

// Reset Password
module.exports.resetpassword = async function(req, res){
    try{
        const token = req.params.token;
        let { password, confirmPassword } = req.body;
        const user = await userModel.findOne({ resetToken: token });

        if(user){
            //resetPasswordHandler will update user's password in database
            user.resetPasswordHandler(password, confirmPassword);
            await user.save();

            res.json({
                message: "Password changed Successfully",
            });
        }
        else {
            res.json({
                message: "User Not Found",
            })
        }
    }
    catch(err){
        res.json({
            message: err.message,
        });
    }
};

//LogOut 
module.exports.logout = function logout(req, res){
    res.cookie('login',' ',{maxAge:1});
    res.json({
        message: "User Logged Out"
    });
};