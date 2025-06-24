#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { fal } from "@fal-ai/client";
import * as fs from 'fs';
import * as path from 'path';
import * as https from 'https';
import * as http from 'http';
// Check for required environment variable
const FAL_KEY = process.env.FAL_KEY;
let falClient = null;
if (!FAL_KEY) {
    console.error('FAL_KEY environment variable is required');
    console.error('Please set your FAL API key: export FAL_KEY=your_token_here');
    // Server continues running, no process.exit()
}
else {
    // Configure FAL client
    fal.config({
        credentials: FAL_KEY
    });
    falClient = fal;
}
// Download image function
async function downloadImage(url, filename) {
    return new Promise((resolve, reject) => {
        try {
            const parsedUrl = new URL(url);
            const client = parsedUrl.protocol === 'https:' ? https : http;
            // Create images directory if it doesn't exist
            const imagesDir = path.join(process.cwd(), 'images');
            if (!fs.existsSync(imagesDir)) {
                fs.mkdirSync(imagesDir, { recursive: true });
            }
            const filePath = path.join(imagesDir, filename);
            const file = fs.createWriteStream(filePath);
            client.get(url, (response) => {
                if (response.statusCode !== 200) {
                    reject(new Error(`Failed to download image: HTTP ${response.statusCode}`));
                    return;
                }
                response.pipe(file);
                file.on('finish', () => {
                    file.close();
                    resolve(filePath);
                });
                file.on('error', (err) => {
                    fs.unlink(filePath, () => { }); // Delete partial file
                    reject(err);
                });
            }).on('error', (err) => {
                reject(err);
            });
        }
        catch (error) {
            reject(error);
        }
    });
}
// Generate safe filename for images
function generateImageFilename(prompt, index, seed) {
    const safePrompt = prompt
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, '')
        .replace(/\s+/g, '_')
        .substring(0, 50);
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    return `flux_kontext_max_${safePrompt}_${seed}_${index}_${timestamp}.jpeg`;
}
// Create MCP server
const server = new McpServer({
    name: "fal-flux-kontext-max-server",
    version: "1.0.0",
});
// Tool: Generate images with FLUX.1 Kontext [Max]
server.tool("flux_kontext_max_generate", {
    description: "Generate high-quality images using FLUX.1 Kontext [Max] - Frontier image generation model with advanced text rendering and contextual understanding",
    inputSchema: {
        type: "object",
        properties: {
            prompt: {
                type: "string",
                description: "The text prompt describing what you want to see"
            },
            seed: {
                type: "integer",
                description: "Random seed for reproducible generation. The same seed and prompt will output the same image every time"
            },
            guidance_scale: {
                type: "number",
                minimum: 1.0,
                maximum: 20.0,
                description: "The CFG (Classifier Free Guidance) scale - how closely the model follows your prompt (1.0-20.0)",
                default: 3.5
            },
            sync_mode: {
                type: "boolean",
                description: "If true, waits for image generation and upload before returning. Increases latency but provides direct response",
                default: false
            },
            num_images: {
                type: "integer",
                minimum: 1,
                maximum: 4,
                description: "Number of images to generate (1-4)",
                default: 1
            },
            safety_tolerance: {
                type: "string",
                enum: ["1", "2", "3", "4", "5", "6"],
                description: "Safety tolerance level (1=most strict, 6=most permissive)",
                default: "2"
            },
            output_format: {
                type: "string",
                enum: ["jpeg", "png"],
                description: "Output image format",
                default: "jpeg"
            },
            aspect_ratio: {
                type: "string",
                enum: ["21:9", "16:9", "4:3", "3:2", "1:1", "2:3", "3:4", "9:16", "9:21"],
                description: "Aspect ratio of the generated image",
                default: "1:1"
            }
        },
        required: ["prompt"]
    }
}, async (args) => {
    // Check if FAL client is configured
    if (!falClient) {
        return {
            content: [{
                    type: "text",
                    text: "Error: FAL_KEY environment variable is not set. Please configure your FAL API key."
                }],
            isError: true
        };
    }
    const { prompt, seed, guidance_scale = 3.5, sync_mode = false, num_images = 1, safety_tolerance = "2", output_format = "jpeg", aspect_ratio = "1:1" } = args;
    try {
        // Prepare input for FAL API
        const input = {
            prompt,
            guidance_scale,
            sync_mode,
            num_images,
            safety_tolerance,
            output_format,
            aspect_ratio
        };
        // Add seed if provided
        if (seed !== undefined) {
            input.seed = seed;
        }
        console.error(`Generating ${num_images} image(s) with FLUX.1 Kontext [Max] - prompt: "${prompt}"`);
        // Call FAL FLUX.1 Kontext [Max] API
        const result = await fal.subscribe("fal-ai/flux-pro/kontext/max/text-to-image", {
            input,
            logs: true,
            onQueueUpdate: (update) => {
                if (update.status === "IN_PROGRESS") {
                    update.logs?.map((log) => log.message).forEach((msg) => console.error(`FAL Log: ${msg}`));
                }
            },
        });
        // Download images locally
        console.error("Downloading images locally...");
        const downloadedImages = [];
        for (let i = 0; i < result.data.images.length; i++) {
            const img = result.data.images[i];
            const filename = generateImageFilename(prompt, i + 1, result.data.seed);
            try {
                const localPath = await downloadImage(img.url, filename);
                downloadedImages.push({
                    url: img.url,
                    localPath,
                    index: i + 1,
                    content_type: img.content_type || `image/${output_format}`,
                    width: img.width,
                    height: img.height
                });
                console.error(`Downloaded: ${filename}`);
            }
            catch (downloadError) {
                console.error(`Failed to download image ${i + 1}:`, downloadError);
                // Still add the image info without local path
                downloadedImages.push({
                    url: img.url,
                    localPath: null,
                    index: i + 1,
                    content_type: img.content_type || `image/${output_format}`,
                    width: img.width,
                    height: img.height
                });
            }
        }
        // Format response with download information
        const imageDetails = downloadedImages.map(img => {
            let details = `Image ${img.index}:`;
            if (img.localPath) {
                details += `\n  Local Path: ${img.localPath}`;
            }
            details += `\n  Original URL: ${img.url}`;
            if (img.width && img.height) {
                details += `\n  Dimensions: ${img.width}x${img.height}`;
            }
            return details;
        }).join('\n\n');
        const responseText = `Successfully generated ${downloadedImages.length} image(s) using FLUX.1 Kontext [Max]:

Prompt: "${prompt}"
Guidance Scale: ${guidance_scale}
Aspect Ratio: ${aspect_ratio}
Output Format: ${output_format}
Safety Tolerance: ${safety_tolerance}
Seed: ${result.data.seed}
Request ID: ${result.requestId}

Generated Images:
${imageDetails}

${downloadedImages.some(img => img.localPath) ? 'Images have been downloaded to the local \'images\' directory.' : 'Note: Local download failed, but original URLs are available.'}`;
        return {
            content: [
                {
                    type: "text",
                    text: responseText
                }
            ]
        };
    }
    catch (error) {
        console.error('Error generating image:', error);
        let errorMessage = "Failed to generate image with FLUX.1 Kontext [Max].";
        if (error instanceof Error) {
            errorMessage += ` Error: ${error.message}`;
        }
        return {
            content: [
                {
                    type: "text",
                    text: errorMessage
                }
            ],
            isError: true
        };
    }
});
// Tool: Generate images using queue method (for longer requests)
server.tool("flux_kontext_max_generate_async", {
    description: "Generate images using FLUX.1 Kontext [Max] with async queue method for longer requests",
    inputSchema: {
        type: "object",
        properties: {
            prompt: {
                type: "string",
                description: "The text prompt describing what you want to see"
            },
            seed: {
                type: "integer",
                description: "Random seed for reproducible generation. The same seed and prompt will output the same image every time"
            },
            guidance_scale: {
                type: "number",
                minimum: 1.0,
                maximum: 20.0,
                description: "The CFG (Classifier Free Guidance) scale - how closely the model follows your prompt (1.0-20.0)",
                default: 3.5
            },
            sync_mode: {
                type: "boolean",
                description: "If true, waits for image generation and upload before returning. Increases latency but provides direct response",
                default: false
            },
            num_images: {
                type: "integer",
                minimum: 1,
                maximum: 4,
                description: "Number of images to generate (1-4)",
                default: 1
            },
            safety_tolerance: {
                type: "string",
                enum: ["1", "2", "3", "4", "5", "6"],
                description: "Safety tolerance level (1=most strict, 6=most permissive)",
                default: "2"
            },
            output_format: {
                type: "string",
                enum: ["jpeg", "png"],
                description: "Output image format",
                default: "jpeg"
            },
            aspect_ratio: {
                type: "string",
                enum: ["21:9", "16:9", "4:3", "3:2", "1:1", "2:3", "3:4", "9:16", "9:21"],
                description: "Aspect ratio of the generated image",
                default: "1:1"
            }
        },
        required: ["prompt"]
    }
}, async (args) => {
    // Check if FAL client is configured
    if (!falClient) {
        return {
            content: [{
                    type: "text",
                    text: "Error: FAL_KEY environment variable is not set. Please configure your FAL API key."
                }],
            isError: true
        };
    }
    const { prompt, seed, guidance_scale = 3.5, sync_mode = false, num_images = 1, safety_tolerance = "2", output_format = "jpeg", aspect_ratio = "1:1" } = args;
    try {
        // Prepare input for FAL API
        const input = {
            prompt,
            guidance_scale,
            sync_mode,
            num_images,
            safety_tolerance,
            output_format,
            aspect_ratio
        };
        // Add seed if provided
        if (seed !== undefined) {
            input.seed = seed;
        }
        console.error(`Submitting async request for ${num_images} image(s) with FLUX.1 Kontext [Max] - prompt: "${prompt}"`);
        // Submit request to queue
        const { request_id } = await fal.queue.submit("fal-ai/flux-pro/kontext/max/text-to-image", {
            input
        });
        console.error(`Request submitted with ID: ${request_id}`);
        // Poll for completion
        let result;
        let attempts = 0;
        const maxAttempts = 60; // 5 minutes with 5-second intervals
        while (attempts < maxAttempts) {
            const status = await fal.queue.status("fal-ai/flux-pro/kontext/max/text-to-image", {
                requestId: request_id,
                logs: true
            });
            console.error(`Status check ${attempts + 1}: ${status.status}`);
            if (status.status === "COMPLETED") {
                result = await fal.queue.result("fal-ai/flux-pro/kontext/max/text-to-image", {
                    requestId: request_id
                });
                break;
            }
            // Check if we should continue polling
            if (status.status !== "IN_QUEUE" && status.status !== "IN_PROGRESS") {
                throw new Error(`Image generation failed with status: ${status.status}`);
            }
            // Wait 5 seconds before next check
            await new Promise(resolve => setTimeout(resolve, 5000));
            attempts++;
        }
        if (!result) {
            throw new Error("Request timed out after 5 minutes");
        }
        // Download images locally
        console.error("Downloading images locally...");
        const downloadedImages = [];
        for (let i = 0; i < result.data.images.length; i++) {
            const img = result.data.images[i];
            const filename = generateImageFilename(prompt, i + 1, result.data.seed);
            try {
                const localPath = await downloadImage(img.url, filename);
                downloadedImages.push({
                    url: img.url,
                    localPath,
                    index: i + 1,
                    content_type: img.content_type || `image/${output_format}`,
                    width: img.width,
                    height: img.height
                });
                console.error(`Downloaded: ${filename}`);
            }
            catch (downloadError) {
                console.error(`Failed to download image ${i + 1}:`, downloadError);
                // Still add the image info without local path
                downloadedImages.push({
                    url: img.url,
                    localPath: null,
                    index: i + 1,
                    content_type: img.content_type || `image/${output_format}`,
                    width: img.width,
                    height: img.height
                });
            }
        }
        // Format response with download information
        const imageDetails = downloadedImages.map(img => {
            let details = `Image ${img.index}:`;
            if (img.localPath) {
                details += `\n  Local Path: ${img.localPath}`;
            }
            details += `\n  Original URL: ${img.url}`;
            if (img.width && img.height) {
                details += `\n  Dimensions: ${img.width}x${img.height}`;
            }
            return details;
        }).join('\n\n');
        const responseText = `Successfully generated ${downloadedImages.length} image(s) using FLUX.1 Kontext [Max] (Async):

Prompt: "${prompt}"
Guidance Scale: ${guidance_scale}
Aspect Ratio: ${aspect_ratio}
Output Format: ${output_format}
Safety Tolerance: ${safety_tolerance}
Seed: ${result.data.seed}
Request ID: ${request_id}

Generated Images:
${imageDetails}

${downloadedImages.some(img => img.localPath) ? 'Images have been downloaded to the local \'images\' directory.' : 'Note: Local download failed, but original URLs are available.'}`;
        return {
            content: [
                {
                    type: "text",
                    text: responseText
                }
            ]
        };
    }
    catch (error) {
        console.error('Error in async image generation:', error);
        let errorMessage = "Failed to generate image with FLUX.1 Kontext [Max] (async).";
        if (error instanceof Error) {
            errorMessage += ` Error: ${error.message}`;
        }
        return {
            content: [
                {
                    type: "text",
                    text: errorMessage
                }
            ],
            isError: true
        };
    }
});
// Graceful shutdown handlers
process.on('SIGINT', () => {
    console.error('Received SIGINT, shutting down gracefully...');
    process.exit(0);
});
process.on('SIGTERM', () => {
    console.error('Received SIGTERM, shutting down gracefully...');
    process.exit(0);
});
// Start the server
async function main() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error('FAL FLUX.1 Kontext [Max] MCP server running on stdio');
}
main().catch((error) => {
    console.error('Server error:', error);
    // Don't exit the process, let it continue running
});
//# sourceMappingURL=index.js.map