/**
 * ASI Network — GDPR/CCPA Cookie Consent Banner
 * Drop-in script for all deploy sites.
 *
 * Usage: Add before </body> on every page:
 *   <script src="cookie-consent.js"></script>
 *
 * Behavior:
 * - Shows a bottom banner on first visit
 * - "Accept All" sets consent cookie for 365 days
 * - "Reject Non-Essential" sets cookie blocking analytics/marketing
 * - "Manage Preferences" opens granular controls
 * - Banner hides once user makes a choice
 * - Cookie name: asi_cookie_consent
 */
(function () {
  'use strict';

  var COOKIE_NAME = 'asi_cookie_consent';
  var COOKIE_DAYS = 365;

  // Check if consent already given
  function getConsent() {
    var match = document.cookie.match(new RegExp('(^| )' + COOKIE_NAME + '=([^;]+)'));
    if (match) {
      try { return JSON.parse(decodeURIComponent(match[2])); } catch (e) { return null; }
    }
    return null;
  }

  function setConsent(value) {
    var d = new Date();
    d.setTime(d.getTime() + COOKIE_DAYS * 24 * 60 * 60 * 1000);
    document.cookie = COOKIE_NAME + '=' + encodeURIComponent(JSON.stringify(value)) +
      ';expires=' + d.toUTCString() + ';path=/;SameSite=Lax';
  }

  // If consent already given, skip banner
  if (getConsent()) return;

  // --- Build Banner UI ---
  var banner = document.createElement('div');
  banner.id = 'asi-cookie-banner';
  banner.setAttribute('role', 'dialog');
  banner.setAttribute('aria-label', 'Cookie consent');
  banner.innerHTML = [
    '<div style="max-width:960px;margin:0 auto;display:flex;flex-wrap:wrap;align-items:center;gap:16px;">',
    '  <div style="flex:1;min-width:280px;">',
    '    <p style="margin:0 0 4px;font-weight:600;font-size:15px;">We use cookies</p>',
    '    <p style="margin:0;font-size:13px;opacity:0.85;">We use cookies to improve your experience, analyze traffic, and for marketing. ',
    '    See our <a href="cookies.html" style="color:inherit;text-decoration:underline;">Cookie Policy</a> for details.</p>',
    '  </div>',
    '  <div style="display:flex;gap:8px;flex-wrap:wrap;">',
    '    <button id="asi-cc-accept" style="padding:8px 18px;border:none;border-radius:6px;background:#16a34a;color:#fff;font-size:13px;font-weight:600;cursor:pointer;">Accept All</button>',
    '    <button id="asi-cc-reject" style="padding:8px 18px;border:1px solid rgba(255,255,255,0.3);border-radius:6px;background:transparent;color:inherit;font-size:13px;cursor:pointer;">Reject Non-Essential</button>',
    '    <button id="asi-cc-manage" style="padding:8px 18px;border:1px solid rgba(255,255,255,0.3);border-radius:6px;background:transparent;color:inherit;font-size:13px;cursor:pointer;">Manage</button>',
    '  </div>',
    '</div>',
    // Preferences panel (hidden by default)
    '<div id="asi-cc-prefs" style="display:none;max-width:960px;margin:12px auto 0;padding:12px 0 0;border-top:1px solid rgba(255,255,255,0.15);">',
    '  <div style="display:flex;flex-wrap:wrap;gap:16px;">',
    '    <label style="font-size:13px;display:flex;align-items:center;gap:6px;"><input type="checkbox" checked disabled> Essential (required)</label>',
    '    <label style="font-size:13px;display:flex;align-items:center;gap:6px;"><input type="checkbox" id="asi-cc-analytics" checked> Analytics</label>',
    '    <label style="font-size:13px;display:flex;align-items:center;gap:6px;"><input type="checkbox" id="asi-cc-marketing" checked> Marketing</label>',
    '    <label style="font-size:13px;display:flex;align-items:center;gap:6px;"><input type="checkbox" id="asi-cc-preferences" checked> Preferences</label>',
    '  </div>',
    '  <button id="asi-cc-save" style="margin-top:10px;padding:8px 18px;border:none;border-radius:6px;background:#16a34a;color:#fff;font-size:13px;font-weight:600;cursor:pointer;">Save Preferences</button>',
    '</div>'
  ].join('\n');

  // Banner styles
  banner.style.cssText = [
    'position:fixed', 'bottom:0', 'left:0', 'right:0', 'z-index:9999',
    'background:rgba(15,15,15,0.97)', 'color:#f0f0f0',
    'padding:16px 20px', 'font-family:system-ui,-apple-system,sans-serif',
    'box-shadow:0 -2px 12px rgba(0,0,0,0.3)', 'backdrop-filter:blur(8px)'
  ].join(';');

  document.body.appendChild(banner);

  // --- Event Handlers ---
  function hideBanner() {
    banner.style.transition = 'transform 0.3s ease';
    banner.style.transform = 'translateY(100%)';
    setTimeout(function () { banner.remove(); }, 350);
  }

  document.getElementById('asi-cc-accept').addEventListener('click', function () {
    setConsent({ essential: true, analytics: true, marketing: true, preferences: true });
    hideBanner();
  });

  document.getElementById('asi-cc-reject').addEventListener('click', function () {
    setConsent({ essential: true, analytics: false, marketing: false, preferences: false });
    hideBanner();
  });

  document.getElementById('asi-cc-manage').addEventListener('click', function () {
    var prefs = document.getElementById('asi-cc-prefs');
    prefs.style.display = prefs.style.display === 'none' ? 'block' : 'none';
  });

  document.getElementById('asi-cc-save').addEventListener('click', function () {
    setConsent({
      essential: true,
      analytics: document.getElementById('asi-cc-analytics').checked,
      marketing: document.getElementById('asi-cc-marketing').checked,
      preferences: document.getElementById('asi-cc-preferences').checked
    });
    hideBanner();
  });
})();
