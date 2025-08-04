#!/usr/bin/env node

/**
 * SMS Test Command for MealSync
 * Usage: npm run sms:test
 * Sends a test SMS to +255686477074
 */

import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001';

async function sendTestSms() {
  try {
    console.log('🚀 Sending test SMS to +255686477074...');
    
    const response = await axios.post(`${API_BASE_URL}/sms/test`, {}, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (response.data.status === 'success') {
      console.log('✅ Test SMS sent successfully!');
      console.log(`📱 Phone: ${response.data.data.phoneNumber}`);
      console.log(`💬 Message: ${response.data.data.message}`);
      console.log('📊 Response:', JSON.stringify(response.data.data.response, null, 2));
    } else {
      console.error('❌ Failed to send SMS:', response.data.message);
    }
  } catch (error: any) {
    if (error.code === 'ECONNREFUSED') {
      console.error('❌ Error: Cannot connect to server. Make sure the server is running on http://localhost:3001');
      console.log('💡 Run: npm run dev (in another terminal)');
    } else {
      console.error('❌ Error sending test SMS:', error.response?.data || error.message);
    }
  }
}

async function sendCustomSms(phoneNumber: string, message: string) {
  try {
    console.log(`🚀 Sending SMS to ${phoneNumber}...`);
    
    const response = await axios.post(`${API_BASE_URL}/sms/send`, {
      message,
      to: phoneNumber,
      sender: 'MealSync'
    });

    if (response.data.status === 'success') {
      console.log('✅ SMS sent successfully!');
      console.log('📊 Response:', JSON.stringify(response.data.data, null, 2));
    } else {
      console.error('❌ Failed to send SMS:', response.data.message);
    }
  } catch (error: any) {
    if (error.code === 'ECONNREFUSED') {
      console.error('❌ Error: Cannot connect to server. Make sure the server is running on http://localhost:3001');
      console.log('💡 Run: npm run dev (in another terminal)');
    } else {
      console.error('❌ Error sending SMS:', error.response?.data || error.message);
    }
  }
}

// Command line interface
const args = process.argv.slice(2);
const command = args[0];

switch (command) {
  case 'test':
    sendTestSms();
    break;
  case 'send':
    const phoneNumber = args[1];
    const message = args.slice(2).join(' ');
    if (!phoneNumber || !message) {
      console.log('Usage: npm run sms:send <phone> <message>');
      console.log('Example: npm run sms:send +255686477074 "Hello from MealSync!"');
    } else {
      sendCustomSms(phoneNumber, message);
    }
    break;
  default:
    console.log('MealSync SMS Command Tool');
    console.log('');
    console.log('Available commands:');
    console.log('  npm run sms:test                           - Send test SMS to +255686477074');
    console.log('  npm run sms:send <phone> <message>         - Send custom SMS');
    console.log('');
    console.log('Examples:');
    console.log('  npm run sms:test');
    console.log('  npm run sms:send +255686477074 "Hello from MealSync!"');
}
