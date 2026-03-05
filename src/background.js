// src/background.js

// Initialize stats if they don't exist
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.get(['swissAiStats'], function(result) {
    if (result.swissAiStats === undefined) {
      chrome.storage.local.set({ 
        swissAiStats: {
          totalProtected: 0,
          lastUpdated: new Date().toISOString()
        }
      });
    }
  });
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === "openOptions") {
    if (chrome.runtime.openOptionsPage) {
      chrome.runtime.openOptionsPage();
    } else {
      window.open(chrome.runtime.getURL('src/popup/options.html'));
    }
  } else if (request.action === "updateStats") {
    chrome.storage.local.get(['swissAiStats'], function(result) {
      let stats = result.swissAiStats || { totalProtected: 0 };
      
      // Reset daily counter if it's a new day
      const now = new Date();
      const lastUpdated = stats.lastUpdated ? new Date(stats.lastUpdated) : now;
      
      if (now.toDateString() !== lastUpdated.toDateString()) {
        stats.todayProtected = 0;
      } else {
        stats.todayProtected = stats.todayProtected || 0;
      }

      stats.totalProtected += request.count;
      stats.todayProtected += request.count;
      stats.lastUpdated = now.toISOString();

      chrome.storage.local.set({ swissAiStats: stats });
    });
  }
});