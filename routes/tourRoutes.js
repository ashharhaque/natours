
const express=require("express");
const tourController=require("./../controller/tourController");
const authController=require("./../controller/authController");
const reviewRouter=require("./reviewRoutes");


const router=express.Router();
router.use('/:tourId/reviews',reviewRouter)
// router.param('id',tourController.checkId);
router
.route('/top-5-cheap')
.get(tourController.aliasTopTours,tourController.getAllTours)
router
router
.route('/tour-stats')
.get(tourController.getTourStats)
router
.route('/monthly-plan/:year')
.get(authController.protect,
    authController.restrictTo("admin","lead-guide"),
    tourController.getMonthlyPlan)
router
.route('/')
.get(tourController.getAllTours)
.post(authController.protect,authController.restrictTo("admin","lead-guide"),tourController.createTour);
router
.route("/tours-within/:distance/center/:latlng/unit/:unit")
.get(tourController.getToursWithin);
router
.route("/distance/:latlng/unit/:unit")
.get(tourController.getDistances);
router
.route('/:id')
.get(tourController.getTour)
.patch(authController.protect,
    authController.restrictTo("admin","lead-guide"),tourController.uploadTourImages,tourController.resizeTourImages,tourController.updateTour)
.delete(authController.protect,authController.restrictTo("admin","lead-guide"),tourController.deleteTour);
module.exports=router;
 