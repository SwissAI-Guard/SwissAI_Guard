// src/utils/i18n_html.js

document.addEventListener('DOMContentLoaded', () => {
  const elements = document.querySelectorAll('[data-i18n]');
  elements.forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (window.swissAiI18n && window.swissAiI18n.t) {
      const translation = window.swissAiI18n.t(key);
      if (el.tagName === 'INPUT' && el.type === 'text') {
        el.placeholder = translation;
      } else {
        el.innerHTML = translation;
      }
    }
  });
});
