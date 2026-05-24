/**
 * login/js/login.js
 * Login menggunakan API dari herisusanta.my.id
 * - admin → redirect ke admin/index.html
 * - user  → redirect ke index.html (landing page)
 */

const API_URL = 'https://herisusanta.my.id/javalogin/api/';

const loginForm     = document.getElementById('loginForm');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const alertBox      = document.getElementById('alertBox');

function showAlert(msg, isError = true) {
  if (!alertBox) return;
  alertBox.textContent = msg;
  alertBox.style.display = 'block';
  alertBox.style.background = isError ? '#e44e4e' : '#2ecc71';
}

function hideAlert() {
  if (alertBox) alertBox.style.display = 'none';
}

if (loginForm) {
  loginForm.addEventListener('submit', async function (e) {
    e.preventDefault();
    hideAlert();

    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();

    if (!username || !password) {
      showAlert('Username dan password wajib diisi.');
      return;
    }

    const submitBtn = loginForm.querySelector('button[type="submit"]');
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Memproses...';
    }

    try {
      const response = await fetch(API_URL + 'login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const data = await response.json();

      if (data.status === 'success' || data.token || data.username) {
        // Simpan sesi ke localStorage
        localStorage.setItem('ghazy_logged_in', 'true');
        localStorage.setItem('ghazy_user_name', data.username || username);
        localStorage.setItem('ghazy_user_role', data.role || (username === 'admin' ? 'admin' : 'user'));
        localStorage.setItem('ghazy_token', data.token || '');

        const role = localStorage.getItem('ghazy_user_role');

        if (role === 'admin') {
          window.location.href = '../admin/index.html';
        } else {
          // Redirect ke halaman yang tadi mau dibuka, atau index
          const intended = localStorage.getItem('ghazy_intended') || '../index.html';
          localStorage.removeItem('ghazy_intended');
          window.location.href = intended;
        }
      } else {
        showAlert(data.message || 'Username atau password salah.');
      }

    } catch (err) {
      // Fallback: kalau API tidak bisa diakses, pakai akun demo
      const DEMO = [
        { username: 'heri',  password: '123', role: 'user'  },
        { username: 'admin', password: '123', role: 'admin' }
      ];
      const match = DEMO.find(a => a.username === username && a.password === password);
      if (match) {
        localStorage.setItem('ghazy_logged_in', 'true');
        localStorage.setItem('ghazy_user_name', match.username);
        localStorage.setItem('ghazy_user_role', match.role);
        if (match.role === 'admin') {
          window.location.href = '../admin/index.html';
        } else {
          const intended = localStorage.getItem('ghazy_intended') || '../index.html';
          localStorage.removeItem('ghazy_intended');
          window.location.href = intended;
        }
      } else {
        showAlert('Username atau password salah. (gunakan: heri/123 atau admin/123)');
      }
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = 'masuk';
      }
    }
  });
}

