#  Bakong KHQR E-commerce Integration

A complete e-commerce backend with **Bakong KHQR payment integration** for Cambodia's national payment system. Includes product management, shopping cart, order processing, and real-time payment verification.

---

##  Features

-  **Product Management** - Full CRUD operations for products
-  **Shopping Cart** - Add to cart and checkout functionality
-  **KHQR Payment** - Generate QR codes for Bakong payments
-  **Payment Verification** - Real-time payment confirmation via NBC API
-  **Web Interface** - Built-in shopping UI for testing
-  **Multi-Bank Support** - Works with any KHQR-compatible banking app
-  **Secure** - JWT-based authentication with NBC

---

##  Quick Start

### 1. Installation

```bash
# Download the project
cd bakong-open-api
npm install
```

### 2. MongoDB Setup

**Option A: Docker (Recommended)**
```bash
docker run -d -p 27017:27017 --name mongodb mongo
```

**Option B: Local Installation**
- Download from [MongoDB Downloads](https://www.mongodb.com/try/download/community)
- Start MongoDB service

**Option C: MongoDB Atlas (Cloud)**
- Create free cluster at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- Get connection string

### 3. Environment Configuration

Create `.env` file in the project root:

```env
# Server Configuration
PORT=4000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/bakong-ecommerce

# Bakong API
BAKONG_DEV_BASE_API_URL=https://sit-api-bakong.nbc.gov.kh/v1
BAKONG_PROD_BASE_API_URL=https://api-bakong.nbc.gov.kh/v1

# Your Bakong Account (REQUIRED)
BAKONG_ACCOUNT_USERNAME=your_account@bank_code
BAKONG_ACCESS_TOKEN=your_token_from_nbc_merchant_portal

# Optional
BAKONG_MERCHANT_ID=your_merchant_id
```

**Get Bakong Credentials:**
1. Register at [NBC Bakong Merchant Portal](https://bakong.nbc.gov.kh)
2. Generate access token (valid for ~90 days)
3. Copy your Bakong ID (e.g., `yourname@yourbank`)

### 4. Seed Sample Data

```bash
node seeds/productSeeder.js
```

This adds 4 sample products: Wireless Headphones, Smartphone, Running Shoes, Gaming Laptop

### 5. Start Server

```bash
npm start
```

Server runs at: **http://localhost:4000**

---

##  Using the Web Interface

### Access the Store
Open your browser: **http://localhost:4000**

### Complete Purchase Flow

1. **Browse Products** - View all available products
2. **Add to Cart** - Click "Add to Cart" on products
3. **View Cart** - Click cart icon (top right)
4. **Adjust Quantity** - Use +/- buttons
5. **Checkout** - Click "Checkout with KHQR"
6. **Pay via QR Code**:
   - Open any banking app (ABA, Wing, ACLEDA, etc.)
   - Tap "Scan QR" or "KHQR Payment"
   - Scan the QR code on screen
   - Confirm payment
7. **Verify Payment** - Click "Verify Payment" button
8. **Success!** - Order confirmed with transaction hash

---

##  API Documentation

### Base URL
```
http://localhost:4000/api
```

### Endpoints

#### 1. Get All Products
```http
GET /api/products
```

**Response:**
```json
{
  "success": true,
  "message": "Products fetched successfully",
  "data": [
    {
      "_id": "68e5d5aa702174f1c6647697",
      "name": "Wireless Headphones",
      "description": "High-quality wireless headphones...",
      "price": 1000,
      "currency": "KHR",
      "stock": 25,
      "images": ["url1", "url2"]
    }
  ]
}
```

#### 2. Create Order & Generate KHQR
```http
POST /api/orders/create
```

**Request Body:**
```json
{
  "items": [
    {
      "productId": "68e5d5aa702174f1c6647697",
      "quantity": 2
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "message": "Order created and QR generated",
  "data": {
    "orderId": "ORDER_00001",
    "qr": "00020101021229240020merchant@bank...",
    "md5": "a1b2c3d4e5f6...",
    "amount": 2000,
    "expiresAt": 1756439291686
  }
}
```

#### 3. Verify Payment
```http
POST /api/orders/verify
```

**Request Body:**
```json
{
  "md5": "a1b2c3d4e5f6..."
}
```

**Success Response:**
```json
{
  "success": true,
  "message": "Payment confirmed",
  "data": {
    "orderId": "ORDER_00001",
    "bakongHash": "9bc29426b5e55f...",
    "bakongData": {
      "hash": "9bc29426b5e55f...",
      "fromAccountId": "customer@bank",
      "toAccountId": "merchant@bank",
      "currency": "KHR",
      "amount": 2000,
      "createdDateMs": 1756366775000
    }
  }
}
```

**Failure Response:**
```json
{
  "success": false,
  "message": "Payment not found or not completed",
  "data": null
}
```

#### 4. Get Order Details
```http
GET /api/orders/:orderId
```

**Response:**
```json
{
  "success": true,
  "message": "Order fetched successfully",
  "data": {
    "orderId": "ORDER_00001",
    "items": [...],
    "qr": "00020101021229240020...",
    "md5": "a1b2c3d4e5f6...",
    "amount": 2000,
    "currency": "KHR",
    "paid": false,
    "createdAt": "2025-10-08T03:08:26.997Z"
  }
}
```

#### 5. Get All Products (Alternative)
```http
GET /api/products
```

---

##  Project Structure

```
bakong-open-api/
├── public/               # Web interface
│   └── index.html       # Shopping UI
├── src/
│   ├── api/
│   │   ├── controllers/ # Business logic
│   │   │   ├── orderController.js
│   │   │   ├── paymentController.js
│   │   │   └── productController.js
│   │   ├── models/      # Database schemas
│   │   │   ├── Order.js
│   │   │   ├── Payment.js
│   │   │   └── Product.js
│   │   ├── routes/      # API routes
│   │   │   ├── orderRoute.js
│   │   │   ├── paymentRoute.js
│   │   │   └── productRoute.js
│   │   └── services/    # External integrations
│   │       └── bakong.service.js
│   ├── config/          # Configuration
│   │   └── db.js        # MongoDB connection
│   └── helpers/         # Utilities
│       └── responseHelper.js
├── seeds/               # Database seeding
│   └── productSeeder.js
├── tests/               # Unit tests
├── .env                 # Environment variables
├── .env.example         # Environment template
├── server.js            # Application entry point
└── package.json         # Dependencies
```

---

##  Payment Flow

```
Customer                    Your Server                 NBC Bakong
   |                            |                            |
   |--1. Checkout------------->|                            |
   |                            |--2. Generate QR----------->|
   |<--3. Show QR Code----------|                            |
   |                            |                            |
   |--4. Scan QR (Banking App)---------------------->|
   |                            |                            |
   |--5. Confirm Payment--------------------------->|
   |                            |                            |
   |--6. Click "Verify"-------->|                            |
   |                            |--7. Check Status---------->|
   |                            |<--8. Payment Confirmed-----|
   |<--9. Success Message-------|                            |
```

---

##  Tech Stack

- **Runtime:** Node.js 18+
- **Framework:** Express.js
- **Database:** MongoDB + Mongoose
- **Payment:** Bakong KHQR SDK
- **Frontend:** Vanilla HTML/CSS/JS
- **QR Code:** QRCode.js
- **Testing:** Jest + Supertest

---

##  Supported Banking Apps

Any KHQR-compatible app can scan and pay:

- ABA Mobile
- ACLEDA Mobile
- Wing Bank
- Prince Bank
- Canadia Bank
- Vattanac Bank
- Pi Pay
- TrueMoney
- And 40+ other Cambodian banks

---

##  Security Notes

-  **Never commit `.env` file** - Contains sensitive credentials
-  **Token expires** - Renew access token every ~90 days at NBC portal
-  **CORS enabled** - Update in production for specific domains
-  **Payment verification** - Always verify via NBC API, never trust client

---

##  Testing

```bash
# Run tests
npm test

# Test specific endpoint
curl http://localhost:4000/api/products

# Create test order
curl -X POST http://localhost:4000/api/orders/create \
  -H "Content-Type: application/json" \
  -d '{"items":[{"productId":"68e5d5aa702174f1c6647697","quantity":1}]}'
```

---

##  Troubleshooting

### Port 3000 already in use
```bash
# Change PORT in .env to 4000 or any available port
PORT=4000
```

### MongoDB connection failed
```bash
# Check if MongoDB is running
docker ps | grep mongodb

# Start MongoDB
docker start mongodb
```

### QR code generates but verification fails
- Check `BAKONG_ACCESS_TOKEN` is valid (not expired)
- Ensure you completed payment in banking app
- Verify account in `.env` matches your Bakong account

### Products not showing
```bash
# Seed database again
node seeds/productSeeder.js
```

---

##  Support

For Bakong integration issues, contact:
- **NBC Bakong Support:** [bakong.nbc.gov.kh](https://bakong.nbc.gov.kh)
- **Developer Portal:** Register for API credentials

---


