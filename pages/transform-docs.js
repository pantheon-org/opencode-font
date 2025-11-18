#!/usr/bin/env node

/**
 * Transform documentation from root README.md to Astro content
 *
 * This script:
 * 1. Reads README.md from the project root (../)
 * 2. Copies it to ./src/content/docs/index.md
 * 3. Maintains frontmatter and markdown formatting
 */

import { readFile, writeFile, mkdir } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const SOURCE_FILE = join(__dirname, '../README.md');
const TARGET_FILE = join(__dirname, 'src/content/docs/index.md');

/**
 * Add frontmatter to markdown if it doesn't exist
 */
function addFrontmatter(content) {
  // Check if frontmatter already exists
  if (content.startsWith('---')) {
    return content;
  }

  // Add basic frontmatter
  const frontmatter = `---
title: OpenCode Font Documentation
description: Blocky pixel-art font and text-to-SVG conversion library
---

`;
  return frontmatter + content;
}

/**
 * Main transformation process
 */
async function transform() {
  console.log('🔄 Transforming documentation...\n');
  console.log(`Source: README.md`);
  console.log(`Target: src/content/docs/index.md\n`);

  try {
    // Ensure target directory exists
    await mkdir(dirname(TARGET_FILE), { recursive: true });

    // Read source README
    const content = await readFile(SOURCE_FILE, 'utf-8');

    // Add frontmatter
    const transformedContent = addFrontmatter(content);

    // Write to target
    await writeFile(TARGET_FILE, transformedContent);

    console.log('  ✓ index.md');
    console.log('\n✅ Documentation transformation complete!');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Transformation failed:', error.message);
    process.exit(1);
  }
}

// Run transformation
transform();
