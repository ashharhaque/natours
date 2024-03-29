// const mongoose=require("mongoose");
// const fs=require("fs");
// const dotenv=require("dotenv");
// const Tour=require('./../../../models/tourModel');
// const User=require("./../../../models/userModels");
// const Review=require("./../../../models/reviewModel");
// dotenv.config({path:'./config.env'})
// const DB=process.env.DATABASE.replace("<PASSWORD>",process.env.DATABASE_PASSWORD);
// mongoose.connect(DB,{
//     useNewUrlParser:true,
//     useCreateIndex:true,
//     useFindAndModify:false
// }).then(()=>console.log("connection with the database is successfull"));
// //read json file
// const tours=JSON.parse(fs.readFileSync(`${__dirname}/tours.json`,'utf-8'));
// const users=JSON.parse(fs.readFileSync(`${__dirname}/users.json`,'utf-8'));
// const reviews=JSON.parse(fs.readFileSync(`${__dirname}/reviews.json`,'utf-8'));
// //import data into the database
// const importData=async ()=>
// {
//     try{
//         await Tour.create(tours);
//         await User.create(users);
//         await Review.create(reviews);
        
//         console.log("Data successfully loaded");
        
//     }catch(err)
//     {
//         console.log(err);
//     }
//     process.exit();

// };
// //delete all data from the data
// const deleteData=async ()=>
// {
//     async () => {
//         try {
//           await Tour.deleteMany();
//           await User.deleteMany();
//           await Review.deleteMany();
//           console.log('Data successfully deleted!');
//         } catch (err) {
//           console.log(err);
//         }
//         process.exit();
//       };
// }
// if(process.argv[2]==='--import')
// {
//     importData();
// }
// else if(process.argv[2]=='--delete'){
//    deleteData();
// }
// console.log(process.argv); 
const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Tour = require('./../../../models/tourModel');
const Review = require('./../../../models/reviewModel');
const User = require('./../../../models/userModels');

dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
  })
  .then(() => console.log('DB connection successful!'));

// READ JSON FILE
const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`, 'utf-8'));
const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, 'utf-8'));
const reviews = JSON.parse(
  fs.readFileSync(`${__dirname}/reviews.json`, 'utf-8')
);

// IMPORT DATA INTO DB
const importData = async () => {
  try {
    await Tour.create(tours);
    await User.create(users, { validateBeforeSave: false });
    await Review.create(reviews);
    console.log('Data successfully loaded!');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

// DELETE ALL DATA FROM DB
const deleteData = async () => {
  try {
      console.log("deleting data");
    await Tour.deleteMany();
    await User.deleteMany();
    await Review.deleteMany();
    console.log('Data successfully deleted!');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}
