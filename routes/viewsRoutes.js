const viewsController=require("./../controller/viewsController");
const express=require("express");
const authController=require("./../controller/authController");
const bookingController=require("./../controller/bookingController");

     
const router=express.Router();
router.get("/",bookingController.createBookingCheckout,authController.isLoggedIn,viewsController.getOverview);
router.get("/tour/:slug",authController.isLoggedIn,viewsController.getTour);
router.get("/login",authController.isLoggedIn,viewsController.getLoginForm);
router.get("/me",authController.protect,viewsController.getAccount)  
router.post("/submit-user-data",authController.protect,viewsController.updateUserData)
router.get("/my-tours",authController.protect,viewsController.getMyTours)
// router.get('/', authController.isLoggedIn, viewsController.getOverview);
// router.get('/tour/:slug', authController.isLoggedIn, viewsController.getTour);
// router.get('/login', authController.isLoggedIn, viewsController.getLoginForm);
// router.get('/api/v1/users/me', authController.protect, viewsController.getAccount);

module.exports=router;              