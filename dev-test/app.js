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
    "sodaneath_somethea@bred",
    "Sodaneath Somethea",
    "PhnomPenh",
    optionalData
);

const khqr = new BakongKHQR("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7ImlkIjoiODgwMGY3ZGZlN2ZhNGY1YSJ9LCJpYXQiOjE3NTYyNjM3MjIsImV4cCI6MTc2NDAzOTcyMn0.x1cJwa1e32sKa0lRsENb5gw8oVsOa2mk_8Scy5ffxwE");
const response = khqr.generateIndividual(individualInfo);
console.log(response);


// --- Verify QR --- //
const qrString = "00020101021129240020sodaneath_somethea@bred5204599953031165802KH59031166009Sodaneath63040798";
const isKhqr = BakongKHQR.verify(qrString);
// console.log("isKhqr", isKhqr.isValid);
// --- Verify QR ---//


// --- Decoded QR --- //
const qrStringForDecoded = "00020101021129240020sodaneath_somethea@bred5204599953031165802KH59031166009Sodaneath63048F7E";
const decodedValue = BakongKHQR.decode(qrStringForDecoded);
// console.log("decodedValue", decodedValue);


