const mongoose = require("mongoose");
const crypto=require("crypto")
const bycrypt=require("bcryptjs");

const validator = require("validator");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please tell us your name"],
  },
  email: {
    type: String,
    required: [true, "Please provide your email"],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "Please provide a valid email"],
  },
  photo: {
    type: String,
    default:"default.jpg"
  },
  role:
  {
   type:String,
   enum:["admin","lead-guide","user","guide"],
   default:"user"
  },
  password: {
    type: String,
    required: [true, "Please provide a password"],
    minlength: 8,
    select:false
  },
  passwordConfirm: {
    type: String,
    required: [true, "please confirm your password"],
    validate:
    {
      validator:
        function(el)
        {
          return el===this.password;
        },
        message:"password doesnot match!!!"
    }
  },
  passwordChangedAt:Date,
  passwordResetToken:String,
  passwordResetExpires:Date,
  active:{
    type:Boolean,
    default:true
  }
});
userSchema.pre("save",function(next)
{
  if(!this.isModified("password") || this.isNew) return next();
  this.passwordChangedAt=Date.now()-1000;
  next();
})
userSchema.pre(/^find/,function(next)
{
  this.find({active:{$ne:false}});
  next();
})
userSchema.pre("save",async function(next)
{
  if(!this.isModified("password")) return next();
  this.password=await bycrypt.hash(this.password,12);
  this.passwordConfirm=undefined;
  next();
});
userSchema.methods.correctPassword=async function(candidatePassword,userPassword)
{
  return await bycrypt.compare(candidatePassword,userPassword);
}
userSchema.methods.changedPasswordAt=function(JWTTimestamps)
{

  if(this.passwordChangedAt)
  {

    const changedTimeStamp=parseInt(this.passwordChangedAt.getTime()/1000,10);
    return JWTTimestamps<changedTimeStamp;
  }
  return false;
} 
userSchema.methods.createPasswordResetToken=function()
{
  const resetToken=crypto.randomBytes(32).toString("hex");
  this.passwordResetToken=crypto
  .createHash("sha256")
  .update(resetToken)
  .digest("hex");
  this.passwordResetExpires=Date.now()+10*60*1000;
  console.log({resetToken},this.passwordResetExpires);
  return resetToken;
}
const User=mongoose.model("User",userSchema);

module.exports=User;
