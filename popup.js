// YouTube Playback Manager - Popup Script
document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const extensionToggle = document.getElementById('extension-toggle');
  const autoPauseToggle = document.getElementById('auto-pause-toggle');
  const autoPlayToggle = document.getElementById('auto-play-toggle');
  const pauseInactiveToggle = document.getElementById('pause-inactive-toggle');
  const darkModeToggle = document.getElementById('dark-mode-toggle');
  const silentHoursToggle = document.getElementById('silent-hours-toggle');
  const silentStartTime = document.getElementById('silent-start-time');
  const silentEndTime = document.getElementById('silent-end-time');
  const volumeNormToggle = document.getElementById('volume-norm-toggle');
  const channelInput = document.getElementById('channel-input');
  const addChannelBtn = document.getElementById('add-channel-btn');
  const whitelistEntries = document.getElementById('whitelist-entries');
  
  // Settings object
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
  
  let isExtensionEnabled = true;
  
  // Initialize popup
  function initialize() {
    loadSettings();
    setupEventListeners();
    setupAccordion();
  }
  
  // Load settings from storage
  function loadSettings() {
    chrome.runtime.sendMessage({ type: "getSettings" }, (response) => {
      if (response) {
        settings = response.settings;
        isExtensionEnabled = response.isEnabled;
        updateUI();
      }
    });
  }
  
  // Update UI based on settings
  function updateUI() {
    // Set extension toggle
    extensionToggle.checked = isExtensionEnabled;
    
    // Set basic toggles
    autoPauseToggle.checked = settings.autoPauseOtherTabs;
    autoPlayToggle.checked = settings.autoPlayActiveTab;
    pauseInactiveToggle.checked = settings.pauseWhenInactive;
    
    // Set advanced toggles
    darkModeToggle.checked = settings.darkMode;
    silentHoursToggle.checked = settings.silentHours.enabled;
    silentStartTime.value = settings.silentHours.startTime;
    silentEndTime.value = settings.silentHours.endTime;
    volumeNormToggle.checked = settings.volumeNormalization;
    
    // Apply dark mode if enabled
    if (settings.darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
    
    // Populate channel whitelist
    updateWhitelistUI();
  }
  
  // Update channel whitelist UI
  function updateWhitelistUI() {
    whitelistEntries.innerHTML = '';
    
    if (settings.channelWhitelist.length === 0) {
      const emptyMsg = document.createElement('div');
      emptyMsg.className = 'whitelist-empty';
      emptyMsg.textContent = 'No channels whitelisted';
      whitelistEntries.appendChild(emptyMsg);
      return;
    }
    
    settings.channelWhitelist.forEach((channelId, index) => {
      const entry = document.createElement('div');
      entry.className = 'whitelist-entry';
      
      const channelText = document.createElement('span');
      channelText.textContent = formatChannelId(channelId);
      
      const removeBtn = document.createElement('button');
      removeBtn.className = 'remove-channel';
      removeBtn.textContent = '✕';
      removeBtn.dataset.index = index;
      removeBtn.addEventListener('click', removeWhitelistedChannel);
      
      entry.appendChild(channelText);
      entry.appendChild(removeBtn);
      whitelistEntries.appendChild(entry);
    });
  }
  
  // Format channel ID for display
  function formatChannelId(channelId) {
    // Truncate if too long
    if (channelId.length > 20) {
      return channelId.substring(0, 10) + '...' + channelId.substring(channelId.length - 10);
    }
    return channelId;
  }
  
  // Extract channel ID from URL
  function extractChannelIdFromUrl(url) {
    try {
      // Try to get channel ID from URL
      const urlObj = new URL(url);
      if (!urlObj.hostname.includes('youtube.com')) {
        return null;
      }
      
      // Channel URL format
      const channelMatch = urlObj.pathname.match(/\/channel\/([\w-]+)/);
      if (channelMatch) {
        return channelMatch[1];
      }
      
      // If it's not a channel URL, return null
      return null;
    } catch (e) {
      // If the input is not a valid URL, assume it's an ID
      return url.trim();
    }
  }
  
  // Add channel to whitelist
  function addWhitelistedChannel() {
    const channelIdOrUrl = channelInput.value.trim();
    if (!channelIdOrUrl) return;
    
    const channelId = extractChannelIdFromUrl(channelIdOrUrl);
    if (!channelId) {
      alert('Invalid channel URL or ID');
      return;
    }
    
    // Don't add duplicates
    if (settings.channelWhitelist.includes(channelId)) {
      alert('This channel is already whitelisted');
      return;
    }
    
    // Add to whitelist
    settings.channelWhitelist.push(channelId);
    saveSettings();
    
    // Clear input
    channelInput.value = '';
    updateWhitelistUI();
  }
  
  // Remove channel from whitelist
  function removeWhitelistedChannel(event) {
    const index = parseInt(event.target.dataset.index);
    settings.channelWhitelist.splice(index, 1);
    saveSettings();
    updateWhitelistUI();
  }
  
  // Save settings to storage
  function saveSettings() {
    chrome.runtime.sendMessage({
      type: "saveSettings",
      settings: settings
    });
  }
  
  // Toggle extension on/off
  function toggleExtension() {
    chrome.runtime.sendMessage({ type: "toggleExtension" }, (response) => {
      if (response) {
        isExtensionEnabled = response.isEnabled;
      }
    });
  }
    // Setup accordion functionality and tab navigation
  function setupAccordion() {
    const accordions = document.querySelectorAll('.accordion');
    
    accordions.forEach(accordion => {
      const header = accordion.querySelector('.accordion-header');
      
      header.addEventListener('click', () => {
        accordion.classList.toggle('active');
      });
    });
    
    // Setup external links to open in browser
    const externalLinks = document.querySelectorAll('.developer-info a, .support-link a');
    externalLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        chrome.tabs.create({ url: link.href });
      });
    });
    
    // Setup tab navigation
    const tabButtons = document.querySelectorAll('.nav-tab');
    tabButtons.forEach(button => {
      button.addEventListener('click', () => {
        // Remove active class from all tabs
        tabButtons.forEach(btn => btn.classList.remove('active'));
        
        // Add active class to clicked tab
        button.classList.add('active');
        
        // Hide all settings sections
        document.querySelectorAll('.settings-section').forEach(section => {
          section.classList.remove('active-section');
        });
        
        // Show the selected settings section
        const tabName = button.getAttribute('data-tab');
        document.getElementById(tabName + '-settings').classList.add('active-section');
      });
    });
  }
  
  // Setup event listeners
  function setupEventListeners() {
    // Extension toggle
    extensionToggle.addEventListener('change', () => {
      isExtensionEnabled = extensionToggle.checked;
      toggleExtension();
    });
    
    // Basic toggles
    autoPauseToggle.addEventListener('change', () => {
      settings.autoPauseOtherTabs = autoPauseToggle.checked;
      saveSettings();
    });
    
    autoPlayToggle.addEventListener('change', () => {
      settings.autoPlayActiveTab = autoPlayToggle.checked;
      saveSettings();
    });
    
    pauseInactiveToggle.addEventListener('change', () => {
      settings.pauseWhenInactive = pauseInactiveToggle.checked;
      saveSettings();
    });
    
    // Advanced toggles
    darkModeToggle.addEventListener('change', () => {
      settings.darkMode = darkModeToggle.checked;
      if (darkModeToggle.checked) {
        document.body.classList.add('dark-mode');
      } else {
        document.body.classList.remove('dark-mode');
      }
      saveSettings();
    });
    
    silentHoursToggle.addEventListener('change', () => {
      settings.silentHours.enabled = silentHoursToggle.checked;
      saveSettings();
    });
    
    silentStartTime.addEventListener('change', () => {
      settings.silentHours.startTime = silentStartTime.value;
      saveSettings();
    });
    
    silentEndTime.addEventListener('change', () => {
      settings.silentHours.endTime = silentEndTime.value;
      saveSettings();
    });
    
    volumeNormToggle.addEventListener('change', () => {
      settings.volumeNormalization = volumeNormToggle.checked;
      saveSettings();
    });
    
    // Channel whitelist
    addChannelBtn.addEventListener('click', addWhitelistedChannel);
    channelInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        addWhitelistedChannel();
      }
    });
    
    // Listen for extension toggle from background
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      if (message.type === "extensionToggled") {
        isExtensionEnabled = message.isEnabled;
        extensionToggle.checked = isExtensionEnabled;
      }
    });
  }
  
  // Start initialization
  initialize();
});
