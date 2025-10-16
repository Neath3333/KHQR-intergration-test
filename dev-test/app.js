// Import required packages
require('dotenv').config();
const {BakongKHQR, khqrData, IndividualInfo, MerchantInfo, SourceInfo} = require("bakong-khqr");
const express = require('express');
const axios = require('axios');



// --- Generate KHQR and MD5 ---- //

const optionalData = {
    currency: khqrData.currency.khr,
    amount: 100,
    billNumber: "#000002",
    mobileNumber: "070773389",
    storeLabel: "Bakong E-commerce Store",
    terminalLabel: "T000001",
    expirationTimestamp: Date.now() + (2 * 60 * 1000),
    merchantCategoryCode: "5999",
};

const individualInfo = new IndividualInfo(
    process.env.BAKONG_ACCOUNT_USERNAME,
    "Your Name",
    "Your City",
    optionalData
);

const khqr = new BakongKHQR(process.env.BAKONG_ACCESS_TOKEN);
const response = khqr.generateIndividual(individualInfo);
console.log(response);


// --- Verify QR --- //
// const qrString = "your_qr_string_here";
// const isKhqr = BakongKHQR.verify(qrString);
// console.log("isKhqr", isKhqr.isValid);
// --- Verify QR ---//


// --- Decoded QR --- //
// const qrStringForDecoded = "your_qr_string_here";
// const decodedValue = BakongKHQR.decode(qrStringForDecoded);
// console.log("decodedValue", decodedValue);


