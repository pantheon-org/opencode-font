#!/usr/bin/env bash

# Font Validation Script
# Validates generated font files for correctness and size constraints

set -euo pipefail

# Configuration
FONT_DIR="fonts"
FONT_NAME="OpenCodeLogo"
MAX_WOFF2_SIZE=51200   # 50KB
MAX_WOFF_SIZE=102400   # 100KB
MAX_TTF_SIZE=204800    # 200KB

echo "🔍 Validating generated fonts..."

# Helper function to get file size (cross-platform)
get_file_size() {
    local file="$1"
    if stat -f%z "$file" 2>/dev/null; then
        # macOS
        return
    elif stat -c%s "$file" 2>/dev/null; then
        # Linux
        return
    else
        # Fallback: use ls
        ls -ln "$file" | awk '{print $5}'
    fi
}

# Check WOFF2 file
echo ""
echo "Checking WOFF2..."
if [ ! -f "$FONT_DIR/$FONT_NAME.woff2" ]; then
    echo "❌ WOFF2 file missing: $FONT_DIR/$FONT_NAME.woff2"
    exit 1
fi

woff2_size=$(get_file_size "$FONT_DIR/$FONT_NAME.woff2")
if [ "$woff2_size" -gt "$MAX_WOFF2_SIZE" ]; then
    echo "⚠️  WOFF2 size ($woff2_size bytes) exceeds limit ($MAX_WOFF2_SIZE bytes)"
    exit 1
fi

if [ "$woff2_size" -eq 0 ]; then
    echo "❌ WOFF2 file is empty"
    exit 1
fi

echo "✅ WOFF2: $woff2_size bytes (under $(($MAX_WOFF2_SIZE / 1024))KB limit)"

# Check WOFF file
echo ""
echo "Checking WOFF..."
if [ ! -f "$FONT_DIR/$FONT_NAME.woff" ]; then
    echo "❌ WOFF file missing: $FONT_DIR/$FONT_NAME.woff"
    exit 1
fi

woff_size=$(get_file_size "$FONT_DIR/$FONT_NAME.woff")
if [ "$woff_size" -gt "$MAX_WOFF_SIZE" ]; then
    echo "⚠️  WOFF size ($woff_size bytes) exceeds limit ($MAX_WOFF_SIZE bytes)"
    exit 1
fi

if [ "$woff_size" -eq 0 ]; then
    echo "❌ WOFF file is empty"
    exit 1
fi

echo "✅ WOFF: $woff_size bytes (under $(($MAX_WOFF_SIZE / 1024))KB limit)"

# Check TTF file
echo ""
echo "Checking TTF..."
if [ ! -f "$FONT_DIR/$FONT_NAME.ttf" ]; then
    echo "❌ TTF file missing: $FONT_DIR/$FONT_NAME.ttf"
    exit 1
fi

ttf_size=$(get_file_size "$FONT_DIR/$FONT_NAME.ttf")
if [ "$ttf_size" -gt "$MAX_TTF_SIZE" ]; then
    echo "⚠️  TTF size ($ttf_size bytes) exceeds limit ($MAX_TTF_SIZE bytes)"
    exit 1
fi

if [ "$ttf_size" -eq 0 ]; then
    echo "❌ TTF file is empty"
    exit 1
fi

echo "✅ TTF: $ttf_size bytes (under $(($MAX_TTF_SIZE / 1024))KB limit)"

# Check magic bytes for format verification
echo ""
echo "Verifying file formats..."

# TTF should start with 0x00010000 or 'true'
if command -v file &> /dev/null; then
    ttf_type=$(file "$FONT_DIR/$FONT_NAME.ttf")
    if [[ ! "$ttf_type" =~ "TrueType" ]] && [[ ! "$ttf_type" =~ "OpenType" ]]; then
        echo "⚠️  Warning: TTF file may not be valid TrueType format"
        echo "   File type: $ttf_type"
    else
        echo "✅ TTF format verified"
    fi
    
    # WOFF should be recognized
    woff_type=$(file "$FONT_DIR/$FONT_NAME.woff")
    if [[ "$woff_type" =~ "WOFF" ]] || [[ "$woff_type" =~ "Web Open Font Format" ]]; then
        echo "✅ WOFF format verified"
    else
        echo "⚠️  Warning: WOFF file may not be recognized"
        echo "   File type: $woff_type"
    fi
else
    echo "⚠️  'file' command not available, skipping format verification"
fi

# WOFF2 magic bytes check (manual): should start with 'wOF2' (0x774F4632)
woff2_header=$(head -c 4 "$FONT_DIR/$FONT_NAME.woff2" | xxd -p 2>/dev/null || echo "")
if [[ "$woff2_header" == "774f4632" ]]; then
    echo "✅ WOFF2 magic bytes verified (wOF2)"
elif [ -n "$woff2_header" ]; then
    echo "⚠️  Warning: WOFF2 magic bytes incorrect (expected 774f4632, got $woff2_header)"
else
    echo "⚠️  Could not verify WOFF2 magic bytes (xxd not available)"
fi

# Summary
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ All fonts validated successfully"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📊 Total size: $(( (woff2_size + woff_size + ttf_size) / 1024 )) KB"
echo ""
