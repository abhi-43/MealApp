const express = require("express");
const multer = require("multer");
const { signUp, loginUser, protectRoute, isAuthorised, forgetpassword, resetpassword, logout } = require("../Controller/authController");
const { updateUser, deleteUser, getUser, getAllUser, updateProfileImage } = require("../Controller/userController");
const userRouter = express.Router();

userRouter.route("/:id")
          .patch(updateUser)
          .delete(deleteUser)

userRouter.route("/signUp").post(signUp);

userRouter.route("/login").post(loginUser);

userRouter.route("/forgetpassword").post(forgetpassword);

userRouter.route("/resetpassword/:token").post(resetpassword);

userRouter.route("/logout").get(logout);


//Multer for File Upload
const multerStorage = multer.diskStorage({
    destination: function(req, file,cb){
        cb(null,'public/images')
    },
    filename: function(req,file,cb){
        let a = "user-"+new Date().toISOString().replace(/:/g, '-')+".jpeg";
        // console.log(a);
        cb(null, a) 
    }
});

const filter = function (req, file, cb) {
    if(file.mimetype.startsWith("image")) {
        cb(null, true)
    }
    else {
        cb(new Error("Not an Image! Please Upload an image"), false)
    }
}

const upload =multer({
    storage: multerStorage,
    fileFilter: filter
});

userRouter.post("/ProfileImage", upload.single('photo') ,updateProfileImage);

userRouter.get('/ProfileImage',(req,res)=>{
    res.sendFile("C:/Users/abhis/Documents/WebDev/FoodApp/Backend/multer.html");
});


// Profile Page
userRouter.use(protectRoute);
userRouter.route("/userProfile").get(getUser);


//Admin Specific Function
userRouter.use(isAuthorised(['admin']));
userRouter.route("/").get(getAllUser);

module.exports=userRouter;