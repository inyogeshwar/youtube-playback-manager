// YouTube Playback Manager - Content Script
(function() { // IIFE to create an isolated scope

let settings = {};
let isExtensionEnabled = true;
let currentChannelId = null;
let videoElement = null;
let originalVolume = null;

// Initialize content script
function initialize() {
  // Get settings from background script
  chrome.runtime.sendMessage({ type: "getSettings" }, (response) => {
    if (response) {
      settings = response.settings;
      isExtensionEnabled = response.isEnabled;
    }
    setupVideoListeners();
    extractChannelId();
  });

  // Listen for messages from background script
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (!isExtensionEnabled) return;
    
    if (message.action === "play") {
      playVideo();
    } else if (message.action === "pause") {
      pauseVideo();
    }
  });
}

// Setup video element listeners
function setupVideoListeners() {
  // Find or wait for video element
  findVideoElement();
  
  // Watch for DOM changes to find video if not immediately available
  const observer = new MutationObserver(mutations => {
    if (!videoElement) {
      findVideoElement();
    }
  });
  
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
  
  // Handle visibility change
  document.addEventListener('visibilitychange', () => {
    if (!isExtensionEnabled) return;
    
    if (document.hidden && settings.pauseWhenInactive) {
      pauseVideo();
    } else if (!document.hidden && settings.autoPlayActiveTab) {
      playVideo();
    }
  });
}

// Find video element on page
function findVideoElement() {
  videoElement = document.querySelector('video');
  if (videoElement) {
    // Store original volume
    originalVolume = videoElement.volume;
    
    // Add play/pause listeners
    videoElement.addEventListener('play', () => {
      if (!isExtensionEnabled) return;
      
      if (settings.volumeNormalization) {
        applyVolumeNormalization();
      }
      
      chrome.runtime.sendMessage({
        type: "playbackStateChanged",
        isPlaying: true,
        channelId: currentChannelId
      });
    });
    
    videoElement.addEventListener('pause', () => {
      if (!isExtensionEnabled) return;
      
      chrome.runtime.sendMessage({
        type: "playbackStateChanged",
        isPlaying: false,
        channelId: currentChannelId
      });
    });
  }
}

// Extract channel ID from page
function extractChannelId() {
  // Look for channel ID in various places on YouTube page
  const metaTag = document.querySelector('meta[itemprop="channelId"]');
  if (metaTag) {
    currentChannelId = metaTag.content;
    return;
  }
  
  // Try URL-based extraction
  const channelUrlPattern = /youtube\.com\/channel\/([\w-]+)/;
  const match = window.location.href.match(channelUrlPattern);
  if (match) {
    currentChannelId = match[1];
    return;
  }
  
  // For video pages, look at owner details
  const ownerLink = document.querySelector('a[href*="/channel/"]');
  if (ownerLink) {
    const ownerMatch = ownerLink.href.match(channelUrlPattern);
    if (ownerMatch) {
      currentChannelId = ownerMatch[1];
    }
  }
}

// Play video
function playVideo() {
  if (videoElement && videoElement.paused) {
    try {
      videoElement.play().catch(e => console.log('Error playing video:', e));
    } catch (e) {
      console.error('Error playing video:', e);
    }
  }
}

// Pause video
function pauseVideo() {
  if (videoElement && !videoElement.paused) {
    try {
      videoElement.pause();
    } catch (e) {
      console.error('Error pausing video:', e);
    }
  }
}

// Apply volume normalization
function applyVolumeNormalization() {
  if (!videoElement || !settings.volumeNormalization) return;
  
  // Simple volume normalization - set to 70% of original volume
  // A real implementation would analyze audio levels but that's complex  const normalizedVolume = Math.min(0.7, originalVolume);
  videoElement.volume = normalizedVolume;
}

// Start initialization
initialize();

})(); // End of IIFE
