#!/bin/bash
set -e

# Script to check if GitHub Pages is configured correctly
# This ensures Pages is set to deploy from GitHub Actions (not a branch)

REPO="$1"

if [ -z "$REPO" ]; then
  echo "Error: Repository name required (e.g., 'owner/repo')"
  exit 1
fi

echo "Checking GitHub Pages configuration for $REPO..."

# Use GitHub API to check Pages configuration
RESPONSE=$(curl -s -H "Accept: application/vnd.github+json" \
  "https://api.github.com/repos/$REPO/pages")

# Check if Pages is enabled
if echo "$RESPONSE" | grep -q '"status":"built"'; then
  echo "✅ Pages is enabled"
else
  echo "⚠️  Pages may not be enabled or is not built"
fi

# Check build type (should be "workflow" for GitHub Actions)
BUILD_TYPE=$(echo "$RESPONSE" | jq -r '.build_type // "unknown"')

if [ "$BUILD_TYPE" = "workflow" ]; then
  echo "✅ Pages is correctly configured to deploy from GitHub Actions"
  exit 0
elif [ "$BUILD_TYPE" = "legacy" ]; then
  echo "❌ Pages is configured to deploy from a branch (legacy mode)"
  echo "   Please change to 'GitHub Actions' in repository settings:"
  echo "   Settings → Pages → Source → GitHub Actions"
  exit 1
else
  echo "⚠️  Could not determine Pages build type (got: $BUILD_TYPE)"
  exit 1
fi
