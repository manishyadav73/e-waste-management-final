// 🌍 Helper: Fetch wrapper with error handling
const api = async (path, opts = {}) => {
  const res = await fetch(path, opts);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
};

// 🧹 Helper: Escape HTML
const escapeHtml = s =>
  s ? s.replaceAll('&', '&amp;')
       .replaceAll('<', '&lt;')
       .replaceAll('>', '&gt;')
    : '';

// 🌟 Helper: Toast Notification
function showToast(message, type = 'success') {
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = message;
  document.body.appendChild(toast);
  setTimeout(() => toast.classList.add('show'), 100);
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 500);
  }, 3000);
}

// 🧾 Send new pickup request
async function sendRequest(e) {
  e.preventDefault();

  const payload = {
    name: document.getElementById('name').value.trim(),
    phone: document.getElementById('phone').value.trim(),
    address: document.getElementById('address').value.trim(),
    device: document.getElementById('device').value.trim(),
    quantity: Number(document.getElementById('quantity').value) || 1,
    date: document.getElementById('date').value || null,
  };

  if (!payload.name || !payload.phone || !payload.address)
    return showToast('⚠️ Name, phone, and address are required.', 'error');

  const btn = document.getElementById('reqBtn');
  btn.disabled = true;
  btn.textContent = 'Sending...';

  try {
    await fetch('/api/requests', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    showToast('✅ Request submitted successfully!');
    document.getElementById('pickupForm').reset();
    loadUserRequests();
  } catch (err) {
    console.error(err);
    showToast('❌ Failed to submit request. Please try again.', 'error');
  } finally {
    btn.disabled = false;
    btn.textContent = 'Send Request';
  }
}

// 🗑️ Delete request (admin)
async function handleAdminClick(e) {
  if (e.target.matches('.del')) {
    const id = e.target.dataset.id;
    if (!confirm('Delete this request?')) return;
    await fetch(`/api/requests/${id}`, { method: 'DELETE' });
    showToast('🗑 Request deleted.');
    loadAdmin();
  }
}

// 🔄 Update status (admin)
async function handleStatusChange(e) {
  if (e.target.matches('.status')) {
    const id = e.target.dataset.id;
    const status = e.target.value;
    await fetch(`/api/requests/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    showToast(`Status updated to "${status}"`);
  }
}

// 👥 Load user’s requests
async function loadUserRequests() {
  const container = document.getElementById('requests');
  if (!container) return;
  container.innerHTML = `<div class="loader"></div>`;

  try {
    const data = await api('/api/requests');
    if (!data.length) {
      container.innerHTML = '<p>No requests yet.</p>';
      return;
    }

    container.innerHTML = '';
    data.forEach(req => {
      const el = document.createElement('div');
      el.className = 'request-card';
      el.innerHTML = `
        <img src="/images/${req.device?.toLowerCase().includes('plastic') ? 'plastic.png' : 'ewaste.png'}" 
             alt="item" class="req-img">
        <div class="req-details">
          <h3>${escapeHtml(req.device)}</h3>
          <p><strong>Quantity:</strong> ${req.quantity}</p>
          <p><strong>Date:</strong> ${req.date || 'N/A'}</p>
          <p><strong>Status:</strong> 
             <span class="status-label ${req.status || 'pending'}">
               ${req.status || 'Pending'}
             </span>
          </p>
        </div>`;
      container.appendChild(el);
    });
  } catch (err) {
    container.innerHTML = '<p style="color:red;">Error loading requests.</p>';
  }
}

// 🧭 Load all requests (admin)
async function loadAdmin() {
  const container = document.getElementById('allRequests');
  if (!container) return;
  container.innerHTML = `<div class="loader"></div>`;

  try {
    const data = await api('/api/requests');
    if (!data.length) {
      container.innerHTML = '<p>No pickup requests yet.</p>';
      return;
    }

    container.innerHTML = '';
    data.forEach(req => {
      const el = document.createElement('div');
      el.className = 'request-card';
      el.innerHTML = `
        <h3>${escapeHtml(req.name)} — ${escapeHtml(req.device)}</h3>
        <p><strong>Phone:</strong> ${escapeHtml(req.phone)}</p>
        <p><strong>Address:</strong> ${escapeHtml(req.address)}</p>
        <p><strong>Quantity:</strong> ${req.quantity}</p>
        <p><strong>Date:</strong> ${req.date || 'N/A'}</p>
        <select class="status" data-id="${req.id}">
          <option value="Pending" ${req.status === 'Pending' ? 'selected' : ''}>Pending</option>
          <option value="In Progress" ${req.status === 'In Progress' ? 'selected' : ''}>In Progress</option>
          <option value="Completed" ${req.status === 'Completed' ? 'selected' : ''}>Completed</option>
        </select>
        <button class="del" data-id="${req.id}">🗑 Delete</button>
      `;
      container.appendChild(el);
    });
  } catch (err) {
    container.innerHTML = '<p style="color:red;">Failed to load requests.</p>';
  }
}

// 🚀 Initialize on DOM load
window.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('reqBtn')) {
    document.getElementById('pickupForm').addEventListener('submit', sendRequest);
    loadUserRequests();
  }

  if (document.getElementById('allRequests')) {
    loadAdmin();
    document.getElementById('allRequests').addEventListener('click', handleAdminClick);
    document.getElementById('allRequests').addEventListener('change', handleStatusChange);
    setInterval(loadAdmin, 8000); // auto-refresh
  }
});
