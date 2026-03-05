// src/content/ui_overlay.js

(function() {
  const overlayId = 'swissai-guard-overlay';
  const safeBadgeId = 'swissai-safe-badge';
  const deAnonymizeBtnId = 'swissai-deanonymize-btn';
  const glossaryId = 'swissai-glossary';

  function createOverlay() {
    let overlay = document.getElementById(overlayId);
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = overlayId;
      overlay.style.position = 'fixed';
      overlay.style.bottom = '20px';
      overlay.style.right = '20px';
      overlay.style.backgroundColor = '#ff4d4f';
      overlay.style.color = 'white';
      overlay.style.padding = '10px 15px';
      overlay.style.borderRadius = '5px';
      overlay.style.fontFamily = 'Arial, sans-serif';
      overlay.style.fontSize = '14px';
      overlay.style.zIndex = '999999';
      overlay.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
      overlay.style.display = 'none';
      overlay.style.pointerEvents = 'none'; // Don't block clicks
      document.body.appendChild(overlay);
    }
    return overlay;
  }

  function createSafeBadge() {
    let badge = document.getElementById(safeBadgeId);
    if (!badge) {
      badge = document.createElement('div');
      badge.id = safeBadgeId;
      badge.style.position = 'fixed';
      badge.style.bottom = '20px';
      badge.style.right = '20px';
      badge.style.backgroundColor = '#e6f7ff';
      badge.style.color = '#1890ff';
      badge.style.border = '1px solid #91d5ff';
      badge.style.padding = '8px 12px';
      badge.style.borderRadius = '20px';
      badge.style.fontFamily = 'Arial, sans-serif';
      badge.style.fontSize = '12px';
      badge.style.zIndex = '999998';
      badge.style.boxShadow = '0 2px 4px rgba(0,0,0,0.05)';
      badge.style.display = 'none';
      badge.style.pointerEvents = 'none';
      badge.innerHTML = window.swissAiI18n.t('overlaySafe');
      document.body.appendChild(badge);
    }
    return badge;
  }

  function createDeAnonymizeButton() {
    let btn = document.getElementById(deAnonymizeBtnId);
    if (!btn) {
      btn = document.createElement('button');
      btn.id = deAnonymizeBtnId;
      btn.style.position = 'fixed';
      btn.style.bottom = '60px'; // Above the safe badge
      btn.style.right = '20px';
      btn.style.backgroundColor = '#003366';
      btn.style.color = 'white';
      btn.style.border = 'none';
      btn.style.padding = '10px 15px';
      btn.style.borderRadius = '5px';
      btn.style.fontFamily = 'Arial, sans-serif';
      btn.style.fontSize = '14px';
      btn.style.zIndex = '999997';
      btn.style.boxShadow = '0 4px 6px rgba(0,0,0,0.2)';
      btn.style.display = 'none';
      btn.style.cursor = 'pointer';
      btn.innerHTML = window.swissAiI18n.t('overlayDeanonymize');
      
      btn.addEventListener('click', function() {
        if (window.swissAiDeAnonymize) {
          window.swissAiDeAnonymize();
        }
      });
      
      document.body.appendChild(btn);
    }
    return btn;
  }

  window.swissAiOverlay = {
    showWarning: function(detectedTypes) {
      const overlay = createOverlay();
      overlay.innerHTML = window.swissAiI18n.t('overlayWarning', { TYPES: detectedTypes.join(', ') });
      overlay.style.display = 'block';
    },
    hideWarning: function() {
      const overlay = document.getElementById(overlayId);
      if (overlay) {
        overlay.style.display = 'none';
      }
    },
    showSafeBadge: function() {
      const badge = createSafeBadge();
      badge.style.display = 'block';
    },
    hideSafeBadge: function() {
      const badge = document.getElementById(safeBadgeId);
      if (badge) {
        badge.style.display = 'none';
      }
    },
    showDeAnonymizeButton: function() {
      const btn = createDeAnonymizeButton();
      btn.style.display = 'block';
    },
    hideDeAnonymizeButton: function() {
      const btn = document.getElementById(deAnonymizeBtnId);
      if (btn) {
        btn.style.display = 'none';
      }
    }
  };
})();