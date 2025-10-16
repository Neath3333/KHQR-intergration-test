const axios = require('axios');
require('dotenv').config();

async function checkAccount(accountId) {
  const token = process.env.BAKONG_ACCESS_TOKEN;
  const url = 'https://api-bakong.nbc.gov.kh/v1/check_bakong_account';

  console.log(`\nChecking account: ${accountId}\n`);

  try {
    const response = await axios.post(url,
      { accountId },
      { headers: { 'Authorization': `Bearer ${token}` } }
    );

    console.log('✅ Response:', JSON.stringify(response.data, null, 2));
    return response.data;
  } catch (error) {
    console.log('❌ Error:', error.response?.data || error.message);
    return null;
  }
}

(async () => {
  console.log('='.repeat(70));
  await checkAccount('your_account@bank_code'); // Replace with your actual account
  console.log('='.repeat(70));
})();
