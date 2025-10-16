require('dotenv').config();
console.log('Environment Variables:');
console.log('BAKONG_ACCOUNT_USERNAME:', process.env.BAKONG_ACCOUNT_USERNAME);
console.log('BAKONG_PROD_BASE_API_URL:', process.env.BAKONG_PROD_BASE_API_URL);
console.log('\n.env file content:');
const fs = require('fs');
console.log(fs.readFileSync('.env', 'utf8'));
