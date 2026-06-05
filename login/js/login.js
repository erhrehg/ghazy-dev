/**
 * login/js/login.js
 * Urutan pengecekan login:
 * 1. Coba API herisusanta.my.id
 * 2. Kalau API gagal → cek akun demo bawaan (heri/123, admin/123)
 * 3. Kalau tidak cocok demo → cek user yang daftar via localStorage
 */

const API_URL = 'https://herisusanta.my.id/javalogin/api/';

const loginForm     = document.getElementById('loginForm');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const alertBox      = document.getElementById('alertBox');

// Akun demo bawaan
const DEMO_ACCOUNTS = [
  { username: 'heri',  password: '123', role: 'user'  },
  { username: 'admin', password: '123', role: 'admin' }
];

function showAlert(msg, isError = true) {
  if (!alertBox) return;
  alertBox.textContent = msg;
  alertBox.style.display = 'block';
  alertBox.style.background = isError ? '#e44e4e' : '#2ecc71';
  alertBox.style.color = 'white';
  alertBox.style.padding = '10px';
  alertBox.style.textAlign = 'center';
  alertBox.style.border = isError ? '1px solid #b32929' : '1px solid #27ae60';
  alertBox.style.fontFamily = 'monospace';
  alertBox.style.fontSize = '0.8rem';
  alertBox.style.marginBottom = '1rem';
}

function hideAlert() {
  if (alertBox) alertBox.style.display = 'none';
}

function getLocalUsers() {
  try {
    return JSON.parse(localStorage.getItem('ghazy_local_users') || '[]');
  } catch (e) { return []; }
}

function setSession(username, role) {
  localStorage.setItem('ghazy_logged_in', 'true');
  localStorage.setItem('ghazy_user_name', username);
  localStorage.setItem('ghazy_user_role', role);
}

function doRedirect(role) {
  if (role === 'admin') {
    window.location.href = '../admin/index.html';
  } else {
    const intended = localStorage.getItem('ghazy_intended') || '../index.html';
    localStorage.removeItem('ghazy_intended');
    window.location.href = intended;
  }
}

if (loginForm) {
  loginForm.addEventListener('submit', async function (e) {
    e.preventDefault();
    hideAlert();

    const username = usernameInput ? usernameInput.value.trim() : '';
    const password = passwordInput ? passwordInput.value.trim() : '';

    if (!username || !password) {
      showAlert('Username dan password wajib diisi.');
      return;
    }

    const submitBtn = loginForm.querySelector('button[type="submit"]');
    if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = 'Memproses...'; }

    // --- 1. COBA API ---
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 5000);

      const response = await fetch(API_URL + 'login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
        signal: controller.signal
      });

      clearTimeout(timeout);
      const data = await response.json();

      if (data.status === 'success' || data.token || data.username) {
        const role = data.role || (username === 'admin' ? 'admin' : 'user');
        setSession(data.username || username, role);
        doRedirect(role);
        return;
      } else {
        // API merespons tapi login salah
        showAlert(data.message || 'Username atau password salah.');
        if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = 'masuk'; }
        return;
      }

    } catch (err) {
      // API tidak bisa diakses → lanjut ke fallback
      console.warn('API tidak tersedia, coba fallback:', err.message);
    }

    // --- 2. CEK AKUN DEMO ---
    const demo = DEMO_ACCOUNTS.find(a => a.username === username && a.password === password);
    if (demo) {
      setSession(demo.username, demo.role);
      doRedirect(demo.role);
      return;
    }

    // --- 3. CEK USER LOKAL (yang daftar via register fallback) ---
    const localUsers = getLocalUsers();
    const localUser  = localUsers.find(u => u.username === username && u.password === password);
    if (localUser) {
      setSession(localUser.username, 'user');
      doRedirect('user');
      return;
    }

    // Semua gagal
    showAlert('Username atau password salah.');
    if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = 'masuk'; }
  });
}
