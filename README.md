# FAL FLUX.1 Kontext [Max] MCP Server

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![MCP](https://img.shields.io/badge/MCP-Model%20Context%20Protocol-blue)](https://modelcontextprotocol.io/)
[![FAL AI](https://img.shields.io/badge/FAL%20AI-FLUX.1%20Kontext%20Max-green)](https://fal.ai/)

A Model Context Protocol (MCP) server that provides access to FLUX.1 Kontext [Max] - the frontier image generation model through the FAL AI platform. This server enables high-quality image generation with advanced text rendering capabilities and superior contextual understanding.

**🔗 Repository**: [https://github.com/PierrunoYT/fal-flux-kontext-max-mcp-server](https://github.com/PierrunoYT/fal-flux-kontext-max-mcp-server)

> **🚀 Ready to use!** Pre-built executable included - no compilation required.
>
> **✅ Enhanced Reliability**: Server handles missing API keys gracefully without crashes and includes robust error handling.

## Features

- **Frontier Image Generation**: Uses FLUX.1 Kontext [Max] - the latest frontier model via FAL AI
- **Advanced Image Editing**: Powerful image editing capabilities with contextual understanding
- **Advanced Text Rendering**: Superior text integration and rendering capabilities
- **Contextual Understanding**: Enhanced understanding of complex prompts and context
- **Automatic Image Download**: Generated images are automatically saved to local `images` directory
- **Multiple Aspect Ratios**: Support for 21:9, 16:9, 4:3, 3:2, 1:1, 2:3, 3:4, 9:16, and 9:21
- **Batch Generation**: Generate up to 4 images at once
- **Reproducible Results**: Optional seed parameter for consistent outputs
- **Dual Generation Methods**: Both real-time and async queue-based generation for text-to-image and image editing
- **Flexible Output Formats**: Support for JPEG and PNG formats
- **Safety Controls**: Configurable safety tolerance levels (1-6)
- **Guidance Scale Control**: Fine-tune how closely the model follows your prompt (1.0-20.0)
- **Detailed Responses**: Returns both local file paths and original URLs with metadata
- **Robust Error Handling**: Graceful handling of missing API keys without server crashes
- **Universal Portability**: Works anywhere with npx - no local installation required
- **Enhanced Reliability**: Graceful shutdown handlers and comprehensive error reporting

## Prerequisites

- Node.js 18 or higher
- FAL AI API key

## Installation

### 1. Get your FAL AI API Key

- Visit [FAL AI](https://fal.ai/)
- Sign up for an account
- Navigate to your dashboard
- Generate an API key

### 2. Clone or Download

```bash
git clone https://github.com/PierrunoYT/fal-flux-kontext-max-mcp-server.git
cd fal-flux-kontext-max-mcp-server
```

### 3. Install Dependencies (Optional)

The server is pre-built, but if you want to modify it:

```bash
npm install
npm run build
```

## Configuration

### 🚀 Recommended: Universal npx Configuration (Works Everywhere)

**Best option for portability** - works on any machine with Node.js:

```json
{
  "mcpServers": {
    "fal-flux-kontext-max": {
      "command": "npx",
      "args": [
        "-y",
        "https://github.com/PierrunoYT/fal-flux-kontext-max-mcp-server.git"
      ],
      "env": {
        "FAL_KEY": "your-fal-api-key-here"
      }
    }
  }
}
```

**Benefits:**
- ✅ **Universal Access**: Works on any machine with Node.js
- ✅ **No Local Installation**: npx downloads and runs automatically
- ✅ **Always Latest Version**: Pulls from GitHub repository
- ✅ **Cross-Platform**: Windows, macOS, Linux compatible
- ✅ **Settings Sync**: Works everywhere you use your MCP client

### Alternative: Local Installation

If you prefer to install locally, use the path helper:

```bash
npm run get-path
```

This will output the complete MCP configuration with the correct absolute path.

#### For Claude Desktop

Add to `~/Library/Application Support/Claude/claude_desktop_config.json` (macOS) or `%APPDATA%\Claude\claude_desktop_config.json` (Windows):

```json
{
  "mcpServers": {
    "fal-flux-kontext-max": {
      "command": "node",
      "args": ["path/to/fal-flux-kontext-max-mcp-server/build/index.js"],
      "env": {
        "FAL_KEY": "your-fal-api-key-here"
      }
    }
  }
}
```

#### For Kilo Code MCP Settings

Add to your MCP settings file at:
`C:\Users\[username]\AppData\Roaming\Kilo-Code\MCP\settings\mcp_settings.json`

```json
{
  "mcpServers": {
    "fal-flux-kontext-max": {
      "command": "node",
      "args": ["path/to/fal-flux-kontext-max-mcp-server/build/index.js"],
      "env": {
        "FAL_KEY": "your-fal-api-key-here"
      },
      "disabled": false,
      "alwaysAllow": []
    }
  }
}
```

## Available Tools

### `flux_kontext_max_generate`

Generate images using FLUX.1 Kontext [Max] with real-time processing.

**Parameters:**
- `prompt` (required): Text description of the image to generate
- `seed` (optional): Random seed for reproducible generation
- `guidance_scale` (optional): CFG scale 1.0-20.0 (default: 3.5)
- `sync_mode` (optional): Wait for generation before returning (default: false)
- `num_images` (optional): Number of images to generate, 1-4 (default: 1)
- `safety_tolerance` (optional): Safety level "1"-"6" (default: "2")
- `output_format` (optional): "jpeg" or "png" (default: "jpeg")
- `aspect_ratio` (optional): "21:9", "16:9", "4:3", "3:2", "1:1", "2:3", "3:4", "9:16", "9:21" (default: "1:1")

**Response includes:**
- Image URLs for immediate access
- Generation metadata (seed, request ID, guidance scale)
- File information (content type, dimensions)
- Local file paths for downloaded images

### `flux_kontext_max_generate_async`

Generate images using FLUX.1 Kontext [Max] with async queue processing for longer requests.

**Parameters:** Same as `flux_kontext_max_generate`

**Use this tool when:**
- Generating multiple images (2-4)
- Complex prompts that might take longer
- When the regular tool times out
- For batch processing workflows

**Features:**
- Queue-based processing with status polling
- 5-minute timeout with progress updates
- Detailed logging of generation progress

### `flux_kontext_max_edit`

Edit images using FLUX.1 Kontext [Max] with real-time processing.

**Parameters:**
- `prompt` (required): Text description of the edit to apply to the image
- `image_url` (required): URL of the image to edit (public URL or base64 data URI)
- `seed` (optional): Random seed for reproducible generation
- `guidance_scale` (optional): CFG scale 1.0-20.0 (default: 3.5)
- `sync_mode` (optional): Wait for generation before returning (default: false)
- `num_images` (optional): Number of images to generate, 1-4 (default: 1)
- `safety_tolerance` (optional): Safety level "1"-"6" (default: "2")
- `output_format` (optional): "jpeg" or "png" (default: "jpeg")
- `aspect_ratio` (optional): "21:9", "16:9", "4:3", "3:2", "1:1", "2:3", "3:4", "9:16", "9:21" (default: "1:1")

**Response includes:**
- Edited image URLs for immediate access
- Generation metadata (seed, request ID, guidance scale)
- File information (content type, dimensions)
- Local file paths for downloaded images

### `flux_kontext_max_edit_async`

Edit images using FLUX.1 Kontext [Max] with async queue processing for longer requests.

**Parameters:** Same as `flux_kontext_max_edit`

**Use this tool when:**
- Editing complex images that might take longer
- Generating multiple edited variations (2-4)
- When the regular edit tool times out
- For batch image editing workflows

**Features:**
- Queue-based processing with status polling
- 5-minute timeout with progress updates
- Detailed logging of editing progress

## 📥 **How Image Download Works**

The FAL FLUX.1 Kontext [Max] MCP server automatically downloads generated images to your local machine. Here's the complete process:

### **1. Image Generation Flow**
1. **API Call**: Server calls FAL AI's FLUX.1 Kontext [Max] API
2. **Response**: FAL returns temporary URLs for generated images
3. **Auto-Download**: Server immediately downloads images to local storage
4. **Response**: Returns both local paths and original URLs

### **2. Download Implementation**

#### **Download Function** ([`downloadImage`](src/index.ts:37-71)):
```typescript
async function downloadImage(url: string, filename: string): Promise<string> {
  // 1. Parse the URL and determine HTTP/HTTPS client
  const parsedUrl = new URL(url);
  const client = parsedUrl.protocol === 'https:' ? https : http;
  
  // 2. Create 'images' directory if it doesn't exist
  const imagesDir = path.join(process.cwd(), 'images');
  if (!fs.existsSync(imagesDir)) {
    fs.mkdirSync(imagesDir, { recursive: true });
  }
  
  // 3. Create file write stream
  const filePath = path.join(imagesDir, filename);
  const file = fs.createWriteStream(filePath);
  
  // 4. Download and pipe to file
  client.get(url, (response) => {
    response.pipe(file);
    // Handle completion and errors
  });
}
```

#### **Filename Generation** ([`generateImageFilename`](src/index.ts:74-82)):
```typescript
function generateImageFilename(prompt: string, index: number, seed: number): string {
  // Creates safe filename: flux_kontext_max_prompt_seed_index_timestamp.jpeg
  const safePrompt = prompt
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')  // Remove special characters
    .replace(/\s+/g, '_')         // Replace spaces with underscores
    .substring(0, 50);            // Limit length
  
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  return `flux_kontext_max_${safePrompt}_${seed}_${index}_${timestamp}.jpeg`;
}
```

### **3. File Storage Details**

#### **Directory Structure:**
```
your-project/
├── images/                    # Auto-created directory
│   ├── flux_kontext_max_mountain_landscape_123456_1_2025-06-24T18-30-45-123Z.jpeg
│   ├── flux_kontext_max_cute_robot_789012_1_2025-06-24T18-31-20-456Z.jpeg
│   └── ...
```

#### **Filename Format:**
- **Prefix**: `flux_kontext_max_`
- **Prompt**: First 50 chars, sanitized (alphanumeric + underscores)
- **Seed**: Random seed used for generation
- **Index**: Image number (for multiple images)
- **Timestamp**: ISO timestamp for uniqueness
- **Extension**: `.jpeg` or `.png` based on output_format

### **4. Response Format**

The server returns both local and remote information:
```
Successfully generated 1 image(s) using FLUX.1 Kontext [Max]:

Prompt: "a serene mountain landscape with text 'FLUX' painted in white"
Guidance Scale: 3.5
Aspect Ratio: 1:1
Output Format: jpeg
Safety Tolerance: 2
Seed: 1234567890
Request ID: req_abc123

Generated Images:
Image 1:
  Local Path: /path/to/project/images/flux_kontext_max_a_serene_mountain_landscape_1234567890_1_2025-06-24T18-30-45-123Z.jpeg
  Original URL: https://v3.fal.media/files/...
  Dimensions: 1024x1024

Images have been downloaded to the local 'images' directory.
```

## Example Usage

### Basic Image Generation
```
Generate a photorealistic image of a golden retriever playing in a field of sunflowers with the text "HAPPY DOG" written in bold letters
```

### With Specific Parameters
```
Generate an image with:
- Prompt: "A minimalist logo design for a tech startup, clean lines, with 'STARTUP' text"
- Aspect ratio: 16:9
- Guidance scale: 5.0
- Output format: png
- Number of images: 2
```

### Advanced Usage with Text Rendering
```
Generate 4 images of "A futuristic cityscape at night with neon lights and flying cars, large billboard displaying 'FUTURE CITY 2025'" 
with aspect ratio 21:9, guidance scale 4.0, and seed 12345 for reproducible results
```

### Text-Heavy Prompts (Kontext [Max] Specialty)
```
Create an image of a vintage bookstore with multiple book spines showing titles like "The Art of Code", "Digital Dreams", and "Future Stories" clearly readable
```

### Image Editing Examples

#### Basic Image Editing
```
Edit this image to add a rainbow in the sky
Image URL: https://example.com/landscape.jpg
```

#### Complex Image Editing
```
Edit the image with:
- Prompt: "Add a donut next to the flour on the counter"
- Image URL: https://v3.fal.media/files/rabbit/rmgBxhwGYb2d3pl3x9sKf_output.png
- Guidance scale: 4.0
- Output format: png
```

#### Text Addition to Images
```
Add the text "SALE 50% OFF" in bold red letters to this storefront image
Image URL: https://example.com/storefront.jpg
```

#### Style Transfer and Modifications
```
Transform this portrait to have a vintage sepia tone effect while keeping the person's features intact
Image URL: https://example.com/portrait.jpg
```

## Technical Details

### Architecture
- **Language**: TypeScript with ES2022 target
- **Runtime**: Node.js 18+ with ES modules
- **Protocol**: Model Context Protocol (MCP) SDK v1.0.0
- **API Client**: FAL AI JavaScript client v1.0.0
- **Validation**: Zod schema validation

### API Endpoints Used
- **Text-to-Image Real-time**: `fal-ai/flux-pro/kontext/max/text-to-image` (subscribe method)
- **Text-to-Image Async**: `fal-ai/flux-pro/kontext/max/text-to-image` (queue method)
- **Image Editing Real-time**: `fal-ai/flux-pro/kontext/max` (subscribe method)
- **Image Editing Async**: `fal-ai/flux-pro/kontext/max` (queue method)

### Error Handling
- **Graceful API key handling**: Server continues running even without FAL_KEY set
- **No crash failures**: Removed `process.exit()` calls that caused connection drops
- **Null safety checks**: All tools validate API client availability before execution
- **Graceful shutdown**: Proper SIGINT and SIGTERM signal handling
- **API error catching**: Comprehensive error reporting with detailed context
- **Timeout handling**: Robust async request management with progress updates
- **User-friendly messages**: Clear error descriptions instead of technical crashes

## Development

### Project Structure
```
├── src/
│   └── index.ts          # Main MCP server implementation
├── build/                # Compiled JavaScript (ready to use)
├── test-server.js        # Server testing utility
├── get-path.js          # Configuration path helper
├── example-mcp-config.json # Example configuration
├── package.json         # Project metadata and dependencies
└── tsconfig.json        # TypeScript configuration
```

### Scripts
- `npm run build` - Compile TypeScript to JavaScript
- `npm run dev` - Watch mode for development
- `npm run start` - Start the server directly
- `npm run test` - Test server startup and basic functionality
- `npm run get-path` - Get configuration path for your system

### Making Changes
1. Edit files in the `src/` directory
2. Run `npm run build` to compile
3. Restart your MCP client to use the updated server

### Testing
```bash
npm run test
```

This runs a basic connectivity test that verifies:
- Server starts correctly
- MCP protocol initialization
- Tool discovery functionality

## API Costs

This server uses the FAL AI platform, which charges per image generation. Check [FAL AI pricing](https://fal.ai/pricing) for current rates.

**Typical costs** (as of 2024):
- FLUX.1 Kontext [Max]: ~$0.05-0.15 per image
- Costs vary by resolution and complexity

## Troubleshooting

### Server not appearing in MCP client
1. **Recommended**: Use the npx configuration for universal compatibility
2. If using local installation, verify the path to `build/index.js` is correct and absolute
3. Ensure Node.js 18+ is installed: `node --version`
4. Test server startup: `npm run test`
5. Restart your MCP client (Claude Desktop, Kilo Code, etc.)
6. **Note**: Server will start successfully even without FAL_KEY - check tool responses for API key errors

### Image generation failing
1. Verify your FAL API key is valid and has sufficient credits
2. Check that your prompt follows FAL AI's content policy
3. Try reducing the number of images or simplifying the prompt
4. Use the async tool for complex requests
5. Check the server logs for detailed error messages
6. Ensure the FLUX.1 Kontext [Max] model is available in your region

### Build issues
If you need to rebuild the server:
```bash
npm install
npm run build
```

### Configuration issues
Use the helper script to get the correct path:
```bash
npm run get-path
```

## Support

For issues with:
- **This MCP server**: Create an issue in this repository
- **FAL AI API**: Check [FAL AI documentation](https://fal.ai/docs)
- **MCP Protocol**: See [MCP documentation](https://modelcontextprotocol.io/)

## License

MIT License - see [LICENSE](LICENSE) file for details.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test with `npm run test`
5. Submit a pull request

## Changelog

### v1.1.0 (Latest)
- **✨ NEW: Image Editing**: Added FLUX.1 Kontext [Max] image editing capabilities
- **🔧 New Tools**: `flux_kontext_max_edit` and `flux_kontext_max_edit_async` for image editing
- **🖼️ Image Input Support**: Accept image URLs and base64 data URIs for editing
- **🎨 Advanced Editing**: Complex image modifications with contextual understanding
- **📝 Text Addition**: Add text overlays and modifications to existing images
- **🔄 Dual Editing Methods**: Both real-time and async queue-based image editing
- **📥 Auto-download**: Edited images automatically saved with descriptive filenames

### v1.0.0
- **🚀 Initial release**: FLUX.1 Kontext [Max] support via FAL AI
- **📥 Automatic image download**: Generated images are automatically saved to local `images` directory
- **🗂️ Smart filename generation**: Images saved with descriptive names including prompt, seed, and timestamp
- **🔄 Enhanced responses**: Returns both local file paths and original URLs for maximum flexibility
- **📁 Auto-directory creation**: Creates `images` folder automatically if it doesn't exist
- **🛡️ Download error handling**: Graceful fallback to original URLs if local download fails
- **🎨 Advanced text rendering**: Superior text integration capabilities with Kontext [Max]
- **⚙️ Comprehensive controls**: Full parameter support including guidance scale, safety tolerance, and output formats
- **🔄 Dual generation methods**: Both real-time and async queue-based generation
- **📐 Multiple aspect ratios**: Support for 9 different aspect ratios
- **🔧 Robust error handling**: Graceful shutdown handlers and comprehensive error reporting
- **🌍 Universal portability**: Works everywhere with npx configuration