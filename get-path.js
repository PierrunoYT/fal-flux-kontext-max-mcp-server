#!/usr/bin/env node

// Simple script to get the absolute path for MCP configuration
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const serverPath = join(__dirname, 'build', 'index.js');

console.log('=== FAL FLUX.1 Kontext [Max] MCP Server Configuration ===\n');
console.log('🎨 Image Generation & Editing with FLUX.1 Kontext [Max]\n');

console.log('🚀 Universal npx Configuration (Works Everywhere)\n');

const config = {
  "mcpServers": {
    "fal-flux-kontext-max": {
      "command": "npx",
      "args": [
        "-y",
        "https://github.com/PierrunoYT/fal-flux-kontext-max-mcp-server.git"
      ],
      "env": {
        "FAL_KEY": "YOUR_FAL_API_KEY_HERE"
      }
    }
  }
};

console.log(JSON.stringify(config, null, 2));

console.log('\n=== Available Tools ===');
console.log('📸 flux_kontext_max_generate - Generate images from text prompts');
console.log('⏳ flux_kontext_max_generate_async - Generate images (async queue)');
console.log('✏️  flux_kontext_max_edit - Edit existing images with prompts');
console.log('⏳ flux_kontext_max_edit_async - Edit images (async queue)');

console.log('\n=== Instructions ===');
console.log('1. Get your FAL API key from https://fal.ai/');
console.log('2. Replace "YOUR_FAL_API_KEY_HERE" with your actual API key');
console.log('3. Add this configuration to your MCP settings file');
console.log('4. Restart your MCP client');
console.log('\n✅ Benefits of npx configuration:');
console.log('  • Works on any machine with Node.js');
console.log('  • No local installation required');
console.log('  • Always uses the latest version');
console.log('  • Cross-platform compatible');
console.log('\n🎨 New in v1.1.0: Image Editing Capabilities!');
console.log('  • Edit existing images with text prompts');
console.log('  • Add text overlays and modifications');
console.log('  • Complex image transformations');
console.log('  • Both real-time and async processing');