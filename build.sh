#!/bin/bash

# Build script for YouTube Playback Manager extension
# Creates zip files for both Chrome and Firefox

echo "Building YouTube Playback Manager extension..."

# Make sure we're in the right directory
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$DIR"

# Create build directory if it doesn't exist
mkdir -p build

# Chrome version
echo "Building Chrome extension..."
zip -r build/youtube-playback-manager-chrome.zip \
    manifest.json \
    background.js \
    content.js \
    popup.html \
    popup.js \
    popup.css \
    icons/*.png \
    README.md

# Firefox version
echo "Building Firefox extension..."
cp manifest_firefox.json manifest_temp.json
zip -r build/youtube-playback-manager-firefox.zip \
    manifest_temp.json \
    firefox_adapter.js \
    background.js \
    content.js \
    popup.html \
    popup.js \
    popup.css \
    icons/*.png \
    README.md
rm manifest_temp.json

echo "Build complete!"
echo "Chrome extension: build/youtube-playback-manager-chrome.zip"
echo "Firefox extension: build/youtube-playback-manager-firefox.zip"
echo ""
echo "To install in Chrome:"
echo "1. Go to chrome://extensions/"
echo "2. Enable Developer Mode"
echo "3. Drag and drop the zip file into the browser window"
echo ""
echo "To install in Firefox:"
echo "1. Go to about:debugging"
echo "2. Click 'This Firefox'"
echo "3. Click 'Load Temporary Add-on...'"
echo "4. Select the zip file"
