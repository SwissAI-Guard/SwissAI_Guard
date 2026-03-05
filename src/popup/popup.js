// src/popup/popup.js

document.addEventListener('DOMContentLoaded', function() {
  const toggleSwitch = document.getElementById('toggle-switch');
  const statusText = document.getElementById('status-text');

  // Load current state
  chrome.storage.local.get(['swissAiEnabled', 'swissAiStats'], function(result) {
    if (result.swissAiEnabled !== undefined) {
      toggleSwitch.checked = result.swissAiEnabled;
      updateStatusText(result.swissAiEnabled);
    }
    
    // Update stats
    if (result.swissAiStats) {
      const stats = result.swissAiStats;
      const now = new Date();
      const lastUpdated = stats.lastUpdated ? new Date(stats.lastUpdated) : now;
      
      // Calculate today's stats if dates match, otherwise 0
      let todayCount = stats.todayProtected || 0;
      if (now.toDateString() !== lastUpdated.toDateString()) {
        todayCount = 0;
      }
      
      document.getElementById('stat-today').textContent = todayCount;
      document.getElementById('stat-total').textContent = stats.totalProtected || 0;
    }
  });

  // Handle toggle
  toggleSwitch.addEventListener('change', function() {
    const isEnabled = toggleSwitch.checked;
    chrome.storage.local.set({ swissAiEnabled: isEnabled }, function() {
      updateStatusText(isEnabled);
    });
  });

  // Open options page
  const optionsBtn = document.getElementById('options-btn');
  if (optionsBtn) {
    optionsBtn.addEventListener('click', function() {
      if (chrome.runtime.openOptionsPage) {
        chrome.runtime.openOptionsPage();
      } else {
        window.open(chrome.runtime.getURL('src/popup/options.html'));
      }
    });
  }

  function updateStatusText(isEnabled) {
    if (isEnabled) {
      statusText.textContent = window.swissAiI18n ? window.swissAiI18n.t('popupStatusActive') : 'Schutz aktiv';
      statusText.style.color = '#4CAF50';
    } else {
      statusText.textContent = window.swissAiI18n ? window.swissAiI18n.t('popupStatusInactive') : 'Schutz inaktiv';
      statusText.style.color = '#f44336';
    }
  }
});