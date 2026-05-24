/**
 * auth.js — Ghazy Dev
 * Guard + navbar auth untuk semua halaman blog.
 */

(function () {

  var PROTECTED_PAGES = [
    'tutorial-html.html',
    'tutorial-css.html',
    'tutorial-javascript.html',
    'tutorial-github.html',
    'tutorial-python.html'
  ];

  function currentPage() {
    return window.location.pathname.split('/').pop() || 'index.html';
  }

  function isLoggedIn() {
    return localStorage.getItem('ghazy_logged_in') === 'true';
  }

  function getUserName() {
    return localStorage.getItem('ghazy_user_name') || 'Member';
  }

  function getRole() {
    return localStorage.getItem('ghazy_user_role') || 'user';
  }

  function logout() {
    localStorage.removeItem('ghazy_logged_in');
    localStorage.removeItem('ghazy_user_name');
    localStorage.removeItem('ghazy_user_role');
    localStorage.removeItem('ghazy_token');
    localStorage.removeItem('ghazy_intended');
    window.location.href = 'index.html';
  }

  // --- GUARD ---
  var page = currentPage();
  if (PROTECTED_PAGES.indexOf(page) !== -1 && !isLoggedIn()) {
    localStorage.setItem('ghazy_intended', page);
    window.location.href = 'login/index.html';
    return;
  }

  // --- INJECT STYLES ---
  var style = document.createElement('style');
  style.textContent =
    '.auth-nav-area{display:flex;align-items:center;gap:0.75rem;margin-left:1rem;}' +
    '.user-badge{display:flex;align-items:center;gap:0.5rem;}' +
    '.user-avatar{width:26px;height:26px;background:linear-gradient(135deg,#7c3aed,#00ff88);display:flex;align-items:center;justify-content:center;font-family:"Space Mono",monospace;font-size:0.58rem;font-weight:700;color:#000;flex-shrink:0;}' +
    '.user-name{font-family:"Space Mono",monospace;font-size:0.68rem;color:#e8e8f0;letter-spacing:0.5px;}' +
    '.auth-btn{font-family:"Space Mono",monospace;font-size:0.63rem;letter-spacing:1px;text-transform:uppercase;padding:0.35rem 0.85rem;cursor:pointer;text-decoration:none;display:inline-block;transition:all 0.2s;border:none;}' +
    '.auth-btn.login{background:#00ff88;color:#000;}' +
    '.auth-btn.login:hover{background:#00cc6a;}' +
    '.auth-btn.logout{background:none;border:1px solid #1e1e2e;color:#6b6b80;}' +
    '.auth-btn.logout:hover{border-color:#f87171;color:#f87171;}' +
    '.auth-btn.admin{background:none;border:1px solid #00ff88;color:#00ff88;}' +
    '.auth-btn.admin:hover{background:rgba(0,255,136,0.1);}' +
    '.lock-overlay{position:fixed;inset:0;background:rgba(10,10,15,0.97);z-index:500;display:flex;align-items:center;justify-content:center;}' +
    '.lock-box{background:#16161f;border:1px solid #1e1e2e;padding:3rem;text-align:center;max-width:440px;width:90%;}' +
    '.lock-box h2{font-family:"Syne",sans-serif;font-size:1.6rem;font-weight:800;letter-spacing:-1px;margin-bottom:0.75rem;color:#e8e8f0;}' +
    '.lock-box p{font-family:"Space Mono",monospace;font-size:0.78rem;color:#6b6b80;line-height:1.8;margin-bottom:2rem;}' +
    '.lock-btn{display:inline-block;background:#00ff88;color:#000;font-family:"Space Mono",monospace;font-size:0.78rem;font-weight:700;letter-spacing:1px;text-transform:uppercase;padding:0.85rem 2rem;text-decoration:none;transition:transform 0.2s,box-shadow 0.2s;}' +
    '.lock-btn:hover{transform:translate(-3px,-3px);box-shadow:3px 3px 0 #7c3aed;}';
  document.head.appendChild(style);

  // --- INJECT NAVBAR ---
  document.addEventListener('DOMContentLoaded', function () {
    var nav = document.querySelector('nav');
    if (!nav) return;

    // Buat container auth
    var authArea = document.createElement('div');
    authArea.className = 'auth-nav-area';

    if (isLoggedIn()) {
      var name     = getUserName();
      var role     = getRole();
      var initials = name.slice(0, 2).toUpperCase();

      // Avatar + nama
      var badge = document.createElement('div');
      badge.className = 'user-badge';
      badge.innerHTML =
        '<div class="user-avatar">' + initials + '</div>' +
        '<span class="user-name">' + name + '</span>';
      authArea.appendChild(badge);

      // Tombol Admin Panel (hanya kalau role admin)
      if (role === 'admin') {
        var adminBtn = document.createElement('a');
        adminBtn.href = 'admin/index.html';
        adminBtn.className = 'auth-btn admin';
        adminBtn.textContent = 'Admin Panel';
        authArea.appendChild(adminBtn);
      }

      // Tombol Logout
      var logoutBtn = document.createElement('button');
      logoutBtn.className = 'auth-btn logout';
      logoutBtn.textContent = 'Logout';
      logoutBtn.addEventListener('click', logout);
      authArea.appendChild(logoutBtn);

    } else {
      // Tombol Login
      var loginBtn = document.createElement('a');
      loginBtn.href = 'login/index.html';
      loginBtn.className = 'auth-btn login';
      loginBtn.textContent = 'Login';
      authArea.appendChild(loginBtn);
    }

    nav.appendChild(authArea);

    // Lock overlay kalau protected page tapi entah bagaimana lolos guard
    if (PROTECTED_PAGES.indexOf(page) !== -1 && !isLoggedIn()) {
      showLockOverlay();
    }
  });

  function showLockOverlay() {
    var overlay = document.createElement('div');
    overlay.className = 'lock-overlay';
    overlay.innerHTML =
      '<div class="lock-box">' +
        '<div style="font-size:2.5rem;margin-bottom:1.5rem;">🔒</div>' +
        '<h2>Konten Member Only</h2>' +
        '<p>Kamu perlu login untuk membaca artikel ini.</p>' +
        '<a href="login/index.html" class="lock-btn">Login Sekarang →</a>' +
      '</div>';
    document.body.appendChild(overlay);
  }

})();
