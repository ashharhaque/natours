const jwt=require("jsonwebtoken");
const crypto=require("crypto");
const {promisify}=require("util");
const catchAsync=require("./../utils/catchAsync");
const User=require("./../models/userModels");
const AppError=require("./../utils/appError");
const Email = require("./../utils/email");
const signToken=id=>
{
    return jwt.sign({id},process.env.JWT_SECRET,{
        expiresIn:process.env.JWT_EXPIRES_IN
})
}
const createSendToken=(user,statusCode,res)=>
{
    const token=signToken(user._id);
    const cookieOptions={
        expires:new Date(Date.now()+process.env.JWT_EXPIRES_IN*24*60*60*1000),
        httpOnly:true
    }
    if(process.env.NODE_ENV==="production") cookieOptions.secure=true;
    user.password=undefined;
    res.cookie("jwt",token,cookieOptions);
    res.status(statusCode).json({
        status:"success",
        message:"successfully logged in",
        token,
        data:{
            user
        }   
    })
}
exports.signup=catchAsync(async(req,res,next)=>
{
    const newUser= await User.create(req.body);
    const url=`${req.protocol}://${req.get("host")}/me`;
    console.log(url);
    await new Email(newUser,url).sendWelcome();
   createSendToken(newUser,201,res);
});
exports.login=catchAsync(async(req,res,next)=>
{
    const {email,password}=req.body;
    if(!email || !password)
    {
        return next(new AppError("either email or password is missing"),401);
    }
    const user=await User.findOne({email}).select("+password");
    if(!user || !(await user.correctPassword(password,user.password)))
    {
        return next(new AppError("either email or password is wrong"),401);
    }
    createSendToken(user,201,res);
});
exports.protect=catchAsync(async(req,res,next)=>
{
    let token;
    if(req.headers.authorization && req.headers.authorization.startsWith("Bearer"))
    {
        token=req.headers.authorization.split(" ")[1];
    }else if(req.cookies.jwt)
    {
        token=req.cookies.jwt
    }
    if(!token)
    {
        return next(new AppError("please login to access the getAllUsers",401));
    }
    //verify token
    const decode=await promisify(jwt.verify)(token,process.env.JWT_SECRET);
    //if user exists
    const currentUser=await User.findById(decode.id);
    if(!currentUser)
    {
        return next(new AppError("The user whom the token belongs no longer exists",401));
    }
    //if password has been changed
    if(currentUser.changedPasswordAt(decode.iat))
    {
        return next(new AppError("password has been changed please login again",401))
    };
    req.user=currentUser;
    res.locals.user=currentUser;
    next(); 
})
exports.restrictTo=(...roles)=>
{
    return (req,res,next)=>
    {
        if(!roles.includes(req.user.role))
        {
            return next(new AppError("you are not authorised to access the Tour",403));
        }
        next();
    }
};
exports.forgotPassword=catchAsync(async(req,res,next)=>
{
    const user=await User.findOne({email:req.body.email});
    if(!user)
    {
        return next(new AppError("There is no user with such email id",401));
    }
    const resetToken=user.createPasswordResetToken();
    await user.save({validateBeforeSave:false});
    //3 send reset link and resetToken
    const resetURL = `${req.protocol}://${req.get(
            'host'
          )}/api/v1/users/resetPassword/${resetToken}`;
    const message=`to reset the password please go to this link:${resetURL}\n.If not forget the password then ignore`;
    try{
        // await sendEMail({
        //     email:user.email,
        //     subject:"your password rest token is valid for 10 hours",
        //     message
        // });
        
        await new Email(user,resetURL).sendPasswordReset();
        // await new Email(user, resetURL).sendWelcome();
        res.status(200).json({
            status:"success",
            message:"Tokenn successfully sent to mail"
        })
    }
    catch(err)
    {
        user.resetPasswordToken=undefined;
        user.passwordResetExpires=undefined;
        await user.save({validateBeforeSave:false});
        return next(new AppError("There was an error sending the mail.Try again later",500));
    };
    
}); 
exports.resetPassword=catchAsync(async(req,res,next)=>
{
    const hashedToken=crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");
    const user=await User.findOne({passwordResetToken:hashedToken,
                             passwordResetExpires:{$gt:Date.now()}});
    if(!user)
    {
        return next(new AppError("Token is invalid or expired",400));
    }
    user.password=req.body.password;
    user.passwordConfirm=req.body.passwordConfirm;
    user.passwordResetExpires=undefined;
    user.passswordResetToken=undefined;
    await user.save();
   createSendToken(user,201,res)
}); 
exports.updatePassword=catchAsync(async(req,res,next)=>
{
    const user=await User.findById(req.user.id).select("+password");
    if(!user) return next(new AppError("no such user exists",401));
    if(!await user.correctPassword(req.body.passwordCurrent,user.password))
    {
        return next(new AppError("The entered password is wrong please enter again",401));
    }
    user.password=req.body.password;
    user.passwordConfirm=req.body.passwordConfirm;
    await user.save();
    createSendToken(user,200,res);
    next();

})

exports.logout = (req, res) => {
    res.cookie('jwt', 'loggedout', {
      expires: new Date(Date.now() + 10 * 1000),
      httpOnly: true
    });
    res.status(200).json({ status: 'success' });
  };
exports.isLoggedIn=async(req,res,next)=>
{
    if(req.cookies.jwt)
    {
        try{

        
        
        const decode=await promisify(jwt.verify)(req.cookies.jwt,process.env.JWT_SECRET);
        //if user exists
        const currentUser=await User.findById(decode.id);
        if(!currentUser)
        {
            return next();
        }
        //if password has been changed
        if(currentUser.changedPasswordAt(decode.iat))
        {
            return next()
        };
        res.locals.user=currentUser;
        return next();
    }catch(err)
    {
        return next();
    }
    }
     next();
}


