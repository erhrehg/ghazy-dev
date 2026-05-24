/**
 * login/js/register.js
 * Register menggunakan API dari herisusanta.my.id
 * Setelah berhasil daftar → redirect ke login (index.html di folder login)
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

    const submitBtn = registerForm.querySelector('button[type="submit"]');
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Mendaftar...';
    }

    try {
      const response = await fetch(API_URL + 'register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password })
      });

      const data = await response.json();

      if (data.status === 'success' || data.message === 'registered') {
        showMessage('Pendaftaran berhasil! Mengalihkan ke halaman login...', false);
        setTimeout(() => {
          window.location.href = 'index.html';
        }, 1500);
      } else if (data.message && data.message.toLowerCase().includes('exist')) {
        showMessage('Username sudah digunakan. Pilih username lain.');
      } else {
        showMessage(data.message || 'Pendaftaran gagal. Coba lagi.');
      }

    } catch (err) {
      showMessage('Tidak dapat terhubung ke server. Coba beberapa saat lagi.');
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Daftar';
      }
    }
  });
}

