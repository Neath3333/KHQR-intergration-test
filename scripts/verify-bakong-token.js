const axios = require('axios');
require('dotenv').config();

// Script to verify code and get access token

async function verifyBakongToken() {
  const BAKONG_BASE_URL = process.env.BAKONG_DEV_BASE_API_URL || 'https://sit-api-bakong.nbc.gov.kh/v1';

  // Get verification code from command line argument
  const verificationCode = process.argv[2];

  if (!verificationCode) {
    console.error('❌ Please provide the verification code from your email');
    console.log('Usage: node scripts/verify-bakong-token.js YOUR_CODE_HERE');
    process.exit(1);
  }

  console.log('Verifying code:', verificationCode);

  try {
    // Step 2: Verify token
    const verifyResponse = await axios.post(`${BAKONG_BASE_URL}/verify`, {
      code: verificationCode
    });

    console.log('✅ Token verified successfully!');
    console.log('\n🔑 Your Access Token:');
    console.log(verifyResponse.data.data.token);
    console.log('\n📝 Add this to your .env file:');
    console.log(`BAKONG_ACCESS_TOKEN=${verifyResponse.data.data.token}`);

  } catch (error) {
    console.error('❌ Error verifying token:', error.response?.data || error.message);
  }
}

verifyBakongToken();
