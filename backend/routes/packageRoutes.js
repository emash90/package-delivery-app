const express = require("express");
const {
    getAllPackages,
    getPackage,
    getOnePackage,
    createPackage,
    updatePackage,
    deletePackage,
} = require("../controllers/packageControllers");
const protect = require("../middlewares/authMiddleware");
const router = express.Router();

router.route("/allpackages").get( getAllPackages);
router.route("/").get(protect, getPackage).post(protect, createPackage);
router
    .route("/:id")
    .get(protect, getOnePackage)
    .patch(updatePackage)
    .delete(protect, deletePackage);

module.exports = router;