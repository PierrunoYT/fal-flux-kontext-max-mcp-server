#!/usr/bin/env node

// Simple test script to verify the MCP server can start
// This simulates the basic MCP protocol handshake

import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('Testing FAL FLUX.1 Kontext [Max] MCP Server...');
console.log('Server path:', join(__dirname, 'build', 'index.js'));

// Set a dummy FAL_KEY for testing (server will start but won't work without real key)
const env = {
  ...process.env,
  FAL_KEY: 'test-key-for-startup-verification'
};

const serverProcess = spawn('node', [join(__dirname, 'build', 'index.js')], {
  stdio: ['pipe', 'pipe', 'pipe'],
  env: env
});

let serverOutput = '';
let serverError = '';

serverProcess.stdout.on('data', (data) => {
  serverOutput += data.toString();
});

serverProcess.stderr.on('data', (data) => {
  serverError += data.toString();
  console.log('Server stderr:', data.toString().trim());
});

// Send a basic MCP initialization request
const initRequest = {
  jsonrpc: "2.0",
  id: 1,
  method: "initialize",
  params: {
    protocolVersion: "2024-11-05",
    capabilities: {},
    clientInfo: {
      name: "test-client",
      version: "1.0.0"
    }
  }
};

setTimeout(() => {
  console.log('Sending initialization request...');
  serverProcess.stdin.write(JSON.stringify(initRequest) + '\n');
}, 1000);

// Test tools/list request
setTimeout(() => {
  const toolsRequest = {
    jsonrpc: "2.0",
    id: 2,
    method: "tools/list"
  };
  console.log('Sending tools/list request...');
  serverProcess.stdin.write(JSON.stringify(toolsRequest) + '\n');
}, 2000);

// Clean up after 5 seconds
setTimeout(() => {
  console.log('\n=== Test Results ===');
  
  if (serverError.includes('FAL FLUX.1 Kontext [Max] MCP server running on stdio')) {
    console.log('✅ Server started successfully');
  } else {
    console.log('❌ Server failed to start properly');
  }
  
  if (serverOutput.includes('tools')) {
    console.log('✅ Server responded to tools/list request');
  } else {
    console.log('⚠️  No tools response detected (this might be normal)');
  }
  
  console.log('\nServer output:', serverOutput);
  console.log('Server errors:', serverError);
  
  serverProcess.kill();
  process.exit(0);
}, 5000);

serverProcess.on('error', (error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});

serverProcess.on('exit', (code) => {
  console.log(`Server exited with code ${code}`);
});