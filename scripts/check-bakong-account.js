const axios = require('axios');
require('dotenv').config();

// Script to check if your Bakong account is active

async function checkBakongAccount() {
  const BAKONG_BASE_URL = process.env.BAKONG_DEV_BASE_API_URL || 'https://sit-api-bakong.nbc.gov.kh/v1';
  const BAKONG_ACCESS_TOKEN = process.env.BAKONG_ACCESS_TOKEN;
  const BAKONG_ACCOUNT = process.env.BAKONG_ACCOUNT_USERNAME;

  console.log('🔍 Checking Bakong Account Status...\n');
  console.log('API URL:', BAKONG_BASE_URL);
  console.log('Account:', BAKONG_ACCOUNT);
  console.log('Token:', BAKONG_ACCESS_TOKEN ? '✅ Present' : '❌ Missing');
  console.log('\n' + '='.repeat(50) + '\n');

  try {
    const response = await axios.post(
      `${BAKONG_BASE_URL}/check_bakong_account`,
      {
        accountId: BAKONG_ACCOUNT
      },
      {
        headers: {
          'Authorization': `Bearer ${BAKONG_ACCESS_TOKEN}`,
          'Content-Type': 'application/json'
        }
      }
    );

    console.log('✅ Account Check Result:');
    console.log(JSON.stringify(response.data, null, 2));

    if (response.data.responseCode === 0) {
      console.log('\n✅ SUCCESS: Your Bakong account exists and is active!');
      console.log('Account ID:', BAKONG_ACCOUNT);
    } else {
      console.log('\n❌ ISSUE: Account not found or not active');
      console.log('Response:', response.data.responseMessage);
    }

  } catch (error) {
    console.error('❌ Error checking account:');

    if (error.response) {
      console.log('\nAPI Response:');
      console.log('Status:', error.response.status);
      console.log('Data:', JSON.stringify(error.response.data, null, 2));

      if (error.response.status === 401) {
        console.log('\n⚠️  AUTHENTICATION ERROR: Your access token may be invalid');
      }
    } else {
      console.log('Error:', error.message);
    }

    console.log('\n📝 Troubleshooting Steps:');
    console.log('1. Verify BAKONG_ACCOUNT_USERNAME in .env is correct');
    console.log('2. Check if you are using the correct environment (DEV vs PROD)');
    console.log('3. Ensure your Bakong account exists in the SIT environment');
    console.log('4. Contact NBC Bakong support if account issues persist');
  }
}

checkBakongAccount();
