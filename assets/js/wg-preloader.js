/**
 * WEB GLOBAL Website Preloader Controller
 */
(function () {
  'use strict';

  function initWgPreloader() {
    var preloader = document.getElementById('wgPreloader');
    if (!preloader) return;

    var startTime = Date.now();
    var minDisplayTime = 900; // ensures smooth brand intro animation (0.9s)
    var maxTimeout = 3500; // failsafe timeout so it NEVER gets stuck
    var dismissed = false;

    function hidePreloader() {
      if (dismissed || !preloader) return;
      dismissed = true;

      var elapsed = Date.now() - startTime;
      var delay = Math.max(0, minDisplayTime - elapsed);

      setTimeout(function () {
        preloader.classList.add('wg-preloader-fade-out');
        document.documentElement.classList.remove('wg-preloader-active');
        if (document.body) {
          document.body.classList.remove('wg-preloader-active');
        }

        setTimeout(function () {
          preloader.style.display = 'none';
        }, 700);
      }, delay);
    }

    if (document.readyState === 'complete') {
      hidePreloader();
    } else {
      window.addEventListener('load', hidePreloader);
    }

    // Failsafe timeout
    setTimeout(hidePreloader, maxTimeout);
  }

  // Lock scroll immediately while preloader is active
  try {
    document.documentElement.classList.add('wg-preloader-active');
    if (document.body) {
      document.body.classList.add('wg-preloader-active');
    }
  } catch (e) {}

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initWgPreloader);
  } else {
    initWgPreloader();
  }
})();

