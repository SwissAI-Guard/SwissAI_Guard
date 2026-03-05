// src/content/fetch_interceptor.js

(function() {
  const originalFetch = window.fetch;
  let interceptorPatterns = {};

  window.addEventListener('message', function(event) {
    if (event.source !== window || !event.data || event.data.type !== 'SWISS_AI_PATTERNS') {
      return;
    }
    interceptorPatterns = event.data.patterns;
  });
  
  function scanTextInterceptor(text) {
     let hasSensitiveData = false;
     let detectedTypes = [];
     const normalizedText = typeof text === 'string' ? text.replace(/[\u200B-\u200D\uFEFF]/g, '') : '';
     
     for (const key in interceptorPatterns) {
       const pattern = interceptorPatterns[key];
       const regex = new RegExp(pattern.regexSource, pattern.regexFlags);
       if (regex.test(normalizedText)) {
          if (!pattern.warningOnly) {
             hasSensitiveData = true;
          }
          detectedTypes.push(pattern.name);
       }
     }
     return { hasSensitiveData, detectedTypes };
  }

  window.fetch = async function(...args) {
    const [resource, config] = args;
    
    let url = '';
    let method = '';
    let bodyPromise = null;

    if (resource instanceof Request) {
        url = resource.url || '';
        method = resource.method || 'GET';
        if (method.toUpperCase() === 'POST') {
             bodyPromise = resource.clone().text().catch(() => '');
        }
    } else {
        url = typeof resource === 'string' ? resource : (resource && resource.toString ? resource.toString() : '');
        if (config) {
             method = config.method || 'GET';
             if (method.toUpperCase() === 'POST' && config.body) {
                 if (typeof config.body === 'string') {
                     bodyPromise = Promise.resolve(config.body);
                 } else {
                     bodyPromise = Promise.resolve(config.body.toString());
                 }
             }
        }
    }
    
    if (bodyPromise) {
      const isChatGPT = url.includes('/backend-api/conversation');
      const isClaude = url.includes('/api/append_message');
      const isGemini = url.includes('CreateGenericMessage');
      const isGrok = url.includes('/api/chat/send');

      if (isChatGPT || isClaude || isGemini || isGrok) {
        try {
          const bodyStr = await bodyPromise;
          
          if (bodyStr && Object.keys(interceptorPatterns).length > 0) {
             const result = scanTextInterceptor(bodyStr);
             if (result && result.hasSensitiveData) {
                window.dispatchEvent(new CustomEvent('swissAiNetworkBlock', { 
                   detail: { 
                      types: result.detectedTypes 
                   } 
                }));
                throw new Error("SwissAI Guard: Request blocked at Network level due to sensitive data.");
             }
          }
        } catch (err) {
           if (err.message && err.message.includes("SwissAI Guard")) {
              return Promise.reject(new TypeError("Blocked by SwissAI Guard add-on."));
           }
        }
      }
    }
    
    return originalFetch.apply(this, args);
  };
})();
