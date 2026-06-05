/**
 * login/js/register.js
 * Coba register via API dulu.
 * Kalau API gagal (CORS/network) → fallback ke localStorage.
 */

const API_URL = 'https://herisusanta.my.id/javalogin/api/';

const registerForm  = document.getElementById('registerForm');
const usernameInput = document.getElementById('username');
const emailInput    = document.getElementById('email');
const passwordInput = document.getElementById('password');
const messageEl     = document.getElementById('message');

function showMessage(msg, isError = true) {
  if (!messageEl) return;
  messageEl.textContent = msg;
  messageEl.style.color = isError ? '#f87171' : '#00ff88';
  messageEl.style.marginTop = '12px';
  messageEl.style.fontFamily = 'monospace';
  messageEl.style.fontSize = '0.8rem';
  messageEl.style.display = 'block';
}

// Ambil semua user dari localStorage
function getLocalUsers() {
  try {
    return JSON.parse(localStorage.getItem('ghazy_local_users') || '[]');
  } catch (e) {
    return [];
  }
}

// Simpan user baru ke localStorage
function saveLocalUser(username, email, password) {
  const users = getLocalUsers();
  users.push({ username, email, password });
  localStorage.setItem('ghazy_local_users', JSON.stringify(users));
}

// Cek apakah username sudah ada di localStorage
function localUserExists(username) {
  return getLocalUsers().some(u => u.username === username);
}

function redirectToLogin() {
  setTimeout(() => {
    window.location.href = 'index.html';
  }, 1500);
}

if (registerForm) {
  registerForm.addEventListener('submit', async function (e) {
    e.preventDefault();

    const username = usernameInput ? usernameInput.value.trim() : '';
    const email    = emailInput    ? emailInput.value.trim()    : '';
    const password = passwordInput ? passwordInput.value.trim() : '';

    if (!username || !password) {
      showMessage('Username dan password wajib diisi.');
      return;
    }

    if (username.length < 3) {
      showMessage('Username minimal 3 karakter.');
      return;
    }

    const submitBtn = registerForm.querySelector('button[type="submit"]');
    if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = 'Mendaftar...'; }

    // --- COBA API DULU ---
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 5000); // timeout 5 detik

      const response = await fetch(API_URL + 'register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
        signal: controller.signal
      });

      clearTimeout(timeout);
      const data = await response.json();

      if (data.status === 'success' || data.message === 'registered') {
        showMessage('Pendaftaran berhasil via server! Mengalihkan ke login...', false);
        redirectToLogin();
        return;
      } else if (
        data.message && (
          data.message.toLowerCase().includes('exist') ||
          data.message.toLowerCase().includes('already') ||
          data.message.toLowerCase().includes('taken')
        )
      ) {
        // Username sudah ada di server
        showMessage('Username sudah digunakan. Pilih username lain.');
        if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = 'Daftar'; }
        return;
      } else {
        // API gagal dengan alasan lain → fallback
        throw new Error(data.message || 'API error');
      }

    } catch (err) {
      // --- FALLBACK: localStorage ---
      console.warn('API tidak tersedia, fallback ke localStorage:', err.message);

      // Cek dulu di localStorage
      if (localUserExists(username)) {
        showMessage('Username sudah digunakan. Pilih username lain.');
        if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = 'Daftar'; }
        return;
      }

      // Simpan ke localStorage
      saveLocalUser(username, email, password);
      showMessage('✓ Pendaftaran berhasil! (tersimpan lokal) Mengalihkan ke login...', false);
      redirectToLogin();
    }
  });
}
