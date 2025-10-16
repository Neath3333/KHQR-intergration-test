const express = require("express");
const router = express.Router();
const manualPaymentController = require("../controllers/manualPaymentController");

// Manual payment verification routes
router.post("/confirm", manualPaymentController.manuallyConfirmPayment);
router.get("/pending", manualPaymentController.getPendingPayments);
router.get("/paid", manualPaymentController.getPaidOrders);

module.exports = router;
