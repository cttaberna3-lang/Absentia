/* Injected at the top of a saved page while it is shown offline (see MainActivity.showSnapshot). */
(function () {
  if (window.__absentiaOffline) return;
  window.__absentiaOffline = true;
  var SAVED_AT = __SAVED_AT__;

  // Nothing can be sent without internet: stop background polling/saving from erroring.
  window.fetch = function () { return Promise.reject(new TypeError('Offline')); };

  var msgEl = null, btnEl = null, barEl = null, resetTimer = null, online = false;

  function savedText() {
    try {
      return new Date(SAVED_AT).toLocaleString([], { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
    } catch (e) { return ''; }
  }
  function baseText() {
    return online ? 'Back online. Tap Refresh to update your data.'
                  : 'Offline \u2014 showing data saved ' + savedText();
  }
  function say(text) {
    if (!msgEl) return;
    msgEl.textContent = text;
    clearTimeout(resetTimer);
    resetTimer = setTimeout(function () { msgEl.textContent = baseText(); }, 2800);
  }

  // Forms need the server, so block them politely instead of showing a browser error page.
  document.addEventListener('submit', function (e) {
    e.preventDefault(); e.stopImmediatePropagation();
    say('You are offline. Connect to the internet to save changes.');
  }, true);

  window.__absentiaOnline = function () {
    online = true;
    if (barEl) barEl.style.borderColor = 'rgba(46,207,122,.6)';
    if (btnEl) btnEl.textContent = 'Refresh';
    if (msgEl) msgEl.textContent = baseText();
  };

  function build() {
    var st = document.createElement('style');
    st.textContent =
      '#abs-off{position:fixed;left:12px;right:12px;bottom:calc(12px + env(safe-area-inset-bottom,0px));z-index:2147483647;' +
      'display:flex;align-items:center;gap:10px;padding:10px 12px;border-radius:14px;background:rgba(10,19,48,.97);' +
      'border:1px solid rgba(255,176,32,.55);color:#E8ECF8;font:600 12px/1.35 system-ui,-apple-system,sans-serif;' +
      'box-shadow:0 10px 30px rgba(0,0,0,.45)}' +
      '#abs-off span{flex:1}' +
      '#abs-off button{border:0;border-radius:10px;padding:7px 14px;background:#1A6CF5;color:#fff;font:700 12px system-ui,sans-serif}' +
      'body{padding-bottom:78px !important}';
    document.head.appendChild(st);
    barEl = document.createElement('div'); barEl.id = 'abs-off';
    msgEl = document.createElement('span'); msgEl.textContent = baseText();
    btnEl = document.createElement('button'); btnEl.type = 'button'; btnEl.textContent = 'Retry';
    btnEl.addEventListener('click', function () { try { window.AndroidOffline.retry(); } catch (e) {} });
    barEl.appendChild(document.createTextNode('\uD83D\uDCF4'));
    barEl.appendChild(msgEl); barEl.appendChild(btnEl);
    document.body.appendChild(barEl);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', build); else build();
})();
