(function () {
  'use strict';
  
  console.log('[YT Queue QR] Script loading...');
  
  // Prevent multiple injections
  if (window.ytqrInjected) {
    console.log('[YT Queue QR] Already injected, skipping');
    return;
  }
  window.ytqrInjected = true;

  const SESSION_ID = 'default_session';
  const BASE_URL = 'https://dieplehealthy.github.io/karaoke';
  const INIT_TIMEOUT = 15000;
  const MIN_DELAY = 2000;
  
  let initialized = false;
  let observer = null;
  let observerActive = false;
  let initTimeout = null;

  /**
   * Load QRCode library from CDN
   */
  function initializeQRCodeLibrary() {
    console.log('[YT Queue QR] Initializing QRCode library');
    
    if (window.QRCode) {
      console.log('[YT Queue QR] QRCode already available');
      return Promise.resolve(true);
    }
    
    return new Promise((resolve) => {
      try {
        // Use a CDN for QR code generation that doesn't require external dependencies
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js';
        script.async = true;
        
        let loaded = false;
        
        script.onload = () => {
          if (!loaded) {
            loaded = true;
            console.log('[YT Queue QR] ✅ QRCode library loaded from CDN');
            setTimeout(() => resolve(true), 100);
          }
        };
        
        script.onerror = () => {
          if (!loaded) {
            loaded = true;
            console.warn('[YT Queue QR] QRCode library CDN failed, using fallback');
            initializeQRCodeFallback();
            resolve(true);
          }
        };
        
        if (document.head) {
          document.head.appendChild(script);
        } else {
          console.warn('[YT Queue QR] document.head not available');
          resolve(true);
        }
        
        // Timeout safety
        setTimeout(() => {
          if (!loaded) {
            loaded = true;
            console.warn('[YT Queue QR] QRCode library loading timeout');
            initializeQRCodeFallback();
            resolve(true);
          }
        }, 8000);
      } catch (e) {
        console.error('[YT Queue QR] Error loading QRCode:', e);
        initializeQRCodeFallback();
        resolve(true);
      }
    });
  }

  /**
   * Fallback QRCode using QR server API
   */
  function initializeQRCodeFallback() {
    console.log('[YT Queue QR] Initializing QRCode fallback (using API)');
    
    if (window.QRCode) return;
    
    window.QRCode = function(element, options) {
      if (typeof options === 'string') {
        options = { text: options };
      }
      options = options || {};
      
      this.options = {
        text: options.text || "",
        width: options.width || 128,
        height: options.height || 128
      };
      
      this.element = element;
      this.makeCode(this.options.text);
    };
    
    window.QRCode.prototype.makeCode = function(text) {
      this.element.innerHTML = "";
      
      try {
        // Use QR server API for generating QR codes
        const url = `https://api.qrserver.com/v1/create-qr-code/?size=${this.options.width}x${this.options.height}&data=${encodeURIComponent(text)}`;
        
        const img = document.createElement('img');
        img.src = url;
        img.style.cssText = `
          width: ${this.options.width}px;
          height: ${this.options.height}px;
          image-rendering: pixelated;
          image-rendering: crisp-edges;
        `;
        img.onload = () => {
          console.log('[YT Queue QR] Fallback QR image loaded');
        };
        img.onerror = () => {
          console.error('[YT Queue QR] Failed to load QR image');
          const div = document.createElement('div');
          div.style.color = 'red';
          div.textContent = '❌ QR Code generation failed';
          this.element.appendChild(div);
        };
        
        this.element.appendChild(img);
      } catch (e) {
        console.error('[YT Queue QR] Fallback QR generation error:', e);
        const div = document.createElement('div');
        div.style.color = 'red';
        div.textContent = '❌ Error generating QR';
        this.element.appendChild(div);
      }
    };
    
    window.QRCode.CorrectLevel = {
      L: 1,
      M: 2,
      Q: 3,
      H: 4
    };
    
    console.log('[YT Queue QR] ✅ QRCode fallback initialized');
  }

  /**
   * Create the QR code popup box
   */
  function createBox() {
    console.log('[YT Queue QR] Creating QR box');
    
    if (!document.body || !document.documentElement) {
      console.log('[YT Queue QR] DOM not ready yet');
      return false;
    }
    
    if (document.getElementById('ytqr-box')) {
      console.log('[YT Queue QR] Box already exists');
      return true;
    }
    
    try {
      createBoxDOM();
      return true;
    } catch (e) {
      console.error('[YT Queue QR] Error in createBox:', e);
      return false;
    }
  }
  
  /**
   * Create the DOM structure
   */
  function createBoxDOM() {
    console.log('[YT Queue QR] Creating box DOM');
    
    try {
      if (!document.body) {
        console.log('[YT Queue QR] Body not available for DOM creation');
        return;
      }
      
      if (document.getElementById('ytqr-box')) {
        console.log('[YT Queue QR] Box already exists, skipping creation');
        return;
      }
      
      // Create main container
      const box = document.createElement('div');
      box.id = 'ytqr-box';
      box.style.cssText = 'all: initial; position: fixed; top: 0; right: 0; z-index: 2147483647;';
      
      // Create popup
      const popup = document.createElement('div');
      popup.id = 'ytqr-popup';
      popup.style.cssText = `
        position: fixed;
        top: 10px;
        right: 10px;
        background: white;
        border-radius: 12px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 2147483647;
        padding: 0;
        width: 320px;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        overflow: hidden;
        box-sizing: border-box;
      `;
      
      // Header
      const header = document.createElement('div');
      header.style.cssText = `
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 15px;
        cursor: pointer;
        display: flex;
        justify-content: space-between;
        align-items: center;
        user-select: none;
        box-sizing: border-box;
      `;
      
      const title = document.createElement('div');
      title.textContent = '🎵 Add Music';
      title.style.cssText = 'font-weight: 600; font-size: 14px; flex: 1;';
      header.appendChild(title);
      
      // Close button
      const closeBtn = document.createElement('button');
      closeBtn.textContent = '✕';
      closeBtn.style.cssText = `
        background: rgba(255,255,255,0.2);
        border: none;
        color: white;
        cursor: pointer;
        width: 30px;
        height: 30px;
        border-radius: 50%;
        font-size: 16px;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: background 0.2s;
        padding: 0;
      `;
      closeBtn.type = 'button';
      closeBtn.addEventListener('mouseover', () => { closeBtn.style.background = 'rgba(255,255,255,0.3)'; });
      closeBtn.addEventListener('mouseout', () => { closeBtn.style.background = 'rgba(255,255,255,0.2)'; });
      closeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        togglePopup();
      });
      header.appendChild(closeBtn);
      
      // Content area
      const content = document.createElement('div');
      content.id = 'ytqr-content';
      content.style.cssText = `
        padding: 20px;
        display: none;
        max-height: 600px;
        overflow-y: auto;
        box-sizing: border-box;
      `;
      
      // Session info
      const sessionInfo = document.createElement('div');
      sessionInfo.id = 'ytqr-session-info';
      sessionInfo.style.cssText = `
        background: #f5f7fa;
        padding: 12px;
        border-radius: 8px;
        margin-bottom: 15px;
        font-size: 12px;
        color: #666;
        box-sizing: border-box;
      `;
      const sessionLabel = document.createElement('div');
      sessionLabel.textContent = 'Session Code:';
      sessionLabel.style.cssText = 'margin-bottom: 8px; font-weight: bold;';
      const sessionCode = document.createElement('div');
      sessionCode.textContent = SESSION_ID.substring(0, 6).toUpperCase();
      sessionCode.style.cssText = `
        font-family: monospace;
        font-size: 16px;
        font-weight: bold;
        color: #667eea;
        text-align: center;
      `;
      sessionInfo.appendChild(sessionLabel);
      sessionInfo.appendChild(sessionCode);
      
      // Instructions
      const instructions = document.createElement('div');
      instructions.style.cssText = `
        background: #e8f5e9;
        padding: 12px;
        border-radius: 8px;
        font-size: 12px;
        color: #2e7d32;
        line-height: 1.6;
        margin-bottom: 15px;
        box-sizing: border-box;
      `;
      instructions.innerHTML = `
        <strong>📱 Hướng dẫn:</strong><br>
        1. Quét mã QR bằng điện thoại<br>
        2. Tìm kiếm và chọn bài hát<br>
        3. Bài hát được thêm vào hàng đợi
      `;
      
      // QR container
      const qrContainer = document.createElement('div');
      qrContainer.id = 'qr';
      qrContainer.style.cssText = `
        text-align: center;
        margin: 15px 0;
        min-height: 150px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #ffffff;
        border-radius: 12px;
        padding: 12px;
        box-shadow: 0 0 0 2px #667eea33;
        box-sizing: border-box;
      `;
      
      // Assemble content
      content.appendChild(sessionInfo);
      content.appendChild(instructions);
      content.appendChild(qrContainer);
      
      // Assemble popup
      popup.appendChild(header);
      popup.appendChild(content);
      box.appendChild(popup);
      
      // Add to body
      document.body.appendChild(box);
      
      console.log('[YT Queue QR] Box added to DOM');
      
      // Set up header click event
      header.addEventListener('click', togglePopup, { passive: true });
      
      // Render QR code immediately after container is in DOM
      setTimeout(() => {
        renderQR(qrContainer);
      }, 100);
      
    } catch (e) {
      console.error('[YT Queue QR] Error creating DOM:', e);
      console.error('[YT Queue QR] Stack:', e.stack);
    }
  }

  /**
   * Toggle popup visibility
   */
  function togglePopup() {
    try {
      const content = document.getElementById('ytqr-content');
      if (content) {
        const isVisible = content.style.display === 'block';
        content.style.display = isVisible ? 'none' : 'block';
        console.log('[YT Queue QR] Popup toggled:', isVisible ? 'hidden' : 'shown');
      }
    } catch (e) {
      console.error('[YT Queue QR] Error toggling popup:', e);
    }
  }

  /**
   * Render QR code with retry logic
   */
  function renderQR(container, retries = 0) {
    console.log('[YT Queue QR] Rendering QR code, retries:', retries);
    
    try {
      if (!container) {
        console.error('[YT Queue QR] No container provided');
        return;
      }
      
      if (!window.QRCode) {
        if (retries < 5) {
          console.warn('[YT Queue QR] QRCode not available yet, retrying...');
          setTimeout(() => renderQR(container, retries + 1), 500);
          return;
        }
        console.error('[YT Queue QR] QRCode not available after retries');
        container.innerHTML = '<div style="color: red; font-size: 12px; padding: 10px; text-align: center;">⚠️ QR library loading...<br/>Please wait or refresh</div>';
        return;
      }
      
      const targetUrl = `${BASE_URL}/add.html?session=${SESSION_ID}`;
      console.log('[YT Queue QR] Target URL:', targetUrl);
      
      // Clear previous content
      container.innerHTML = '';
      
      // Create QR code wrapper
      const qrWrapper = document.createElement('div');
      qrWrapper.style.cssText = `
        width: 140px;
        height: 140px;
        margin: 0 auto;
        background: white;
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
      `;
      
      try {
        // Generate QR code
        const qrCode = new window.QRCode(qrWrapper, {
          text: targetUrl,
          width: 120,
          height: 120,
          colorDark: '#000000',
          colorLight: '#ffffff',
          correctLevel: window.QRCode.CorrectLevel.H
        });
        
        container.appendChild(qrWrapper);
        console.log('[YT Queue QR] ✅ QR code rendered successfully');
        
      } catch (innerErr) {
        console.error('[YT Queue QR] QR generation error:', innerErr);
        container.innerHTML = '<div style="color: #f44336; font-size: 12px; padding: 10px; text-align: center;">❌ Error<br/>generating QR</div>';
      }
      
    } catch (e) {
      console.error('[YT Queue QR] Render error:', e);
    }
  }

  /**
   * Check if YouTube is fully loaded
   */
  function isYouTubeReady() {
    try {
      const playerContainer = document.getElementById('player') || document.querySelector('[role="main"]');
      return !!(
        document.body &&
        document.documentElement &&
        (document.readyState === 'complete' || document.readyState === 'interactive') &&
        playerContainer
      );
    } catch (e) {
      return !!(document.body && document.documentElement);
    }
  }

  /**
   * Start monitoring for removed QR box
   */
  function startObserver() {
    if (observerActive) return;
    
    try {
      observer = new MutationObserver(function() {
        try {
          if (!document.getElementById('ytqr-box') && !document.getElementById('ytqr-popup')) {
            console.log('[YT Queue QR] Box was removed, recreating');
            stopObserver();
            setTimeout(() => {
              if (!document.getElementById('ytqr-box')) {
                createBox();
              }
              startObserver();
            }, 1000);
          }
        } catch (e) {
          console.error('[YT Queue QR] Observer error:', e);
        }
      });
      
      observer.observe(document.body, {
        childList: true,
        subtree: false
      });
      
      observerActive = true;
      console.log('[YT Queue QR] Observer started');
    } catch (e) {
      console.error('[YT Queue QR] Error starting observer:', e);
    }
  }

  /**
   * Stop monitoring
   */
  function stopObserver() {
    if (observer && observerActive) {
      try {
        observer.disconnect();
        observerActive = false;
        console.log('[YT Queue QR] Observer stopped');
      } catch (e) {
        console.error('[YT Queue QR] Error stopping observer:', e);
      }
    }
  }

  /**
   * Ensure QR box exists
   */
  function ensure() {
    console.log('[YT Queue QR] Ensure called');
    
    try {
      if (!document.body) {
        console.log('[YT Queue QR] Body not available');
        return false;
      }
      
      if (!document.getElementById('ytqr-box')) {
        return createBox();
      }
      
      return true;
    } catch (e) {
      console.error('[YT Queue QR] Error in ensure:', e);
      return false;
    }
  }

  /**
   * Initialize when YouTube is ready
   */
  function init() {
    if (initialized) {
      console.log('[YT Queue QR] Already initialized');
      return;
    }
    
    console.log('[YT Queue QR] Initializing, readyState:', document.readyState);
    
    try {
      // Initialize QRCode library first (async)
      const qrcodePromise = initializeQRCodeLibrary();
      
      const startTime = Date.now();
      
      function checkAndInit() {
        const elapsed = Date.now() - startTime;
        
        if (elapsed > INIT_TIMEOUT) {
          console.log('[YT Queue QR] Initialization timeout reached');
          initialized = true;
          return;
        }
        
        if (isYouTubeReady()) {
          console.log('[YT Queue QR] YouTube is ready, initializing');
          initialized = true;
          clearTimeout(initTimeout);
          
          // Wait for QRCode to be ready
          if (qrcodePromise && qrcodePromise.then) {
            qrcodePromise.then(() => {
              ensure();
              setTimeout(() => {
                startObserver();
              }, 500);
            });
          } else {
            ensure();
            setTimeout(() => {
              startObserver();
            }, 500);
          }
        } else {
          initTimeout = setTimeout(checkAndInit, 300);
        }
      }
      
      setTimeout(checkAndInit, MIN_DELAY);
      
    } catch (e) {
      console.error('[YT Queue QR] Init error:', e);
      initialized = true;
    }
  }

  /**
   * Cleanup on page unload
   */
  function cleanup() {
    try {
      stopObserver();
      clearTimeout(initTimeout);
      console.log('[YT Queue QR] Cleaned up');
    } catch (e) {
      console.error('[YT Queue QR] Cleanup error:', e);
    }
  }

  // Listen for page unload
  window.addEventListener('beforeunload', cleanup, { passive: true });

  // Start initialization
  console.log('[YT Queue QR] Script initialized, waiting for YouTube');
  init();

})();
