const mongoose=require("mongoose");
const dotenv=require("dotenv");
dotenv.config({path:'./config.env'});
process.on("uncaughtException",err=>
{
    console.log(err.name,err.message);
    console.log("UNCAUGHTEXCEPTION:ERROR HAPPENED.....");
    process.exit(1);
});
const DB=process.env.DATABASE.replace("<PASSWORD>",process.env.DATABASE_PASSWORD);
mongoose.connect(DB,{
    useNewUrlParser:true,
    useCreateIndex:true,
    useFindAndModify:false
}).then(()=>console.log("connection with the database is successfull"));
const app=require("./app");
//console.log(process.env);
const port=process.env.PORT||3000;
 const server=app.listen(port,()=>
{
    console.log(`app running on port ${port}` );
});
process.on("unhandledRejection",err=>
{
    console.log(err.name,err.message);
    console.log(" UNHANDLED REJECTION HAPPENED APPLICATION IS CLOSING");
    server.close(()=>
    {
        process.exit(1);
    });
    
});



