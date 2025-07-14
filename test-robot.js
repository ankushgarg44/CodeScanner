// Test script to simulate robot QR code scanning
// Run this script to test the application: node test-robot.js

import axios from 'axios';

const API_BASE = 'http://localhost:3001';

// QR codes to test
const qrCodes = [
  { qr_id: 'B101', x: 50, y: 50 },
  { qr_id: 'B102', x: 150, y: 50 },
  { qr_id: 'B103', x: 250, y: 50 },
  { qr_id: 'B104', x: 350, y: 50 },
  { qr_id: 'B105', x: 450, y: 50 },
  { qr_id: 'B201', x: 50, y: 150 },
  { qr_id: 'B202', x: 150, y: 150 },
  { qr_id: 'B203', x: 250, y: 150 },
  { qr_id: 'B204', x: 350, y: 150 },
  { qr_id: 'B205', x: 450, y: 150 },
  { qr_id: 'B301', x: 50, y: 250 },
  { qr_id: 'B302', x: 150, y: 250 },
  { qr_id: 'B303', x: 250, y: 250 },
  { qr_id: 'B304', x: 350, y: 250 },
  { qr_id: 'B305', x: 450, y: 250 }
];

async function sendQRScan(qrData) {
  try {
    const response = await axios.post(`${API_BASE}/qr-location`, qrData);
    console.log(`✅ QR Code ${qrData.qr_id} scanned successfully`);
    return response.data;
  } catch (error) {
    console.error(`❌ Error scanning QR Code ${qrData.qr_id}:`, error.message);
    return null;
  }
}

async function testSequentialScans() {
  console.log('🤖 Starting sequential QR code scanning test...\n');
  
  for (let i = 0; i < qrCodes.length; i++) {
    const qrData = qrCodes[i];
    await sendQRScan(qrData);
    
    // Wait 2 seconds between scans
    if (i < qrCodes.length - 1) {
      console.log('⏳ Waiting 2 seconds before next scan...\n');
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }
  
  console.log('🎉 Sequential scanning test completed!');
}

async function testRandomScans() {
  console.log('🎲 Starting random QR code scanning test...\n');
  
  const numScans = 10;
  for (let i = 0; i < numScans; i++) {
    const randomQR = qrCodes[Math.floor(Math.random() * qrCodes.length)];
    await sendQRScan(randomQR);
    
    // Wait 1-3 seconds between scans
    if (i < numScans - 1) {
      const delay = Math.random() * 2000 + 1000; // 1-3 seconds
      console.log(`⏳ Waiting ${Math.round(delay/1000)} seconds before next scan...\n`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  console.log('🎉 Random scanning test completed!');
}

async function testManualScan() {
  console.log('👆 Testing manual scan functionality...\n');
  
  try {
    const response = await axios.post(`${API_BASE}/manual-scan`, { qr_id: 'B104' });
    console.log('✅ Manual scan successful:', response.data.scan.message);
  } catch (error) {
    console.error('❌ Manual scan failed:', error.message);
  }
}

async function getScanHistory() {
  try {
    const response = await axios.get(`${API_BASE}/qr-scans`);
    console.log(`📋 Scan history (${response.data.length} scans):`);
    response.data.forEach((scan, index) => {
      const time = new Date(scan.timestamp).toLocaleTimeString();
      console.log(`  ${index + 1}. ${scan.qr_id} at ${time} - ${scan.message}`);
    });
  } catch (error) {
    console.error('❌ Failed to get scan history:', error.message);
  }
}

// Main test function
async function runTests() {
  console.log('🚀 Robot QR Scanner Test Suite\n');
  console.log('Make sure the backend server is running on http://localhost:3001\n');
  
  try {
    // Test 1: Sequential scanning
    await testSequentialScans();
    console.log('\n' + '='.repeat(50) + '\n');
    
    // Test 2: Random scanning
    await testRandomScans();
    console.log('\n' + '='.repeat(50) + '\n');
    
    // Test 3: Manual scan
    await testManualScan();
    console.log('\n' + '='.repeat(50) + '\n');
    
    // Test 4: Get scan history
    await getScanHistory();
    
  } catch (error) {
    console.error('❌ Test suite failed:', error.message);
  }
}

// Run tests if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runTests();
}

export { runTests, sendQRScan, testSequentialScans, testRandomScans, testManualScan, getScanHistory }; 