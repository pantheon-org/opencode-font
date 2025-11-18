#!/usr/bin/env bun

/**
 * Font Generation Script for OpenCodeLogo
 *
 * Converts grid-based glyph system to web fonts (WOFF2, WOFF, TTF)
 * Based on the blocky text system from opencode-warcraft-notifications
 * Output: fonts/*.{woff2,woff,ttf}
 *
 * Usage:
 *   bun run scripts/generate-fonts.ts
 *   bun run generate:fonts
 */

import { existsSync, mkdirSync, writeFileSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { Readable } from 'node:stream';
import { SVGIcons2SVGFontStream } from 'svgicons2svgfont';
import svg2ttf from 'svg2ttf';
import ttf2woff from 'ttf2woff';
import ttf2woff2 from 'ttf2woff2';

// ============================================================================
// Configuration
// ============================================================================

const CONFIG = {
  fontName: 'OpenCodeLogo',
  fontHeight: 1000, // Standard font units
  descent: 200, // Below baseline
  normalize: true,
  outputDir: 'fonts',
  tempDir: 'fonts/.temp-glyphs',
  blockSize: 100, // SVG units per grid cell
};

// ============================================================================
// Glyph Type Definitions
// ============================================================================

type Glyph = {
  rows: Record<number, number[]>;
};

// ============================================================================
// Grid-based Glyph Definitions (7 rows × 4 columns)
// Based on opencode-warcraft-notifications alphabet system
// 0 = empty, 1 = filled
// ============================================================================

const GLYPHS: Record<string, { glyph: Glyph; unicode: number }> = {
  A: {
    unicode: 65,
    glyph: {
      rows: {
        0: [0, 0, 0, 0],
        1: [1, 1, 1, 1],
        2: [0, 0, 0, 1],
        3: [1, 1, 1, 1],
        4: [1, 0, 0, 1],
        5: [1, 1, 1, 1],
        6: [0, 0, 0, 0],
      },
    },
  },
  B: {
    unicode: 66,
    glyph: {
      rows: {
        0: [0, 0, 0, 0],
        1: [1, 1, 1, 1],
        2: [1, 0, 0, 1],
        3: [1, 1, 1, 1],
        4: [1, 0, 0, 1],
        5: [1, 1, 1, 1],
        6: [0, 0, 0, 0],
      },
    },
  },
  C: {
    unicode: 67,
    glyph: {
      rows: {
        0: [0, 0, 0, 0],
        1: [1, 1, 1, 1],
        2: [1, 0, 0, 0],
        3: [1, 0, 0, 0],
        4: [1, 0, 0, 0],
        5: [1, 1, 1, 1],
        6: [0, 0, 0, 0],
      },
    },
  },
  D: {
    unicode: 68,
    glyph: {
      rows: {
        0: [0, 0, 0, 0],
        1: [1, 1, 1, 1],
        2: [1, 0, 0, 1],
        3: [1, 0, 0, 1],
        4: [1, 0, 0, 1],
        5: [1, 1, 1, 1],
        6: [0, 0, 0, 0],
      },
    },
  },
  E: {
    unicode: 69,
    glyph: {
      rows: {
        0: [0, 0, 0, 0],
        1: [1, 1, 1, 1],
        2: [1, 0, 0, 0],
        3: [1, 1, 1, 0],
        4: [1, 0, 0, 0],
        5: [1, 1, 1, 1],
        6: [0, 0, 0, 0],
      },
    },
  },
  F: {
    unicode: 70,
    glyph: {
      rows: {
        0: [0, 0, 0, 0],
        1: [1, 1, 1, 1],
        2: [1, 0, 0, 0],
        3: [1, 1, 1, 0],
        4: [1, 0, 0, 0],
        5: [1, 0, 0, 0],
        6: [0, 0, 0, 0],
      },
    },
  },
  G: {
    unicode: 71,
    glyph: {
      rows: {
        0: [0, 0, 0, 0],
        1: [1, 1, 1, 1],
        2: [1, 0, 0, 0],
        3: [1, 0, 1, 1],
        4: [1, 0, 0, 1],
        5: [1, 1, 1, 1],
        6: [0, 0, 0, 0],
      },
    },
  },
  H: {
    unicode: 72,
    glyph: {
      rows: {
        0: [0, 0, 0, 0],
        1: [1, 0, 0, 1],
        2: [1, 0, 0, 1],
        3: [1, 1, 1, 1],
        4: [1, 0, 0, 1],
        5: [1, 0, 0, 1],
        6: [0, 0, 0, 0],
      },
    },
  },
  I: {
    unicode: 73,
    glyph: {
      rows: {
        0: [0, 0, 0, 0],
        1: [1, 1, 1, 1],
        2: [0, 1, 1, 0],
        3: [0, 1, 1, 0],
        4: [0, 1, 1, 0],
        5: [1, 1, 1, 1],
        6: [0, 0, 0, 0],
      },
    },
  },
  J: {
    unicode: 74,
    glyph: {
      rows: {
        0: [0, 0, 0, 0],
        1: [0, 1, 1, 1],
        2: [0, 0, 1, 0],
        3: [0, 0, 1, 0],
        4: [1, 0, 1, 0],
        5: [1, 1, 1, 0],
        6: [0, 0, 0, 0],
      },
    },
  },
  K: {
    unicode: 75,
    glyph: {
      rows: {
        0: [0, 0, 0, 0],
        1: [1, 0, 0, 1],
        2: [1, 0, 1, 0],
        3: [1, 1, 0, 0],
        4: [1, 0, 1, 0],
        5: [1, 0, 0, 1],
        6: [0, 0, 0, 0],
      },
    },
  },
  L: {
    unicode: 76,
    glyph: {
      rows: {
        0: [0, 0, 0, 0],
        1: [1, 0, 0, 0],
        2: [1, 0, 0, 0],
        3: [1, 0, 0, 0],
        4: [1, 0, 0, 0],
        5: [1, 1, 1, 1],
        6: [0, 0, 0, 0],
      },
    },
  },
  M: {
    unicode: 77,
    glyph: {
      rows: {
        0: [0, 0, 0, 0],
        1: [1, 0, 0, 1],
        2: [1, 1, 1, 1],
        3: [1, 0, 0, 1],
        4: [1, 0, 0, 1],
        5: [1, 0, 0, 1],
        6: [0, 0, 0, 0],
      },
    },
  },
  N: {
    unicode: 78,
    glyph: {
      rows: {
        0: [0, 0, 0, 0],
        1: [1, 0, 0, 1],
        2: [1, 1, 0, 1],
        3: [1, 0, 1, 1],
        4: [1, 0, 0, 1],
        5: [1, 0, 0, 1],
        6: [0, 0, 0, 0],
      },
    },
  },
  O: {
    unicode: 79,
    glyph: {
      rows: {
        0: [0, 0, 0, 0],
        1: [1, 1, 1, 1],
        2: [1, 0, 0, 1],
        3: [1, 0, 0, 1],
        4: [1, 0, 0, 1],
        5: [1, 1, 1, 1],
        6: [0, 0, 0, 0],
      },
    },
  },
  P: {
    unicode: 80,
    glyph: {
      rows: {
        0: [0, 0, 0, 0],
        1: [1, 1, 1, 1],
        2: [1, 0, 0, 1],
        3: [1, 1, 1, 1],
        4: [1, 0, 0, 0],
        5: [1, 0, 0, 0],
        6: [0, 0, 0, 0],
      },
    },
  },
  Q: {
    unicode: 81,
    glyph: {
      rows: {
        0: [0, 0, 0, 0],
        1: [1, 1, 1, 1],
        2: [1, 0, 0, 1],
        3: [1, 0, 0, 1],
        4: [1, 0, 1, 0],
        5: [1, 1, 0, 1],
        6: [0, 0, 0, 0],
      },
    },
  },
  R: {
    unicode: 82,
    glyph: {
      rows: {
        0: [0, 0, 0, 0],
        1: [1, 1, 1, 1],
        2: [1, 0, 0, 1],
        3: [1, 1, 1, 1],
        4: [1, 0, 1, 0],
        5: [1, 0, 0, 1],
        6: [0, 0, 0, 0],
      },
    },
  },
  S: {
    unicode: 83,
    glyph: {
      rows: {
        0: [0, 0, 0, 0],
        1: [1, 1, 1, 1],
        2: [1, 0, 0, 0],
        3: [1, 1, 1, 1],
        4: [0, 0, 0, 1],
        5: [1, 1, 1, 1],
        6: [0, 0, 0, 0],
      },
    },
  },
  T: {
    unicode: 84,
    glyph: {
      rows: {
        0: [0, 0, 0, 0],
        1: [1, 1, 1, 1],
        2: [0, 1, 1, 0],
        3: [0, 1, 1, 0],
        4: [0, 1, 1, 0],
        5: [0, 1, 1, 0],
        6: [0, 0, 0, 0],
      },
    },
  },
  U: {
    unicode: 85,
    glyph: {
      rows: {
        0: [0, 0, 0, 0],
        1: [1, 0, 0, 1],
        2: [1, 0, 0, 1],
        3: [1, 0, 0, 1],
        4: [1, 0, 0, 1],
        5: [1, 1, 1, 1],
        6: [0, 0, 0, 0],
      },
    },
  },
  V: {
    unicode: 86,
    glyph: {
      rows: {
        0: [0, 0, 0, 0],
        1: [1, 0, 0, 1],
        2: [1, 0, 0, 1],
        3: [1, 0, 0, 1],
        4: [1, 0, 0, 1],
        5: [0, 1, 1, 0],
        6: [0, 0, 0, 0],
      },
    },
  },
  W: {
    unicode: 87,
    glyph: {
      rows: {
        0: [0, 0, 0, 0],
        1: [1, 0, 0, 1],
        2: [1, 0, 0, 1],
        3: [1, 0, 0, 1],
        4: [1, 1, 1, 1],
        5: [1, 0, 0, 1],
        6: [0, 0, 0, 0],
      },
    },
  },
  X: {
    unicode: 88,
    glyph: {
      rows: {
        0: [0, 0, 0, 0],
        1: [1, 0, 0, 1],
        2: [0, 1, 1, 0],
        3: [0, 1, 1, 0],
        4: [0, 1, 1, 0],
        5: [1, 0, 0, 1],
        6: [0, 0, 0, 0],
      },
    },
  },
  Y: {
    unicode: 89,
    glyph: {
      rows: {
        0: [0, 0, 0, 0],
        1: [1, 0, 0, 1],
        2: [1, 0, 0, 1],
        3: [0, 1, 1, 0],
        4: [0, 1, 1, 0],
        5: [0, 1, 1, 0],
        6: [0, 0, 0, 0],
      },
    },
  },
  Z: {
    unicode: 90,
    glyph: {
      rows: {
        0: [0, 0, 0, 0],
        1: [1, 1, 1, 1],
        2: [0, 0, 1, 0],
        3: [0, 1, 0, 0],
        4: [1, 0, 0, 0],
        5: [1, 1, 1, 1],
        6: [0, 0, 0, 0],
      },
    },
  },
  // Symbols
  '-': {
    unicode: 45,
    glyph: {
      rows: {
        0: [0, 0, 0, 0],
        1: [0, 0, 0, 0],
        2: [0, 0, 0, 0],
        3: [1, 1, 1, 1],
        4: [0, 0, 0, 0],
        5: [0, 0, 0, 0],
        6: [0, 0, 0, 0],
      },
    },
  },
  '|': {
    unicode: 124,
    glyph: {
      rows: {
        0: [0, 0, 0, 0],
        1: [0, 1, 1, 0],
        2: [0, 1, 1, 0],
        3: [0, 1, 1, 0],
        4: [0, 1, 1, 0],
        5: [0, 1, 1, 0],
        6: [0, 0, 0, 0],
      },
    },
  },
  "'": {
    unicode: 39,
    glyph: {
      rows: {
        0: [0, 0, 0, 0],
        1: [0, 1, 0, 0],
        2: [0, 1, 0, 0],
        3: [0, 0, 0, 0],
        4: [0, 0, 0, 0],
        5: [0, 0, 0, 0],
        6: [0, 0, 0, 0],
      },
    },
  },
  '"': {
    unicode: 34,
    glyph: {
      rows: {
        0: [0, 0, 0, 0],
        1: [1, 0, 1, 0],
        2: [1, 0, 1, 0],
        3: [0, 0, 0, 0],
        4: [0, 0, 0, 0],
        5: [0, 0, 0, 0],
        6: [0, 0, 0, 0],
      },
    },
  },
  '?': {
    unicode: 63,
    glyph: {
      rows: {
        0: [0, 0, 0, 0],
        1: [1, 1, 1, 1],
        2: [0, 0, 0, 1],
        3: [0, 1, 1, 0],
        4: [0, 0, 0, 0],
        5: [0, 1, 1, 0],
        6: [0, 0, 0, 0],
      },
    },
  },
  '!': {
    unicode: 33,
    glyph: {
      rows: {
        0: [0, 0, 0, 0],
        1: [0, 1, 1, 0],
        2: [0, 1, 1, 0],
        3: [0, 1, 1, 0],
        4: [0, 0, 0, 0],
        5: [0, 1, 1, 0],
        6: [0, 0, 0, 0],
      },
    },
  },
};

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Convert a grid-based glyph (7 rows × 4 columns) to SVG path
 */
function gridToSVGPath(rows: Record<number, number[]>): string {
  const paths: string[] = [];
  const blockSize = CONFIG.blockSize;

  for (let row = 0; row < 7; row++) {
    const columns = rows[row] || [0, 0, 0, 0];
    for (let col = 0; col < columns.length; col++) {
      if (columns[col] === 1) {
        const x = col * blockSize;
        const y = row * blockSize;
        // Create a rectangle path for each filled cell
        paths.push(
          `M${x},${y} L${x + blockSize},${y} L${x + blockSize},${y + blockSize} L${x},${y + blockSize} Z`,
        );
      }
    }
  }

  return paths.join(' ');
}

/**
 * Generate individual SVG files for each glyph
 */
function generateGlyphSVGs(): void {
  console.log('📐 Generating SVG glyphs from grid data...');

  if (!existsSync(CONFIG.tempDir)) {
    mkdirSync(CONFIG.tempDir, { recursive: true });
  }

  let count = 0;
  for (const [char, { glyph }] of Object.entries(GLYPHS)) {
    const svgPath = gridToSVGPath(glyph.rows);
    const width = 4 * CONFIG.blockSize; // 4 columns
    const height = 7 * CONFIG.blockSize; // 7 rows

    const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <path d="${svgPath}" fill="#000000"/>
</svg>`;

    writeFileSync(join(CONFIG.tempDir, `${char}.svg`), svg);
    count++;
  }

  console.log(`✅ Generated ${count} SVG glyphs`);
}

/**
 * Generate SVG font from individual SVG glyph files
 */
async function generateSVGFont(): Promise<string> {
  console.log('🔤 Creating SVG font...');

  return new Promise((resolve, reject) => {
    const fontStream = new SVGIcons2SVGFontStream({
      fontName: CONFIG.fontName,
      fontHeight: CONFIG.fontHeight,
      descent: CONFIG.descent,
      normalize: CONFIG.normalize,
    });

    let svgFont = '';

    fontStream.on('data', (chunk: Buffer) => {
      svgFont += chunk.toString();
    });

    fontStream.on('finish', () => {
      console.log(`✅ SVG font created with ${Object.keys(GLYPHS).length} glyphs`);
      resolve(svgFont);
    });

    fontStream.on('error', (err: Error) => {
      reject(err);
    });

    // Add each glyph to the font
    for (const [char, { unicode }] of Object.entries(GLYPHS)) {
      const glyphPath = join(CONFIG.tempDir, `${char}.svg`);
      const glyphStream = new Readable();

      glyphStream.push(readFileSync(glyphPath));
      glyphStream.push(null);

      // @ts-expect-error - metadata property exists but not in types
      glyphStream.metadata = {
        unicode: [String.fromCharCode(unicode)],
        name: `glyph-${char}`,
      };

      fontStream.write(glyphStream);
    }

    fontStream.end();
  });
}

/**
 * Convert SVG font to TTF
 */
function generateTTF(svgFont: string): Buffer {
  console.log('🔨 Converting SVG font to TTF...');

  const ttf = svg2ttf(svgFont, {
    copyright: 'OpenCode Logo Font',
    description: 'Custom blocky font for OpenCode branding',
    url: 'https://opencode.ai',
  });

  console.log('✅ TTF generated');
  return Buffer.from(ttf.buffer);
}

/**
 * Convert TTF to WOFF2 (primary web format)
 */
function generateWOFF2(ttfBuffer: Buffer): Buffer {
  console.log('📦 Compressing to WOFF2...');

  const woff2Buffer = ttf2woff2(ttfBuffer);
  const compressionRatio = (
    ((ttfBuffer.length - woff2Buffer.length) / ttfBuffer.length) *
    100
  ).toFixed(1);

  console.log(`✅ WOFF2 generated (${compressionRatio}% compression)`);
  return woff2Buffer;
}

/**
 * Convert TTF to WOFF (fallback web format)
 */
function generateWOFF(ttfBuffer: Buffer): Buffer {
  console.log('📦 Compressing to WOFF...');

  const woffBuffer = Buffer.from(ttf2woff(ttfBuffer).buffer);
  const compressionRatio = (
    ((ttfBuffer.length - woffBuffer.length) / ttfBuffer.length) *
    100
  ).toFixed(1);

  console.log(`✅ WOFF generated (${compressionRatio}% compression)`);
  return woffBuffer;
}

/**
 * Save font files to output directory
 */
function saveFonts(ttf: Buffer, woff2: Buffer, woff: Buffer): void {
  console.log('💾 Saving font files...');

  if (!existsSync(CONFIG.outputDir)) {
    mkdirSync(CONFIG.outputDir, { recursive: true });
  }

  writeFileSync(join(CONFIG.outputDir, `${CONFIG.fontName}.ttf`), ttf);
  writeFileSync(join(CONFIG.outputDir, `${CONFIG.fontName}.woff2`), woff2);
  writeFileSync(join(CONFIG.outputDir, `${CONFIG.fontName}.woff`), woff);

  // Log file sizes
  console.log(`  TTF:   ${(ttf.length / 1024).toFixed(2)} KB`);
  console.log(`  WOFF2: ${(woff2.length / 1024).toFixed(2)} KB`);
  console.log(`  WOFF:  ${(woff.length / 1024).toFixed(2)} KB`);
}

/**
 * Clean up temporary files
 */
function cleanup(): void {
  console.log('🧹 Cleaning up temporary files...');

  if (existsSync(CONFIG.tempDir)) {
    const { rmSync } = require('node:fs');
    rmSync(CONFIG.tempDir, { recursive: true, force: true });
  }

  console.log('✅ Cleanup complete');
}

// ============================================================================
// Main Execution
// ============================================================================

async function main() {
  console.log('🚀 Starting font generation...\n');

  const startTime = Date.now();

  try {
    // Step 1: Generate individual SVG files from grids
    generateGlyphSVGs();

    // Step 2: Create SVG font from SVGs
    const svgFont = await generateSVGFont();

    // Step 3: Convert SVG → TTF
    const ttfBuffer = generateTTF(svgFont);

    // Step 4: Convert TTF → WOFF2/WOFF
    const woff2Buffer = generateWOFF2(ttfBuffer);
    const woffBuffer = generateWOFF(ttfBuffer);

    // Step 5: Save all formats
    saveFonts(ttfBuffer, woff2Buffer, woffBuffer);

    // Step 6: Clean up temporary files
    cleanup();

    const duration = ((Date.now() - startTime) / 1000).toFixed(2);

    console.log('\n✅ Font generation complete!');
    console.log(`📁 Output directory: ${CONFIG.outputDir}/`);
    console.log(`⏱️  Total time: ${duration}s`);
  } catch (error) {
    console.error('❌ Font generation failed:', error);
    cleanup(); // Try to clean up even on failure
    process.exit(1);
  }
}

// Error handling
process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught exception:', error);
  cleanup();
  process.exit(1);
});

process.on('unhandledRejection', (error) => {
  console.error('❌ Unhandled rejection:', error);
  cleanup();
  process.exit(1);
});

// Run if executed directly (Bun-specific check)
if (process.argv[1] === import.meta.url.replace('file://', '')) {
  main();
}
