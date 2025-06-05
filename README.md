# YouTube Playback Manager

A Chrome extension that intelligently manages YouTube tab playback for a better viewing experience.

## Features

### Core Features
- **Auto-pause other YouTube tabs**: When you start playing a YouTube video, all other YouTube videos in other tabs will automatically pause
- **Auto-play on active tab**: Videos will automatically play when you switch to their tab
- **Pause when inactive**: Videos will automatically pause when you switch to another tab
- **Dark/Light mode toggle**: Choose your preferred popup theme
- **YouTube domain specific**: Only runs on YouTube domains to preserve your privacy and performance

### Advanced Features
- **Silent Hours**: Disable auto-pausing during specific hours (great for overnight playlists)
- **Channel Whitelist**: Specify channels that should be excluded from auto-pausing
- **Volume Normalization**: Keep volume consistent across different videos
- **Chrome Sync**: All settings are synced across your devices
- **Keyboard Shortcuts**: Toggle the extension on/off with a keyboard shortcut (Ctrl+Shift+Y)

## Installation

### Install from Chrome Web Store (Recommended)
1. Visit the [Chrome Web Store](#) (coming soon)
2. Click "Add to Chrome"
3. Click "Add Extension" in the confirmation dialog

### Manual Installation (Developer Mode)
1. Download or clone this repository
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" using the toggle in the top-right corner
4. Click "Load unpacked" and select the extension folder
5. The extension should now appear in your extensions list and in the toolbar

### Firefox Installation
A Firefox version is planned but not yet available. The current code would require modifications to work with Firefox's extension API.

To adapt this extension for Firefox:
1. Replace `chrome.` API calls with `browser.`
2. Update the manifest.json to use Firefox's format
3. Use polyfills for any Chrome-specific APIs
4. Test thoroughly on Firefox

## Usage

1. Click on the extension icon in your toolbar to access settings
2. Enable/disable the extension using the main toggle
3. Configure settings according to your preferences
4. Use the keyboard shortcut (Ctrl+Shift+Y) to quickly toggle the extension on/off

## Privacy

This extension:
- Only runs on YouTube domains
- Does not collect any user data
- Does not use analytics or tracking
- Does not communicate with any external servers
- All settings are stored locally and synced via Chrome Sync only

## Developer

👨‍💻 Developer
Made with ❤️ by Yogeshwar Kumar

🔗 GitHub: [github.com/inyogeshwar](https://github.com/inyogeshwar)

☕ Ko-fi (Support Me): [ko-fi.com/yogeshwarkumar](https://ko-fi.com/yogeshwarkumar)

## License

MIT License - See LICENSE file for details

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Support

If you encounter any issues or have questions, please [open an issue](https://github.com/inyogeshwar/youtube-playback-manager/issues) on GitHub.
