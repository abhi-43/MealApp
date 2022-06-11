const express = require("express");
const app = express();
const cors = require('cors');
const cookieParser = require("cookie-parser");


app.use(express.json()); // global middleware

const port=process.env.PORT || 5000;

// app.use(
//     cors({
//         origin: [
//             'http://localhost:5000',
//             'http://localhost:3000'
//         ],
//     })
// );
app.listen(port,function(){
    console.log(`server listening on port ${port}`); 
});
app.use(cookieParser());
app.use(cors()) ;
app.use(express.static('public/build'));


const userRouter = require('./Routers/userRouter');
const planRouter = require("./Routers/planRouter");
const reviewRouter =  require("./Routers/reviewRouter");
const bookingRouter = require("./Routers/bookingRouter");

app.use("/user", userRouter);
app.use("/plans", planRouter);
app.use("/review", reviewRouter);
app.use("/booking", bookingRouter);
