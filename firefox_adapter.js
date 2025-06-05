// Firefox Compatibility Layer for YouTube Playback Manager
// This script provides a compatibility layer between Chrome and Firefox WebExtension APIs

// Check whether we are in Firefox
const isFirefox = typeof browser !== 'undefined';

// Create a unified API object that works in both Chrome and Firefox
const browserAPI = (() => {
  if (isFirefox) {
    // We're in Firefox, use the browser namespace
    return {
      runtime: {
        onInstalled: browser.runtime.onInstalled,
        onMessage: {
          addListener: (callback) => {
            browser.runtime.onMessage.addListener((message, sender) => {
              // Convert the Chrome callback style to Firefox's promise style
              return new Promise(resolve => {
                callback(message, sender, resolve);
              });
            });
          }
        },
        sendMessage: (message) => {
          return browser.runtime.sendMessage(message);
        }
      },
      storage: {
        sync: {
          get: (key) => {
            return new Promise((resolve) => {
              browser.storage.sync.get(key).then(result => {
                resolve(result);
              });
            });
          },
          set: (obj) => {
            return browser.storage.sync.set(obj);
          }
        }
      },
      tabs: {
        query: (queryInfo) => {
          return browser.tabs.query(queryInfo);
        },
        get: (tabId) => {
          return browser.tabs.get(tabId);
        },
        sendMessage: (tabId, message) => {
          return browser.tabs.sendMessage(tabId, message);
        },
        onActivated: browser.tabs.onActivated,
        onUpdated: browser.tabs.onUpdated
      },      scripting: {
        executeScript: (details) => {
          // Use the traditional tabs.executeScript for Firefox compatibility
          // (scripting.executeScript requires Firefox 89+)
          return browser.tabs.executeScript(
            details.target.tabId,
            { file: details.files[0] }
          );
        }
      },
      commands: {
        onCommand: browser.commands.onCommand
      }
    };
  } else {
    // We're in Chrome, use the chrome namespace with callback-to-promise conversion where needed
    return {
      runtime: {
        onInstalled: chrome.runtime.onInstalled,
        onMessage: chrome.runtime.onMessage,
        sendMessage: (message) => {
          return new Promise((resolve) => {
            chrome.runtime.sendMessage(message, (response) => {
              resolve(response);
            });
          });
        }
      },
      storage: {
        sync: {
          get: (key) => {
            return new Promise((resolve) => {
              chrome.storage.sync.get(key, (result) => {
                resolve(result);
              });
            });
          },
          set: (obj) => {
            return new Promise((resolve) => {
              chrome.storage.sync.set(obj, () => {
                resolve();
              });
            });
          }
        }
      },
      tabs: {
        query: (queryInfo) => {
          return new Promise((resolve) => {
            chrome.tabs.query(queryInfo, (tabs) => {
              resolve(tabs);
            });
          });
        },
        get: (tabId) => {
          return new Promise((resolve) => {
            chrome.tabs.get(tabId, (tab) => {
              resolve(tab);
            });
          });
        },
        sendMessage: (tabId, message) => {
          return new Promise((resolve) => {
            chrome.tabs.sendMessage(tabId, message, (response) => {
              resolve(response);
            });
          });
        },
        onActivated: chrome.tabs.onActivated,
        onUpdated: chrome.tabs.onUpdated
      },
      scripting: chrome.scripting,
      commands: {
        onCommand: chrome.commands.onCommand
      }
    };
  }
})();

// Export the browserAPI object
if (typeof module !== 'undefined') {
  module.exports = browserAPI;
}
