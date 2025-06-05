// YouTube Playback Manager - Background Service Worker
let activeYouTubeTabId = null;
let isExtensionEnabled = true;
let settings = {
  autoPauseOtherTabs: true,
  autoPlayActiveTab: true,
  pauseWhenInactive: true,
  darkMode: false,
  silentHours: {
    enabled: false,
    startTime: "22:00",
    endTime: "08:00"
  },
  channelWhitelist: [],
  volumeNormalization: false
};

// Initial setup
chrome.runtime.onInstalled.addListener(() => {
  // Load saved settings or set defaults
  chrome.storage.sync.get('youtubePlaybackManagerSettings', (result) => {
    if (result.youtubePlaybackManagerSettings) {
      settings = result.youtubePlaybackManagerSettings;
    } else {
      saveSettings();
    }
  });
});

// Save settings to sync
function saveSettings() {
  chrome.storage.sync.set({ 'youtubePlaybackManagerSettings': settings });
}

// Listen for messages from popup or content script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "getSettings") {
    sendResponse({ settings: settings, isEnabled: isExtensionEnabled });
  } else if (message.type === "saveSettings") {
    settings = message.settings;
    saveSettings();
    sendResponse({ success: true });
  } else if (message.type === "toggleExtension") {
    isExtensionEnabled = !isExtensionEnabled;
    sendResponse({ isEnabled: isExtensionEnabled });
  } else if (message.type === "playbackStateChanged") {
    handlePlaybackStateChange(sender.tab.id, message.isPlaying, message.channelId);
  }
  return true; // Important: enables async response
});

// Handle tab visibility changes
chrome.tabs.onActivated.addListener(async (activeInfo) => {
  if (!isExtensionEnabled) return;
  
  const tab = await chrome.tabs.get(activeInfo.tabId);
  if (tab.url && tab.url.includes("youtube.com")) {
    activeYouTubeTabId = tab.id;
    
    // Auto-play the active tab if enabled
    if (settings.autoPlayActiveTab) {
      chrome.tabs.sendMessage(tab.id, { action: "play" });
    }
  }
});

// Handle tab updates (URL changes)
browserAPI.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url && tab.url.includes("youtube.com")) {
    // Inject content script if needed
    browserAPI.scripting.executeScript({
      target: { tabId: tabId },
      files: ["content.js"]
    }).catch(err => console.error("Script injection error:", err));
  }
});

// Handle playback state changes
async function handlePlaybackStateChange(tabId, isPlaying, channelId) {
  if (!isExtensionEnabled || !settings.autoPauseOtherTabs) return;
  
  // Check if within silent hours
  if (settings.silentHours.enabled && isWithinSilentHours()) {
    return;
  }
  
  // Check if channel is whitelisted
  if (channelId && settings.channelWhitelist.includes(channelId)) {
    return;
  }
  
  if (isPlaying) {
    activeYouTubeTabId = tabId;
    
    // Pause all other YouTube tabs
    const tabs = await chrome.tabs.query({ url: "*://*.youtube.com/*" });
    tabs.forEach(tab => {
      if (tab.id !== tabId) {
        chrome.tabs.sendMessage(tab.id, { action: "pause" });
      }
    });
  }
}

// Check if current time is within silent hours
function isWithinSilentHours() {
  const now = new Date();
  const current = now.getHours() * 60 + now.getMinutes();
  
  let start = 0;
  let end = 0;
  
  if (settings.silentHours.startTime) {
    const [startHours, startMinutes] = settings.silentHours.startTime.split(":").map(Number);
    start = startHours * 60 + startMinutes;
  }
  
  if (settings.silentHours.endTime) {
    const [endHours, endMinutes] = settings.silentHours.endTime.split(":").map(Number);
    end = endHours * 60 + endMinutes;
  }
  
  if (start < end) {
    return current >= start && current <= end;
  } else {
    // Handle overnight periods (e.g., 22:00 to 08:00)
    return current >= start || current <= end;
  }
}

// Handle keyboard shortcuts
chrome.commands.onCommand.addListener((command) => {
  if (command === "toggle-youtube-control") {
    isExtensionEnabled = !isExtensionEnabled;
    // Notify popup if it's open
    chrome.runtime.sendMessage({ type: "extensionToggled", isEnabled: isExtensionEnabled });
  }
});
