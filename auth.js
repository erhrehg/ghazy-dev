/**
 * auth.js — Ghazy Dev
 * Sertakan file ini di semua halaman yang perlu proteksi login.
 * Cara pakai: <script src="auth.js"></script> sebelum </body>
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

  function logout() {
    localStorage.removeItem('ghazy_logged_in');
    localStorage.removeItem('ghazy_user_name');
    localStorage.removeItem('ghazy_user_email');
    window.location.href = 'index.html';
  }

  // --- GUARD: redirect ke login kalau belum login ---
  var page = currentPage();
  if (PROTECTED_PAGES.indexOf(page) !== -1 && !isLoggedIn()) {
    localStorage.setItem('ghazy_intended', page);
    window.location.href = 'login.html';
    return;
  }

  // --- INJECT NAVBAR USER STATE ---
  // Tunggu DOM siap
  document.addEventListener('DOMContentLoaded', function () {

    // Inject style untuk user badge
    var style = document.createElement('style');
    style.textContent = [
      '.auth-nav-area { display:flex; align-items:center; gap:1rem; }',
      '.user-badge { display:flex; align-items:center; gap:0.6rem; }',
      '.user-avatar { width:28px; height:28px; background:linear-gradient(135deg,#7c3aed,#00ff88); display:flex; align-items:center; justify-content:center; font-family:\'Space Mono\',monospace; font-size:0.6rem; font-weight:700; color:#000; flex-shrink:0; }',
      '.user-name { font-family:\'Space Mono\',monospace; font-size:0.7rem; color:#e8e8f0; letter-spacing:0.5px; }',
      '.btn-logout { font-family:\'Space Mono\',monospace; font-size:0.65rem; color:#6b6b80; background:none; border:1px solid #1e1e2e; padding:0.35rem 0.8rem; cursor:pointer; letter-spacing:1px; text-transform:uppercase; transition:all 0.2s; text-decoration:none; }',
      '.btn-logout:hover { color:#00ff88; border-color:#00ff88; }',
      '.btn-login-nav { font-family:\'Space Mono\',monospace; font-size:0.65rem; color:#000; background:#00ff88; border:none; padding:0.45rem 1rem; cursor:pointer; letter-spacing:1px; text-transform:uppercase; transition:all 0.2s; text-decoration:none; display:inline-block; }',
      '.btn-login-nav:hover { background:#00cc6a; }',
      '.lock-overlay { position:fixed; inset:0; background:rgba(10,10,15,0.97); z-index:500; display:flex; align-items:center; justify-content:center; flex-direction:column; gap:0; }',
      '.lock-box { background:#16161f; border:1px solid #1e1e2e; padding:3rem; text-align:center; max-width:440px; width:90%; }',
      '.lock-icon { font-size:2.5rem; margin-bottom:1.5rem; }',
      '.lock-box h2 { font-family:\'Syne\',sans-serif; font-size:1.6rem; font-weight:800; letter-spacing:-1px; margin-bottom:0.75rem; color:#e8e8f0; }',
      '.lock-box p { font-family:\'Space Mono\',monospace; font-size:0.78rem; color:#6b6b80; line-height:1.8; margin-bottom:2rem; }',
      '.lock-box .lock-btn { display:inline-block; background:#00ff88; color:#000; font-family:\'Space Mono\',monospace; font-size:0.78rem; font-weight:700; letter-spacing:1px; text-transform:uppercase; padding:0.85rem 2rem; text-decoration:none; transition:transform 0.2s,box-shadow 0.2s; }',
      '.lock-box .lock-btn:hover { transform:translate(-3px,-3px); box-shadow:3px 3px 0 #7c3aed; }',
    ].join('\n');
    document.head.appendChild(style);

    // Inject auth area into navbar
    var nav = document.querySelector('nav');
    if (nav) {
      var authArea = document.createElement('div');
      authArea.className = 'auth-nav-area';

      if (isLoggedIn()) {
        var name = getUserName();
        var initials = name.split(' ').map(function(w){ return w[0]; }).join('').toUpperCase().slice(0,2);
        authArea.innerHTML =
          '<div class="user-badge">' +
            '<div class="user-avatar">' + initials + '</div>' +
            '<span class="user-name">' + name + '</span>' +
          '</div>' +
          '<button class="btn-logout" id="logoutBtn">Logout</button>';
      } else {
        authArea.innerHTML =
          '<a href="login.html" class="btn-login-nav">Login</a>';
      }

      nav.appendChild(authArea);

      var logoutBtn = document.getElementById('logoutBtn');
      if (logoutBtn) {
        logoutBtn.addEventListener('click', logout);
      }
    }

    // Kalau halaman ini adalah halaman yang diproteksi tapi entah bagaimana bisa diakses
    // tanpa login (misal via cache), tampilkan overlay
    if (PROTECTED_PAGES.indexOf(page) !== -1 && !isLoggedIn()) {
      showLockOverlay();
    }
  });

  function showLockOverlay() {
    var overlay = document.createElement('div');
    overlay.className = 'lock-overlay';
    overlay.innerHTML =
      '<div class="lock-box">' +
        '<div class="lock-icon">🔒</div>' +
        '<h2>Konten Member Only</h2>' +
        '<p>Kamu perlu login untuk membaca artikel ini. Daftar gratis dan akses semua tutorial coding di blog ini.</p>' +
        '<a href="login.html" class="lock-btn" id="lockLoginBtn">Login Sekarang →</a>' +
      '</div>';
    document.body.appendChild(overlay);

    document.getElementById('lockLoginBtn').addEventListener('click', function(e) {
      e.preventDefault();
      localStorage.setItem('ghazy_intended', currentPage());
      window.location.href = 'login.html';
    });
  }

})();
