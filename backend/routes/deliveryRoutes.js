const express = require("express");
const {
    getAllDeliveries,
    getDelivery,
    createDelivery,
    getOneDelivery,
    updateDelivery,
    deleteDelivery,
} = require("../controllers/deliveryControllers");
const protect = require("../middlewares/authMiddleware");
const router = express.Router();

router.route("/alldeliveries").get(protect, getAllDeliveries);
router.route("/").get(protect, getDelivery).post(protect, createDelivery);
router
    .route("/:id")
    .get(protect, getOneDelivery)
    .patch(protect, updateDelivery)
    .delete(protect, deleteDelivery);

module.exports = router;