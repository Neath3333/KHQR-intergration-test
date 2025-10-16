# Bakong E-commerce Payment System - Complete Guide

## SECURITY WARNING

**IMPORTANT:** Never push your `.env` file to GitHub!

- `.env` is protected by `.gitignore` (safe)
- `.env.example` has fake values (safe to share)
- Never commit real account info or tokens

**Before pushing to GitHub, always check:**
```bash
git status
```
If you see `.env` in the list, **DO NOT commit it!**

---

## Quick Start

### 1. Start the Server
```bash
npm start
```

### 2. Open the Pages

**Customer Portal** (Shop):
```
http://localhost:4000/
```

**Admin Panel** (Confirm Payments):
```
http://localhost:4000/admin.html
```

---

## How It Works

### Customer Side:
1. Browse products at `http://localhost:4000/`
2. Add to cart → Checkout
3. Get QR code → Scan with banking app → Pay
4. Click "Track Payment Status"
5. Wait for confirmation (auto-refreshes every 5 seconds)
6. See "Payment Confirmed!" when you approve it
7. Click "Continue Shopping" to buy more

### Your Side (Merchant):
1. Open admin panel: `http://localhost:4000/admin.html`
2. See pending payments
3. Open ACLEDA Mobile app → Check transaction history
4. Verify payment received
5. Back to admin panel → Click "Confirm Payment"
6. Customer automatically sees confirmation!

**Time: 30 seconds per order**

---

## Current Setup

- **Account:** Your Bakong account (configured in `.env`)
- **Environment:** Production (Real money transactions)
- **QR Type:** Dynamic (unique per order, amount pre-filled)
- **Verification:** Manual (you check phone, then confirm)

---

## Payment Flow

```
Customer creates order
    ↓
Customer scans QR & pays
    ↓
Money arrives in your ACLEDA account
    ↓
[System CANNOT auto-detect payment]
    ↓
YOU check ACLEDA Mobile app
    ↓
YOU click "Confirm Payment" in admin panel
    ↓
Customer sees "Payment Confirmed!" (auto-updates)
    ↓
Customer continues shopping
```

---

## Why Manual Verification?

**Your current account type:**
- Individual/Personal ACLEDA account
- Can generate QR codes
- Can receive payments
- **Cannot auto-verify payments via API**

**What you need for auto-verification:**
- Bakong Merchant Account
- Can generate QR codes
- Can receive payments
- **Can auto-verify payments via API**
- Gets webhooks when payment arrives
- No manual checking needed!

---

## Getting Merchant Account (For Auto-Verification)

### Contact:
- **Email:** bakong-support@nbc.gov.kh
- **Website:** https://bakong.nbc.gov.kh

### Requirements:
- Business registration documents
- Tax identification number
- Bank account information
- Business description

### Timeline:
- Application review: 1-2 weeks
- Account setup: 3-5 business days

### Once Approved:
Your `.env` file needs:
```env
BAKONG_MERCHANT_ID=your_merchant_id
BAKONG_SECRET=your_secret_key
```

Then payments will be **automatically verified** - no manual checking!

---

## API Endpoints

### Customer Endpoints:
- `POST /api/orders/create` - Create order & get QR code
- `GET /api/orders/:orderId/status` - Check payment status

### Admin Endpoints:
- `GET /api/manual-payment/pending` - List unpaid orders
- `POST /api/manual-payment/confirm` - Confirm payment manually
- `GET /api/manual-payment/paid` - List paid orders

### Product Endpoints:
- `GET /api/products` - List all products

---

## Admin Panel Usage

### Confirm Payment:
```
1. See order in "Pending Payments"
   - Order ID: ORDER_00031
   - Amount: 1,000 KHR
   - Items: Wireless Headphones

2. Open ACLEDA Mobile app
   - Check transaction history
   - Verify 1,000 KHR received

3. (Optional) Enter transaction reference from bank

4. Click "Confirm Payment"

5. Done! Customer sees confirmation within 5 seconds
```

---

## Environment Variables

Your `.env` file:
```env
PORT=4000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/bakong-ecommerce

# Bakong Configuration
BAKONG_DEV_BASE_API_URL=https://sit-api-bakong.nbc.gov.kh/v1
BAKONG_PROD_BASE_API_URL=https://api-bakong.nbc.gov.kh/v1
BAKONG_ACCOUNT_USERNAME=your_account@bank_code
BAKONG_ACCESS_TOKEN=your_token_here

# For merchant account (when approved):
BAKONG_MERCHANT_ID=YOUR_BAKONG_MERCHANT_ID
```

---

## Troubleshooting

**Q: Customer paid but system shows "Awaiting Payment"?**
A: Open admin panel and click "Confirm Payment" after verifying in your ACLEDA app

**Q: "Account deactivated" error?**
A: Make sure `.env` has the correct account username from your active Bakong account

**Q: QR code expired?**
A: QR codes expire after 5 minutes. Customer needs to create new order.

**Q: Customer status page not updating?**
A: It auto-refreshes every 5 seconds. Wait a moment or press Ctrl+Shift+R

**Q: Want automatic verification?**
A: Apply for Bakong Merchant Account with National Bank of Cambodia

---

## Comparison

| Feature | Current (Individual) | With Merchant Account |
|---------|---------------------|----------------------|
| Receive payments | Yes | Yes |
| Generate QR codes | Yes | Yes |
| Manual verification | Yes (30 sec/order) | Yes (optional) |
| **Auto verification** | **No** | **Yes (instant)** |
| Webhooks | No | Yes |
| Transaction reports | No | Yes |
| **Best for** | Testing, small scale | **Production, e-commerce** |

---

## Summary

**Current System:**
- Fully functional for receiving payments
- Customer can pay via Bakong QR
- Customer sees status updates automatically
- You must manually confirm each payment (30 seconds)

**To Make It Fully Automatic:**
- Apply for Bakong Merchant Account
- Get approved in 1-2 weeks
- Update `.env` with merchant credentials
- Payments automatically verified!

---

## Support

For merchant account registration:
- **Email:** bakong-support@nbc.gov.kh
- **Phone:** (+855) 23 001 104

---

**Your system is ready to use! Start accepting payments now with manual verification, or apply for merchant account for full automation.**
