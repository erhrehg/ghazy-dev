/**
 * login/js/welcome.js
 * Dipasang di index.html (landing page) dan halaman lain yang butuh status login.
 * Menampilkan "Halo, username" + tombol LOGOUT jika sudah login.
 * Menampilkan tombol LOGIN jika belum login.
 *
 * Pastikan di navbar index.html ada:
 *   <p id="userInfo">Belum login</p>
 *   <div id="authArea">
 *     <button onclick="goLogin()" class="nav-cta">Login</button>
 *   </div>
 */

(function () {
  var isLoggedIn = localStorage.getItem('ghazy_logged_in') === 'true';
  var userName   = localStorage.getItem('ghazy_user_name') || '';
  var userRole   = localStorage.getItem('ghazy_user_role') || 'user';

  // Fungsi global untuk tombol onclick="goLogin()"
  window.goLogin = function () {
    window.location.href = 'login/index.html';
  };

  // Fungsi global untuk tombol logout
  window.doLogout = function () {
    localStorage.removeItem('ghazy_logged_in');
    localStorage.removeItem('ghazy_user_name');
    localStorage.removeItem('ghazy_user_role');
    localStorage.removeItem('ghazy_token');
    localStorage.removeItem('ghazy_intended');
    window.location.reload();
  };

  document.addEventListener('DOMContentLoaded', function () {
    var userInfo = document.getElementById('userInfo');
    var authArea = document.getElementById('authArea');

    if (isLoggedIn && userName) {
      // Tampilkan nama user
      if (userInfo) {
        userInfo.textContent = 'Halo, ' + userName;
      }

      // Ganti tombol Login jadi Logout (+ link admin kalau admin)
      if (authArea) {
        var html = '';
        if (userRole === 'admin') {
          html += '<a href="admin/index.html" style="margin-right:8px; font-size:0.8rem; color:#00ff88; text-decoration:none; font-family:monospace;">Admin Panel</a>';
        }
        html += '<button onclick="doLogout()" class="nav-cta">LOGOUT</button>';
        authArea.innerHTML = html;
      }
    } else {
      // Belum login
      if (userInfo) userInfo.textContent = 'Belum login';
      if (authArea) {
        authArea.innerHTML = '<button onclick="goLogin()" class="nav-cta">Login</button>';
      }
    }
  });
})();

