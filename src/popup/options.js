// src/popup/options.js

document.addEventListener('DOMContentLoaded', function() {
  const domainInput = document.getElementById('domain-input');
  const addBtn = document.getElementById('add-btn');
  const domainList = document.getElementById('domain-list');
  const statusMsg = document.getElementById('status-msg');
  const modeRadios = document.querySelectorAll('input[name="security-mode"]');

  // Load saved domains and mode
  loadSettings();

  // Handle mode change
  modeRadios.forEach(radio => {
    radio.addEventListener('change', function() {
      chrome.storage.local.set({ swissaiSecurityMode: this.value }, function() {
        showStatus(window.swissaiI18n ? window.swissaiI18n.t('optionsSaved') : 'Gespeichert!');
      });
    });
  });

  // Add new domain
  addBtn.addEventListener('click', function() {
    const domain = domainInput.value.trim().toLowerCase();
    
    if (!domain) return;

    // Basic validation to strip http:// or https://
    let cleanDomain = domain.replace(/^(https?:\/\/)?(www\.)?/, '');
    
    chrome.storage.local.get(['swissaiWhitelistedDomains'], function(result) {
      let domains = result.swissaiWhitelistedDomains || [];
      
      if (!domains.includes(cleanDomain)) {
        domains.push(cleanDomain);
        chrome.storage.local.set({ swissaiWhitelistedDomains: domains }, function() {
          domainInput.value = '';
          showStatus(window.swissaiI18n ? window.swissaiI18n.t('optionsSaved') : 'Domain erfolgreich hinzugefügt!');
          renderDomains(domains);
        });
      } else {
        showStatus('Domain existiert bereits.', true);
      }
    });
  });

  // Allow pressing Enter to add
  domainInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      addBtn.click();
    }
  });

  function loadSettings() {
    chrome.storage.local.get(['swissaiWhitelistedDomains', 'swissaiSecurityMode'], function(result) {
      const domains = result.swissaiWhitelistedDomains || [];
      renderDomains(domains);

      const mode = result.swissaiSecurityMode || 'filter';
      const radio = document.querySelector(`input[name="security-mode"][value="${mode}"]`);
      if (radio) {
        radio.checked = true;
      }
    });
  }

  function renderDomains(domains) {
    domainList.innerHTML = '';
    
    if (domains.length === 0) {
      domainList.innerHTML = `<div class="domain-item" style="color: #999; justify-content: center;">${window.swissaiI18n ? window.swissaiI18n.t('optionsWhitelistEmpty') : 'Keine Domains in der Whitelist.'}</div>`;
      return;
    }

    domains.forEach(function(domain, index) {
      const item = document.createElement('div');
      item.className = 'domain-item';
      
      const textSpan = document.createElement('span');
      textSpan.textContent = domain;
      
      const badge = document.createElement('span');
      badge.className = 'badge';
      badge.textContent = window.swissaiI18n ? window.swissaiI18n.t('overlaySafe') : 'Sicher (DPA)';
      textSpan.appendChild(badge);

      const removeBtn = document.createElement('button');
      removeBtn.className = 'remove-btn';
      removeBtn.textContent = window.swissaiI18n ? window.swissaiI18n.t('optionsWhitelistRemove') : 'Entfernen';
      removeBtn.onclick = function() {
        removeDomain(index);
      };

      item.appendChild(textSpan);
      item.appendChild(removeBtn);
      domainList.appendChild(item);
    });
  }

  function removeDomain(index) {
    chrome.storage.local.get(['swissaiWhitelistedDomains'], function(result) {
      let domains = result.swissaiWhitelistedDomains || [];
      domains.splice(index, 1);
      chrome.storage.local.set({ swissaiWhitelistedDomains: domains }, function() {
        showStatus(window.swissaiI18n ? window.swissaiI18n.t('optionsSaved') : 'Domain entfernt.');
        renderDomains(domains);
      });
    });
  }

  function showStatus(msg, isError = false) {
    statusMsg.textContent = msg;
    statusMsg.style.color = isError ? '#ff4d4f' : '#4CAF50';
    statusMsg.style.display = 'block';
    setTimeout(() => {
      statusMsg.style.display = 'none';
    }, 3000);
  }
});