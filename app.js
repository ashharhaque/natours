const express=require("express");
const app=express();
const path=require("path");
const rateLimiter=require("express-rate-limit");
const AppError=require('./utils/appError');
const userRouter=require('./routes/userRoutes');
const tourRouter=require('./routes/tourRoutes');
const reviewRouter=require('./routes/reviewRoutes');
const bookingRouter=require("./routes/bookingRoutes");
const viewsRouter=require('./routes/viewsRoutes');
const morgan=require('morgan');  
const helmet=require("helmet");  
const mongoSanitize=require("express-mongo-sanitize");
const xss=require("xss-clean");
const hpp=require("hpp");
const cookieParser=require("cookie-parser");       
const globalErrorHandler=require("./controller/errorController"); 
//2==>middleware             
app.set("view engine","pug");
app.set("views",path.join(__dirname,"views"));

app.use(helmet()); 
if(process.env.NODE_ENV=="developement")
{
    app.use(morgan("dev"));
}                               
const limiter=rateLimiter({
    max:100,
    windowMs:60*60*100,
    message:"Your ip limit has been exceeded please try in an hour"
});

app.use("/api",limiter);
app.use(express.json({limit:"10 kb"}));
// app.use(express.urlencoded,{
//     extended:true,limit:"10kb"
// })
app.use(express.urlencoded({extended:true,limit:"10kb"}));
app.use(cookieParser());
app.use(mongoSanitize());  
app.use(xss());
app.use(hpp({
    whitelist:["duration",
"maxGroupSize",
"ratingsQuantity",
"ratingsAverage",
"difficulty",
"price"]
}));
app.use(express.static(path.join(__dirname,"starter/public")));
app.use((req,res,next)=>
{  
req.requestTime=new Date().toISOString();
next();
});  

// app.get("/login",viewsRouter)
// app.post("/login",userRouter);
// app.get("/logout",userRouter);                                  
// app.get("/overview",viewsRouter);     
// app.get("/tour/:slug",viewsRouter);
// app.use('/api/v1/tours',tourRouter);
// app.use('/api/v1/users',userRouter);
// app.use("/api/v1/reviews",reviewRouter);
app.use('/', viewsRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use("/api/v1/bookings",bookingRouter);
app.use('/api/v1/reviews', reviewRouter);
app.all('*',(req,res,next)=>  
{
     next(new AppError(`we are unable to find${req.originalUrl}`,404));
});
//5==> error middleware
app.use(globalErrorHandler);
//6=>server starting

module.exports=app;                    