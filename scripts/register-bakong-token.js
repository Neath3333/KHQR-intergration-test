const axios = require('axios');
require('dotenv').config();

// Script to register and get Bakong access token

async function registerBakongToken() {
  const BAKONG_BASE_URL = process.env.BAKONG_DEV_BASE_API_URL || 'https://sit-api-bakong.nbc.gov.kh/v1';

  console.log('Step 1: Requesting token from Bakong API...');

  try {
    // Step 1: Request token
    const requestTokenResponse = await axios.post(`${BAKONG_BASE_URL}/request_token`, {
      email: 'your-email@example.com', // Replace with your email
      organization: 'Your Organization Name', // Replace with your organization
      project: 'Bakong E-commerce Integration' // Replace with your project name
    });

    console.log('✅ Token request sent successfully!');
    console.log('Response:', requestTokenResponse.data);
    console.log('\n📧 Check your email for the verification code');
    console.log('\nStep 2: Once you receive the code, run the verify script with:');
    console.log('node scripts/verify-bakong-token.js YOUR_CODE_HERE');

  } catch (error) {
    console.error('❌ Error requesting token:', error.response?.data || error.message);
  }
}

registerBakongToken();
