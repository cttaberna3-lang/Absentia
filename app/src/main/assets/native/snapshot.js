/* Saves an offline copy of the page being viewed (run by MainActivity after a page loads online). */
(function () {
  try {
    if (window.__absentiaOffline) return;                 // this page is itself an offline copy
    if (document.readyState !== 'complete') return;       // still loading
    var path = location.pathname.toLowerCase();
    if (path === '/' || /\/(login|register|logout)\.php$/.test(path)) return;
    if (!window.AndroidOffline || !window.AndroidOffline.save) return;

    var origLinks = document.querySelectorAll('link[rel="stylesheet"]');
    var jobs = [];
    for (var i = 0; i < origLinks.length; i++) {
      (function (idx, href) {
        var same = false;
        try { same = new URL(href, location.href).origin === location.origin; } catch (e) {}
        if (!same) { jobs.push(Promise.resolve({ idx: idx, css: null })); return; }
        jobs.push(
          fetch(href, { credentials: 'same-origin' })
            .then(function (r) { return r.ok ? r.text() : null; })
            .then(function (css) { return { idx: idx, css: css, href: href }; })
            .catch(function () { return { idx: idx, css: null }; })
        );
      })(i, origLinks[i].href);
    }

    Promise.all(jobs).then(function (results) {
      var clone = document.documentElement.cloneNode(true);
      var copies = clone.querySelectorAll('link[rel="stylesheet"]');
      results.forEach(function (res) {
        var link = copies[res.idx];
        if (!link || res.css === null || !link.parentNode) return;
        // make url(...) inside the CSS absolute, since it will now live inside the page itself
        var css = res.css.replace(/url\(\s*(['"]?)(?!data:|https?:|\/\/|#)([^'")]+)\1\s*\)/gi, function (m, q, u) {
          try { return 'url("' + new URL(u, res.href).href + '")'; } catch (e) { return m; }
        });
        var style = document.createElement('style');
        style.textContent = css;
        link.parentNode.replaceChild(style, link);
      });
      // don't freeze menus / dialogs open inside the saved copy
      Array.prototype.forEach.call(
        clone.querySelectorAll('.modal-bg.show, .sidebar.open, .notif-panel.show'),
        function (el) { el.classList.remove('show'); el.classList.remove('open'); });
      var bg = clone.querySelector('#sidebarBg'); if (bg) bg.style.display = 'none';
      window.AndroidOffline.save(location.href, '<!DOCTYPE html>' + clone.outerHTML);
    }).catch(function () {});
  } catch (e) {}
})();
