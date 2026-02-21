// Run with: node scripts/generate-icons.mjs
// Generates PNG icons from SVG for PWA manifest
// Requires no dependencies — uses built-in Node.js

import { readFileSync, writeFileSync } from "fs";
import { execSync } from "child_process";

// Check if we can use sips (macOS built-in image tool)
const sizes = [192, 512];

// Create simple PNG icons using an HTML canvas approach via a temp script
for (const size of sizes) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}">
  <rect width="${size}" height="${size}" rx="${Math.round(size * 0.21)}" fill="#0D1F0F"/>
  <text x="${size / 2}" y="${size * 0.605}" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-weight="800" font-size="${Math.round(size * 0.43)}" fill="#1B8A2E">CL</text>
  <circle cx="${size / 2}" cy="${size * 0.82}" r="${Math.round(size * 0.031)}" fill="#4ade80"/>
</svg>`;

  const outputPath = `public/icon-${size}.png`;

  try {
    // Try using sips (macOS) via temp SVG file
    const tempSvg = `/tmp/clarito-icon-${size}.svg`;
    writeFileSync(tempSvg, svg);
    execSync(
      `qlmanage -t -s ${size} -o /tmp "${tempSvg}" 2>/dev/null && mv "/tmp/clarito-icon-${size}.svg.png" "${outputPath}"`,
      { stdio: "pipe" }
    );
    console.log(`Generated ${outputPath}`);
  } catch {
    // Fallback: write the SVG and note that PNGs need manual generation
    console.log(
      `Could not auto-generate ${outputPath}. Using SVG fallback.`
    );
  }
}
