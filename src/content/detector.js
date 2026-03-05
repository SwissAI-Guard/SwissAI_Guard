// src/content/detector.js

(function() {
  const patterns = window.swissAiPatterns;
  let isEnabled = true;
  let whitelistedDomains = [];
  let securityMode = 'filter'; // 'filter' or 'block'

  // Load state from storage
  chrome.storage.local.get(['swissAiEnabled', 'swissAiWhitelistedDomains', 'swissAiSecurityMode'], function(result) {
    if (result.swissAiEnabled !== undefined) {
      isEnabled = result.swissAiEnabled;
    }
    if (result.swissAiWhitelistedDomains !== undefined) {
      whitelistedDomains = result.swissAiWhitelistedDomains;
    }
    if (result.swissAiSecurityMode !== undefined) {
      securityMode = result.swissAiSecurityMode;
    }
    checkWhitelistAndMode();
  });

  // Listen for state changes
  chrome.storage.onChanged.addListener(function(changes, namespace) {
    if (namespace === 'local') {
      if (changes.swissAiEnabled) {
        isEnabled = changes.swissAiEnabled.newValue;
      }
      if (changes.swissAiWhitelistedDomains) {
        whitelistedDomains = changes.swissAiWhitelistedDomains.newValue;
      }
      if (changes.swissAiSecurityMode) {
        securityMode = changes.swissAiSecurityMode.newValue;
      }
      checkWhitelistAndMode();
    }
  });

  function checkWhitelistAndMode() {
    const currentUrl = window.location.hostname + window.location.pathname;
    
    // Check if current URL matches any whitelisted domain
    const isWhitelisted = whitelistedDomains.some(domain => {
      return currentUrl.includes(domain);
    });

    if (isWhitelisted) {
      console.log("SwissAI Guard: Diese Domain ist auf der Whitelist (DPA). Filter deaktiviert.");
      isEnabled = false; // Temporarily disable for this page
      
      if (window.swissAiOverlay) {
        window.swissAiOverlay.showSafeBadge();
      }
      
      // Remove block overlay if it exists
      const blockOverlay = document.getElementById('swissai-block-overlay');
      if (blockOverlay) blockOverlay.remove();
      
    } else {
      // Not whitelisted
      if (securityMode === 'block' && isEnabled) {
        // Hard Block Mode
        showBlockOverlay();
      } else {
        // Filter Mode
        chrome.storage.local.get(['swissAiEnabled'], function(result) {
          isEnabled = result.swissAiEnabled !== undefined ? result.swissAiEnabled : true;
        });
        if (window.swissAiOverlay) {
          window.swissAiOverlay.hideSafeBadge();
        }
        // Remove block overlay if it exists
        const blockOverlay = document.getElementById('swissai-block-overlay');
        if (blockOverlay) blockOverlay.remove();
      }
    }
  }

  function showBlockOverlay() {
    let overlay = document.getElementById('swissai-block-overlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'swissai-block-overlay';
      overlay.style.position = 'fixed';
      overlay.style.top = '0';
      overlay.style.left = '0';
      overlay.style.width = '100vw';
      overlay.style.height = '100vh';
      overlay.style.backgroundColor = '#f5f7fa';
      overlay.style.zIndex = '2147483647'; // Max z-index
      overlay.style.display = 'flex';
      overlay.style.flexDirection = 'column';
      overlay.style.justifyContent = 'center';
      overlay.style.alignItems = 'center';
      overlay.style.fontFamily = '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif';
      
      overlay.innerHTML = `
        <div style="background: white; padding: 40px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); text-align: center; max-width: 500px;">
          <h1 style="color: #ff4d4f; margin-top: 0; font-size: 24px;">${window.swissAiI18n.t('blockTitle')}</h1>
          <p style="color: #333; font-size: 16px; line-height: 1.5; margin: 20px 0;">
            ${window.swissAiI18n.t('blockText1')}
          </p>
          <p style="color: #666; font-size: 14px; margin-bottom: 30px;">
            ${window.swissAiI18n.t('blockText2')}
          </p>
          <button id="swissai-open-options" style="background-color: #003366; color: white; border: none; padding: 12px 24px; border-radius: 4px; cursor: pointer; font-size: 14px; font-weight: bold;">
            ${window.swissAiI18n.t('blockBtn')}
          </button>
        </div>
      `;
      
      document.body.appendChild(overlay);
      
      // Stop scrolling on the body
      document.body.style.overflow = 'hidden';
      
      document.getElementById('swissai-open-options').addEventListener('click', function() {
        chrome.runtime.sendMessage({ action: "openOptions" });
      });
    }
  }

  // Local storage for mapping anonymized data back to original
  let localDataMap = {};
  let mapCounter = 1;
  
  // Reverse map to ensure the same entity gets the same placeholder
  let entityToPlaceholderMap = {};

  // Load existing session data if available
  try {
    const savedData = sessionStorage.getItem('swissAiMapData');
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      localDataMap = parsedData.localDataMap || {};
      mapCounter = parsedData.mapCounter || 1;
      entityToPlaceholderMap = parsedData.entityToPlaceholderMap || {};
      
      // If we loaded map data, show the de-anonymize button immediately
      if (Object.keys(localDataMap).length > 0 && window.swissAiOverlay) {
         // Tiny timeout to ensure DOM is ready
         setTimeout(() => {
           if (window.swissAiOverlay) window.swissAiOverlay.showDeAnonymizeButton();
         }, 1000);
      }
    }
  } catch (err) {
    console.warn("SwissAI Guard: Could not load session storage", err);
  }

  function saveMapToSession() {
    try {
      sessionStorage.setItem('swissAiMapData', JSON.stringify({
        localDataMap,
        mapCounter,
        entityToPlaceholderMap
      }));
    } catch (err) {
      console.warn("SwissAI Guard: Could not save to session storage", err);
    }
  }

  function scanText(text, applyMapping = false) {
    let hasSensitiveData = false;
    let anonymizedText = text;
    let detectedTypes = [];

    let tempMapCounter = mapCounter;
    let tempLocalDataMap = { ...localDataMap };
    let tempEntityToPlaceholderMap = { ...entityToPlaceholderMap };

    // Normalize text to handle zero-width spaces or weird newlines
    const normalizedText = text.replace(/[\u200B-\u200D\uFEFF]/g, '');
    
    let regexProtectedCount = 0;

    for (const key in patterns) {
      const pattern = patterns[key];
      pattern.regex.lastIndex = 0;
      
      if (pattern.regex.test(normalizedText)) {
        hasSensitiveData = true;
        const typeName = window.swissAiI18n ? window.swissAiI18n.t(pattern.name) : pattern.name;
        if (!detectedTypes.includes(typeName)) {
          detectedTypes.push(typeName);
        }
        
        pattern.regex.lastIndex = 0;
        
        // Custom replacement logic to build the map
        anonymizedText = anonymizedText.replace(pattern.regex, function(match, p1, p2, p3) {
          let entityToStore = match;
          let prefixToKeep = '';
          let suffixToKeep = '';
          
          // Special handling for name_greeting which uses capture groups
          if (key === 'name_greeting' || key === 'name_salutation' || key === 'name_greeting_start') {
            entityToStore = p3; // Store only the name
            prefixToKeep = `${p1}${p2}`; // Keep greeting
          } else if (key === 'name_jobtitle') {
            entityToStore = p1; // Store only the name
            suffixToKeep = match.substring(p1.length); // Keep the job title and whitespace
          } else if (key === 'name_standalone') {
            entityToStore = p2; // Store only the name
            prefixToKeep = p1 || ''; // Keep leading space
            suffixToKeep = p3 || ''; // Keep trailing characters like (s)
          }
          
          // Check if we already have a placeholder for this exact entity
          let placeholder;
          if (tempEntityToPlaceholderMap[entityToStore]) {
            placeholder = tempEntityToPlaceholderMap[entityToStore];
          } else {
            placeholder = `[${pattern.replacementPrefix}_${tempMapCounter}]`;
            tempLocalDataMap[placeholder] = entityToStore;
            tempEntityToPlaceholderMap[entityToStore] = placeholder;
            tempMapCounter++;
            regexProtectedCount++;
          }
          
          return `${prefixToKeep}${placeholder}${suffixToKeep}`;
        });
      }
    }

      // NLP Logic for Names using compromise.js
    let protectedCount = 0; // Declare it here so it's accessible whether nlp is defined or not

    if (typeof nlp !== 'undefined') {
      let doc = nlp(anonymizedText);
      
      // Extract people
      let allNames = doc.people().out('array');
      
      // Filter out empty strings, short words, and common false positives
      const falsePositives = [
        'darin', 'damit', 'daran', 'darauf', 'daraus', 'dabei', 'dafür', 'dagegen', 'dahin', 'daher', 
        'darüber', 'darunter', 'davon', 'davor', 'dazu', 'dazwischen', 'nur', 'bild nur', 'knowledge', 
        'platoform', 'platform', 'friday', 'monday', 'tuesday', 'wednesday', 'thursday', 'saturday', 'sunday', 
        'january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'
      ];
      
      allNames = allNames.filter(p => {
        // Remove punctuation
        const cleaned = p.replace(/[.,;:!?]/g, '').trim();
        // Must start with uppercase
        if (!/^[A-ZÄÖÜ]/.test(cleaned)) return false;
        // Must be longer than 2 chars
        if (cleaned.length <= 2) return false;
        // Must not be a false positive
        if (falsePositives.includes(cleaned.toLowerCase())) return false;
        // Must not be all uppercase (like acronyms WP, CEO)
        if (cleaned === cleaned.toUpperCase()) return false;
        
        return true;
      }).map(p => p.replace(/[.,;:!?]/g, '').trim()).sort((a, b) => b.length - a.length);
      
      // Deduplicate
      allNames = [...new Set(allNames)];

      allNames.forEach(personName => {
        // Make sure we don't replace inside already replaced placeholders like [PERSON_1]
        // A simple way is to use a regex with word boundaries, but we must escape the name
        const escapedName = personName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const nameRegex = new RegExp(`\\b${escapedName}\\b`, 'g');
        
        if (nameRegex.test(anonymizedText)) {
          hasSensitiveData = true;
          const nlpType = window.swissAiI18n ? window.swissAiI18n.t('person_nlp') : 'Person (NLP)';
          if (!detectedTypes.includes(nlpType)) {
            detectedTypes.push(nlpType);
          }
          
          let placeholder;
          if (tempEntityToPlaceholderMap[personName]) {
            placeholder = tempEntityToPlaceholderMap[personName];
          } else {
            placeholder = `[PERSON_${tempMapCounter}]`;
            tempLocalDataMap[placeholder] = personName;
            tempEntityToPlaceholderMap[personName] = placeholder;
            tempMapCounter++;
            protectedCount++;
          }
          
          anonymizedText = anonymizedText.replace(nameRegex, placeholder);
        }
      });
    }

    if (applyMapping && hasSensitiveData) {
      localDataMap = tempLocalDataMap;
      entityToPlaceholderMap = tempEntityToPlaceholderMap;
      mapCounter = tempMapCounter;
      
      // Save state to survive page reloads
      saveMapToSession();

      console.log("SwissAI Guard: Sensible Daten anonymisiert!", detectedTypes);
      console.log("Current Map:", localDataMap);
      
      // Send stats to background script for tracking
      const totalProtectedNow = regexProtectedCount + protectedCount;
      if (totalProtectedNow > 0 && chrome && chrome.runtime) {
        chrome.runtime.sendMessage({ 
          action: "updateStats", 
          count: totalProtectedNow 
        });
      }
      
      // Show the "De-Anonymize" button since we have data in the map
      if (window.swissAiOverlay) {
        window.swissAiOverlay.showDeAnonymizeButton();
      }
    }

    return { hasSensitiveData, anonymizedText, detectedTypes };
  }

  // Function to scan the DOM and replace placeholders with original data
  function deAnonymizeDOM() {
    if (Object.keys(localDataMap).length === 0) return;

    console.log("SwissAI Guard: De-Anonymizing DOM...");
    
    // We need to walk through text nodes to avoid breaking HTML structure
    const walk = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);
    let node;
    let nodesToReplace = [];

    while (node = walk.nextNode()) {
      // Skip script and style tags
      if (node.parentNode.tagName === 'SCRIPT' || node.parentNode.tagName === 'STYLE') continue;
      
      let text = node.nodeValue;
      let changed = false;

      for (const [placeholder, originalValue] of Object.entries(localDataMap)) {
        if (text.includes(placeholder)) {
          // Use a regex to replace all instances of the placeholder in this text node
          // Escape brackets for regex
          const escapedPlaceholder = placeholder.replace(/\[/g, '\\[').replace(/\]/g, '\\]');
          const regex = new RegExp(escapedPlaceholder, 'g');
          
          // Wrap the original value in a span to highlight it
          // Since we are in a text node, we can't inject HTML directly. 
          // We will just replace the text for now.
          text = text.replace(regex, originalValue);
          changed = true;
        }
      }

      if (changed) {
        nodesToReplace.push({ node: node, newText: text });
      }
    }

    // Apply changes
    nodesToReplace.forEach(item => {
      item.node.nodeValue = item.newText;
    });
    
    if (window.swissAiOverlay) {
      window.swissAiOverlay.hideDeAnonymizeButton();
    }
  }

  // Expose deAnonymize to the window so the overlay button can call it
  window.swissAiDeAnonymize = deAnonymizeDOM;

  function getEditableElement(target) {
    if (target.tagName === 'TEXTAREA') return target;
    if (target.isContentEditable) return target;
    if (target.closest && target.closest('[contenteditable="true"]')) {
      return target.closest('[contenteditable="true"]');
    }
    return null;
  }

  function replaceText(editable, newText) {
    if (editable.tagName === 'TEXTAREA') {
      editable.value = newText;
      editable.dispatchEvent(new Event('input', { bubbles: true }));
    } else {
      try {
        editable.focus();
        
        // Mark the whole text natively
        const selection = window.getSelection();
        const range = document.createRange();
        range.selectNodeContents(editable);
        selection.removeAllRanges();
        selection.addRange(range);

        // Force ProseMirror and React to recognize the new selection
        document.dispatchEvent(new Event('selectionchange'));

        // Fallback for some editors: also execute a native SelectAll command
        document.execCommand('selectAll', false, null);

        // trigger a native paste event.
        // It allows the editor's own internal logic to handle the state replacement without crashing.
        const dt = new DataTransfer();
        dt.setData('text/plain', newText);
        
        const pasteEvent = new ClipboardEvent('paste', {
          bubbles: true,
          cancelable: true,
          clipboardData: dt
        });
        
        const pasteHandled = !editable.dispatchEvent(pasteEvent);
        
        // If the editor didn't natively handle the paste (fallback)
        if (!pasteHandled) {
          let success = document.execCommand('insertText', false, newText);
          
          if (!success) {
             while(editable.firstChild) {
                editable.removeChild(editable.firstChild);
             }
             const p = document.createElement('p');
             p.innerText = newText;
             editable.appendChild(p);
          }
        }
        
        // Critical: Tell React that the input really did change
        const inputEvent = new InputEvent('input', {
          bubbles: true,
          cancelable: true,
          inputType: 'insertReplacementText',
          data: newText
        });
        editable.dispatchEvent(inputEvent);

      } catch (err) {
        console.error("SwissAI Guard Replace Error:", err);
      }
    }
  }

  let inputTimeout = null;

  function handleInput(event) {
    if (!isEnabled) return;

    const editable = getEditableElement(event.target);
    if (editable) {
      clearTimeout(inputTimeout);
      inputTimeout = setTimeout(() => {
        const text = editable.tagName === 'TEXTAREA' ? editable.value : editable.innerText;
        const result = scanText(text, false);

        if (result.hasSensitiveData) {
          // Show warning overlay
          if (window.swissAiOverlay) {
            window.swissAiOverlay.showWarning(result.detectedTypes);
          }
        } else {
          if (window.swissAiOverlay) {
            window.swissAiOverlay.hideWarning();
          }
        }
      }, 800); // Debounce to avoid jitter while typing
    }
  }

  function handleKeydown(event) {
    if (!isEnabled) return;

    // Intercept Enter key (often used to send messages)
    if (event.key === 'Enter' && !event.shiftKey) {
      const editable = getEditableElement(event.target);
      if (editable) {
        const text = editable.tagName === 'TEXTAREA' ? editable.value : editable.innerText;
        const result = scanText(text, false);

        if (result.hasSensitiveData) {
          event.preventDefault();
          event.stopPropagation();
          event.stopImmediatePropagation();
          
          // Ask user or auto-replace
          if (confirm(window.swissAiI18n.t('alertFound', { TYPES: result.detectedTypes.join(', ') }))) {
            try {
              const finalResult = scanText(text, true);
              replaceText(editable, finalResult.anonymizedText);
            } catch (err) {
              console.error("SwissAI Guard - Error during replacement:", err);
            } finally {
              if (window.swissAiOverlay) {
                window.swissAiOverlay.hideWarning();
              }
            }
          } else {
             // If user cancels, we might still want to prevent sending depending on strict mode.
             // But for now, we just skip replacement and allow the event (which might already be stopped, 
             // so the user has to click send again).
          }
        }
      }
    }
  }

  function handleAction(event) {
    if (!isEnabled) return;

    // Check if a send button was clicked
    const isSendButton = event.target.closest('[data-testid="send-button"]') || 
                       event.target.closest('button[data-testid*="send"]') ||
                       event.target.closest('button[aria-label*="Send"]') ||
                       event.target.closest('button[aria-label*="send"]') ||
                       event.target.closest('button[aria-label*="Senden"]') ||
                       event.target.closest('button[aria-label*="senden"]') ||
                       event.target.closest('button[aria-label*="Envoyer"]') ||
                       event.target.closest('button[aria-label*="Grok"]') ||
                       event.target.closest('button[id*="send"]') ||
                       (event.target.closest('button') && event.target.closest('button').querySelector('svg[class*="send"]')) ||
                       event.target.closest('button[data-testid="send-button"]');
                       
    if (isSendButton) {
      // Find the active input field
      const editable = document.querySelector('.ProseMirror') || 
                       document.querySelector('#prompt-textarea') || 
                       document.querySelector('rich-textarea') ||
                       document.querySelector('textarea') || 
                       document.querySelector('main [contenteditable="true"]') || 
                       document.querySelector('[contenteditable="true"]');
                       
      if (editable) {
        const text = editable.tagName === 'TEXTAREA' ? editable.value : editable.innerText;
        const result = scanText(text, false);

        if (result.hasSensitiveData) {
          event.preventDefault();
          event.stopPropagation();
          event.stopImmediatePropagation();
          
          if (confirm(window.swissAiI18n.t('alertFound', { TYPES: result.detectedTypes.join(', ') }))) {
            try {
              const finalResult = scanText(text, true);
              replaceText(editable, finalResult.anonymizedText);
            } catch (err) {
              console.error("SwissAI Guard - Error during click replacement:", err);
            } finally {
              if (window.swissAiOverlay) {
                window.swissAiOverlay.hideWarning();
              }
            }
          }
        }
      }
    }
  }

  // Attach listeners to the document using event delegation
  document.addEventListener('input', handleInput, true);
  document.addEventListener('keydown', handleKeydown, true);
  document.addEventListener('click', handleAction, true);
  document.addEventListener('pointerdown', handleAction, true);

  // Network Fallback Injector
  function injectFetchInterceptor() {
     const script = document.createElement('script');
     script.src = chrome.runtime.getURL('src/content/fetch_interceptor.js');
     script.onload = function() {
        this.remove(); // Cleanup DOM
        
        // Dynamically build a safe version of patterns that includes regex sources
        const safePatterns = {};
        for (const key in patterns) {
            if (patterns.hasOwnProperty(key)) {
                safePatterns[key] = {
                    name: patterns[key].name,
                    replacementPrefix: patterns[key].replacementPrefix,
                    regexSource: patterns[key].regex.source,
                    regexFlags: patterns[key].regex.flags,
                    warningOnly: patterns[key].warningOnly
                };
            }
        }
        
        // Send patterns securely to the injected fetch interceptor avoiding CSP errors
        window.postMessage({
            type: 'SWISS_AI_PATTERNS',
            patterns: safePatterns
        }, '*');
     };
     (document.head || document.documentElement).appendChild(script);

     window.addEventListener('swissAiNetworkBlock', function(e) {
        if (!isEnabled) return;
        const types = e.detail && e.detail.types ? e.detail.types.join(', ') : 'Unbekannt';
        // alert("🛡️ SwissAI Guard NETWORK BLOCK:\nDer Versand wurde in letzter Sekunde durch den Netzwerk-Filter gestoppt, da sensible Daten gefunden wurden: " + types);
        console.warn("SwissAI Guard: Request blocked by network filter. Types:", types);
     });
  }
  
  injectFetchInterceptor();

  console.log("SwissAI Guard: Detector initialized.");
})();