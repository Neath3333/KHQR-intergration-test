const axios = require('axios');
require('dotenv').config();

/**
 * Production Environment Setup Script
 * This script helps you set up production credentials for real Bakong transactions
 */

const PROD_API_URL = 'https://api-bakong.nbc.gov.kh/v1';

async function checkProductionAccount() {
  console.log('='.repeat(70));
  console.log('🏦 BAKONG PRODUCTION ENVIRONMENT SETUP');
  console.log('='.repeat(70));
  console.log('\n⚠️  WARNING: This is for REAL TRANSACTIONS with REAL MONEY\n');

  const currentToken = process.env.BAKONG_ACCESS_TOKEN;
  const currentAccount = process.env.BAKONG_ACCOUNT_USERNAME;

  console.log('Current Configuration:');
  console.log('  Account:', currentAccount);
  console.log('  Token:', currentToken ? currentToken.substring(0, 50) + '...' : '❌ Missing');
  console.log('  Environment: PRODUCTION');
  console.log('  API URL:', PROD_API_URL);
  console.log('\n' + '-'.repeat(70) + '\n');

  // Step 1: Check if account exists in production
  console.log('Step 1: Verifying your Bakong account in PRODUCTION...\n');

  try {
    const accountCheckResponse = await axios.post(
      `${PROD_API_URL}/check_bakong_account`,
      {
        accountId: currentAccount
      },
      {
        headers: {
          'Authorization': `Bearer ${currentToken}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (accountCheckResponse.data.responseCode === 0) {
      console.log('✅ SUCCESS: Your account exists in PRODUCTION!');
      console.log('   Account:', currentAccount);
      console.log('\n' + '-'.repeat(70) + '\n');

      // Step 2: Test token validity
      console.log('Step 2: Testing access token validity...\n');

      try {
        // Try to check a dummy transaction to test token
        await axios.post(
          `${PROD_API_URL}/check_transaction_by_md5`,
          {
            md5: 'test_md5_to_verify_token'
          },
          {
            headers: {
              'Authorization': `Bearer ${currentToken}`,
              'Content-Type': 'application/json'
            }
          }
        );

        console.log('✅ Token is valid (authorized)');
      } catch (error) {
        if (error.response?.status === 401) {
          console.log('❌ TOKEN IS INVALID OR EXPIRED');
          console.log('\n📝 You need to get a new PRODUCTION token:\n');
          console.log('Option 1: Via API');
          console.log('  node scripts/register-production-token.js');
          console.log('\nOption 2: Via NBC Merchant Portal');
          console.log('  Visit: https://bakong.nbc.gov.kh');
          console.log('  Login and generate a new access token');
        } else if (error.response?.data?.responseMessage?.includes('not found')) {
          console.log('✅ Token is valid (transaction not found is expected)');
        } else {
          console.log('⚠️  Token test inconclusive:', error.response?.data?.responseMessage || error.message);
        }
      }

      console.log('\n' + '='.repeat(70));
      console.log('✅ PRODUCTION SETUP COMPLETE');
      console.log('='.repeat(70));
      console.log('\nYour system is configured for REAL TRANSACTIONS.');
      console.log('\n📝 Next Steps:');
      console.log('1. Test the payment flow at: http://localhost:4000');
      console.log('2. Generate a QR code');
      console.log('3. Scan with your REAL banking app');
      console.log('4. Complete a REAL payment');
      console.log('5. Verify the payment');
      console.log('\n⚠️  Remember: This will use REAL MONEY!\n');

    } else {
      console.log('❌ ACCOUNT NOT FOUND in PRODUCTION');
      console.log('   Response:', accountCheckResponse.data.responseMessage);
      console.log('\n📝 Possible Issues:');
      console.log('1. Account does not exist in production');
      console.log('2. Account username is incorrect');
      console.log('3. Account has been deactivated');
      console.log('\n💡 Solutions:');
      console.log('1. Verify your Bakong account username');
      console.log('2. Check if your account is active in your banking app');
      console.log('3. Contact NBC Bakong support: bakong-support@nbc.gov.kh');
    }

  } catch (error) {
    console.error('❌ ERROR:', error.response?.data?.responseMessage || error.message);

    if (error.response?.status === 401) {
      console.log('\n🔑 AUTHENTICATION FAILED');
      console.log('Your access token is INVALID or EXPIRED for production.\n');
      console.log('📝 To get a PRODUCTION token:\n');
      console.log('Option 1: Register via API');
      console.log('  1. Run: node scripts/register-production-token.js');
      console.log('  2. Check your email for verification code');
      console.log('  3. Run: node scripts/verify-production-token.js YOUR_CODE\n');
      console.log('Option 2: Via NBC Merchant Portal');
      console.log('  1. Visit: https://bakong.nbc.gov.kh');
      console.log('  2. Login with your credentials');
      console.log('  3. Navigate to API section');
      console.log('  4. Generate new access token');
      console.log('  5. Copy token to your .env file');
    } else {
      console.log('\nFull error:', error.response?.data || error.message);
    }
  }
}

// Helper function to register for production token
async function registerProductionToken(email, organization, project) {
  console.log('\n🔐 Registering for PRODUCTION API Access...\n');

  try {
    const response = await axios.post(`${PROD_API_URL}/request_token`, {
      email: email,
      organization: organization,
      project: project
    });

    console.log('✅', response.data.responseMessage);
    console.log('\n📧 Check your email:', email);
    console.log('You should receive a verification code.\n');
    console.log('Once received, run:');
    console.log(`node scripts/verify-production-token.js YOUR_CODE`);

  } catch (error) {
    console.error('❌ Registration failed:', error.response?.data?.responseMessage || error.message);
  }
}

// Main execution
const args = process.argv.slice(2);

if (args[0] === 'register') {
  const email = args[1] || 'your-email@example.com';
  const org = args[2] || 'Your Organization';
  const project = args[3] || 'Bakong E-commerce Production';

  registerProductionToken(email, org, project);
} else {
  checkProductionAccount();
}
