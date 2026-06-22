#!/bin/bash

# ==========================================
# BKSS PLATFORM - CLEAN UPLOADS SCRIPT
# ==========================================
# This script will delete all uploaded files
# from the uploads directory
# ==========================================

echo "🧹 Cleaning uploads directory..."
echo "=================================="

# Get the script directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
UPLOADS_DIR="$SCRIPT_DIR/uploads"
SRC_UPLOADS_DIR="$SCRIPT_DIR/src/uploads"

# Check if uploads directory exists
if [ -d "$UPLOADS_DIR" ]; then
    echo "📁 Found uploads directory: $UPLOADS_DIR"
    
    # Count files before deletion
    FILE_COUNT=$(find "$UPLOADS_DIR" -type f | wc -l)
    echo "📊 Files to delete: $FILE_COUNT"
    
    if [ $FILE_COUNT -gt 0 ]; then
        echo "🗑️  Deleting files..."
        find "$UPLOADS_DIR" -type f -delete
        echo "✅ Deleted $FILE_COUNT files from $UPLOADS_DIR"
    else
        echo "ℹ️  No files to delete in $UPLOADS_DIR"
    fi
else
    echo "⚠️  Uploads directory not found: $UPLOADS_DIR"
fi

# Check src/uploads directory
if [ -d "$SRC_UPLOADS_DIR" ]; then
    echo "📁 Found src/uploads directory: $SRC_UPLOADS_DIR"
    
    # Count files before deletion
    FILE_COUNT=$(find "$SRC_UPLOADS_DIR" -type f | wc -l)
    echo "📊 Files to delete: $FILE_COUNT"
    
    if [ $FILE_COUNT -gt 0 ]; then
        echo "🗑️  Deleting files..."
        find "$SRC_UPLOADS_DIR" -type f -delete
        echo "✅ Deleted $FILE_COUNT files from $SRC_UPLOADS_DIR"
    else
        echo "ℹ️  No files to delete in $SRC_UPLOADS_DIR"
    fi
else
    echo "⚠️  src/uploads directory not found: $SRC_UPLOADS_DIR"
fi

echo ""
echo "=================================="
echo "✨ Upload cleaning complete!"
echo "=================================="
