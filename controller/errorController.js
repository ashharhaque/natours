const AppError=require('./../utils/appError');
const handleCastErrorDb=err=>
{
    const message=`${err.path}:${err.value} is invalid id`;
    return new AppError(message,400);
}
const handleDuplicateFieldsDb=err=>
{
    
    const message=`duplicate fields value ${err.keyValue.name}. is entered`;
    console.log(message);
     return new AppError(message,400);
    
} 
const handleValidationErrorDb=err=>
{
    const errors=Object.values(err.errors).map(el=>el.message);
    const message=`Invalid input data:${errors.join(". ")}`;
    return new AppError(message,400);
}
const handleJWTError=()=>new AppError("invalid id.Please sign in again",401);
const handleTokenExpiredError=()=>new AppError("Token has expired please login again",401);
const sendErrorDev=(err,req,res)=>
{
    //a
   if(req.originalUrl.startsWith("/api"))
   {
     return res.status(err.statusCode).json({
        status:err.status,
        message:err.message,
        stack:err.stack,
        name:err.name,
        err
        
    });
   } //b rendered website
        console.error("ERROR",err);
       return res.status(err.statusCode).render("error",{
           title:"Something went wrong",
           msg:err.message
       });
   
};
const sendErrorProd=(err,req,res)=>
{//operational error that we trust
    //api a
    if(req.originalUrl.startsWith("/api"))
    {
        if(err.isOperational)
        {
           return  res.status(err.statusCode).json({
                status:err.status,
                message:err.message
            });
        }
        //Programming or other unknown errors:don't leak error details
        
            //1--log to console
            console.error("ERROR",err);
            //2--send generic message
           return  res.status(500).json({
             status:"error",
             message:"Something went terribly wrong"
            });
        
    }
        //b>>rendered website
    if(err.isOperational)
        {
           return  res.status(err.statusCode).render("error",{
                title:"Something went wrong",
                msg:err.message
            });
        }
        
            //1--log to console
            console.error("ERROR",err);
            //2--send generic message
           return res.status(err.statusCode).render("error",{
                title:"Something went wrong",
                msg:"Please try again later"
            });

      }
    
module.exports=(err,req,res,next)=>
{
    console.log(err.stack);
    err.statusCode=err.statusCode || 500;
    err.status=err.status || "error";
    if(process.env.NODE_ENV==="developement")
    {
        sendErrorDev(err,req,res);
    }
    else if(process.env.NODE_ENV==="production")
    {
        let error=Object.create(err);
        //let error={...err};
        if(err.name==="CastError")  error=handleCastErrorDb(error);
        if(err.code===11000) error=handleDuplicateFieldsDb(error);
        if(err.name==="ValidationError") error=handleValidationErrorDb(error);
        if(err.name==="JsonWebTokenError") error=handleJWTError();
        if(err.name==="TokenExpiredError") error=handleTokenExpiredError()
        sendErrorProd(error,req,res);
    }
    
    
}