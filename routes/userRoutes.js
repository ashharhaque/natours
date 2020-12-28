const express=require("express");
const multer=require("multer");
const userController=require("./../controller/userController");
const authController=require("./../controller/authController");

const upload=multer({dest:'starter/public/img/users'})
const router=express.Router();

router.get("/logout",authController.logout)  
router.post("/login",authController.login);
router.post("/signup",authController.signup);
router.post("/forgotpassword",authController.forgotPassword);
router.patch("/resetpassword/:token",authController.resetPassword);
router.use(authController.protect);
router.patch("/updateMyPassword",
authController.updatePassword);
router.patch("/updateMe",userController.uploadUserPhoto,userController.resizeUserPhoto,userController.updateMe);
router.delete("/deleteMe",userController.deleteMe);
router.get('/me',userController.getMe, userController.getUser);
router.use(authController.restrictTo("admin"));
router.route('/')
.get(userController.getAllUsers)
.post(userController.createUser);  
router.route('/:id')
.get(userController.getUser)
.patch(userController.updateMe)
.delete(userController.deleteUser);
module.exports=router;    

    
// const express = require('express');
// const userController = require('./../controllers/userController');
// const authController = require('./../controllers/authController');

// const router = express.Router();

// router.post('/signup', authController.signup);
// router.post('/login', authController.login);
// router.get('/logout', authController.logout);

// router.post('/forgotPassword', authController.forgotPassword);
// router.patch('/resetPassword/:token', authController.resetPassword);

// // Protect all routes after this middleware
// router.use(authController.protect);

// router.patch('/updateMyPassword', authController.updatePassword);
// router.get('/me', userController.getMe, userController.getUser);
// router.patch(
//   '/updateMe',
//   userController.uploadUserPhoto,
//   userController.resizeUserPhoto,
//   userController.updateMe
// );
// router.delete('/deleteMe', userController.deleteMe);

// router.use(authController.restrictTo('admin'));

// router
//   .route('/')
//   .get(userController.getAllUsers)
//   .post(userController.createUser);

// router
//   .route('/:id')
//   .get(userController.getUser)
//   .patch(userController.updateUser)
//   .delete(userController.deleteUser);

// module.exports = router;