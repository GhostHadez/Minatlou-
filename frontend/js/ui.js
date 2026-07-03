/**
 * =============================================================
 * MINATLOU SECURITY & PROJECTS — SMALL UI HELPERS
 * =============================================================
 */

function showToast(message, type = 'info', duration = 3500) {
  let toast = document.getElementById('appToast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'appToast';
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.toggle('error', type === 'error');
  toast.classList.add('show');
  clearTimeout(toast._hideTimer);
  toast._hideTimer = setTimeout(() => toast.classList.remove('show'), duration);
}

function setFieldError(fieldId, message) {
  const el = document.getElementById(`${fieldId}Error`);
  if (!el) return;
  el.textContent = message || '';
  el.classList.toggle('show', !!message);
}

function clearFieldErrors(fieldIds) {
  fieldIds.forEach((id) => setFieldError(id, ''));
}

function setButtonLoading(button, isLoading, loadingLabel = 'Please wait…') {
  if (!button) return;
  if (isLoading) {
    button.dataset.originalLabel = button.textContent;
    button.textContent = loadingLabel;
    button.disabled = true;
  } else {
    button.textContent = button.dataset.originalLabel || button.textContent;
    button.disabled = false;
  }
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidPhone(phone) {
  return /^[+0-9\s()-]{7,20}$/.test(phone);
}

window.showToast = showToast;
window.setFieldError = setFieldError;
window.clearFieldErrors = clearFieldErrors;
window.setButtonLoading = setButtonLoading;
window.isValidEmail = isValidEmail;
window.isValidPhone = isValidPhone;
