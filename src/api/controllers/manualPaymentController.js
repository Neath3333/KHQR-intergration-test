const Order = require("../models/Order");
const { successResponse, errorResponse } = require("../../helpers/responseHelper");

/**
 * Manual Payment Verification Controller
 * For individual accounts without merchant API access
 */

/**
 * Manually mark an order as paid
 * Used when merchant verifies payment through their banking app
 */
exports.manuallyConfirmPayment = async (req, res) => {
  try {
    const { orderId, transactionReference, paidAmount, notes } = req.body;

    if (!orderId) {
      return errorResponse(res, "orderId is required", null, 400);
    }

    const order = await Order.findOne({ orderId });
    if (!order) {
      return errorResponse(res, "Order not found", null, 404);
    }

    if (order.paid) {
      return errorResponse(res, "Order already marked as paid", null, 400);
    }

    // Optional: Verify amount matches
    if (paidAmount && paidAmount !== order.amount) {
      return errorResponse(
        res,
        `Amount mismatch: Expected ${order.amount} but received ${paidAmount}`,
        null,
        400
      );
    }

    const paidAtTime = new Date();

    // Update order as paid
    await Order.updateOne(
      { _id: order._id },
      {
        paid: true,
        paidAt: paidAtTime,
        manualVerification: true,
        transactionReference: transactionReference || "Manual confirmation",
        verifiedBy: "merchant",
        paymentNotes: notes || "",
        paymentStatus: "confirmed",
      }
    );

    console.log(`✅ Payment confirmed for ${orderId} - Amount: ${order.amount} ${order.currency}`);

    return successResponse(res, "Payment confirmed successfully! Customer will be notified.", {
      orderId: order.orderId,
      amount: order.amount,
      currency: order.currency,
      paidAt: paidAtTime,
      transactionReference: transactionReference,
      items: order.items,
    });
  } catch (err) {
    console.error(err);
    return errorResponse(res, "Failed to confirm payment", err);
  }
};

/**
 * Get list of pending payments (unpaid orders)
 */
exports.getPendingPayments = async (req, res) => {
  try {
    const pendingOrders = await Order.find({
      paid: false,
      expiration: { $gt: Date.now() } // Only show non-expired orders
    }).sort({ createdAt: -1 });

    return successResponse(res, "Pending payments retrieved", {
      count: pendingOrders.length,
      orders: pendingOrders.map(order => ({
        orderId: order.orderId,
        amount: order.amount,
        currency: order.currency,
        qr: order.qr,
        md5: order.md5,
        createdAt: order.createdAt,
        expiresAt: order.expiration,
        items: order.items,
      }))
    });
  } catch (err) {
    console.error(err);
    return errorResponse(res, "Failed to retrieve pending payments", err);
  }
};

/**
 * Get all paid orders
 */
exports.getPaidOrders = async (req, res) => {
  try {
    const paidOrders = await Order.find({ paid: true }).sort({ paidAt: -1 });

    return successResponse(res, "Paid orders retrieved", {
      count: paidOrders.length,
      orders: paidOrders,
    });
  } catch (err) {
    console.error(err);
    return errorResponse(res, "Failed to retrieve paid orders", err);
  }
};

module.exports = exports;
