

(function () {
  'use strict';

  const $ = (sel) => document.querySelector(sel);

  const ICONS = {
    connected: `<svg viewBox="0 0 64 64"><circle cx="32" cy="32" r="24" fill="#E8F5E9" stroke="#4CAF50" stroke-width="3"/><path d="M20 32l8 8 16-16" fill="none" stroke="#4CAF50" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    connecting: `<svg viewBox="0 0 64 64"><circle cx="32" cy="32" r="24" fill="#FFF3E0" stroke="#FF9800" stroke-width="3"/><circle cx="22" cy="36" r="3" fill="#FF9800"><animate attributeName="opacity" values="1;0.3;1" dur="1.2s" repeatCount="indefinite"/></circle><circle cx="32" cy="36" r="3" fill="#FF9800"><animate attributeName="opacity" values="0.3;1;0.3" dur="1.2s" repeatCount="indefinite"/></circle><circle cx="42" cy="36" r="3" fill="#FF9800"><animate attributeName="opacity" values="0.3;0.3;1" dur="1.2s" repeatCount="indefinite" begin="0.2s"/></circle></svg>`,
    disconnected: `<svg viewBox="0 0 64 64"><circle cx="32" cy="32" r="24" fill="#FFEBEE" stroke="#F44336" stroke-width="3"/><path d="M22 22l20 20M42 22l-20 20" fill="none" stroke="#F44336" stroke-width="4" stroke-linecap="round"/></svg>`,
    error: `<svg viewBox="0 0 64 64"><path d="M32 4L4 56h56L32 4z" fill="#FFF3E0" stroke="#F44336" stroke-width="2"/><path d="M32 22v16M32 42v4" stroke="#F44336" stroke-width="3.5" stroke-linecap="round"/></svg>`,
    send: `<svg viewBox="0 0 32 32" fill="white"><path d="M16 4v18M10 10l6-6 6 6" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M6 20v6c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2v-6" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round"/></svg>`,
    folder: `<svg viewBox="0 0 48 48"><path d="M6 10v28c0 1.1.9 2 2 2h32c1.1 0 2-.9 2-2V16c0-1.1-.9-2-2-2H22l-4-4H8c-1.1 0-2 .9-2 2z" fill="#FFC107"/><path d="M6 14h36v24c0 1.1-.9 2-2 2H8c-1.1 0-2-.9-2-2V14z" fill="#FFD54F"/></svg>`,
    fileReceived: `<svg viewBox="0 0 48 48"><path d="M12 4h18l10 10v28c0 1.1-.9 2-2 2H12c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" fill="#E8F5E9"/><path d="M30 4l10 10H32c-1.1 0-2-.9-2-2V4z" fill="#A5D6A7"/><path d="M24 20v14M18 28l6 6 6-6" fill="none" stroke="#4CAF50" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    emptyFiles: `<svg viewBox="0 0 64 64"><rect x="14" y="14" width="36" height="40" rx="3" fill="none" stroke="#CCC" stroke-width="2" stroke-dasharray="4"/><path d="M28 30h8M24 38h16" stroke="#DDD" stroke-width="2" stroke-linecap="round"/></svg>`,
    windows: `<svg viewBox="0 0 48 48"><path d="M6 10l16-2.5v15H6z" fill="#F25022"/><path d="M24 7.2L42 4.5v19H24z" fill="#7FBA00"/><path d="M6 25.5h16V40L6 37.5z" fill="#00A4EF"/><path d="M24 25.5h18v18.5L24 40.5z" fill="#FFB900"/></svg>`,
    wifi: `<svg viewBox="0 0 16 16" fill="rgba(255,255,255,0.85)"><path d="M8 12a1.5 1.5 0 110 3 1.5 1.5 0 010-3z"/><path d="M4.5 9.5a5 5 0 017 0" fill="none" stroke="rgba(255,255,255,0.85)" stroke-width="1.2" stroke-linecap="round"/><path d="M2 7a8 8 0 0112 0" fill="none" stroke="rgba(255,255,255,0.85)" stroke-width="1.2" stroke-linecap="round"/></svg>`,
    battery: `<svg viewBox="0 0 16 16" fill="rgba(255,255,255,0.85)"><rect x="1" y="4" width="12" height="8" rx="1" fill="none" stroke="rgba(255,255,255,0.85)" stroke-width="1.2"/><rect x="13" y="6" width="2" height="4" rx="0.5" fill="rgba(255,255,255,0.85)"/><rect x="2.5" y="5.5" width="9" height="5" rx="0.5" fill="rgba(255,255,255,0.85)"/></svg>`
  };

  let peerManager = null;
  let fileTransfer = null;
  let sessionId = null;
  let isConnected = false;

  function init() {
    renderIcons();
    updateClock();
    setInterval(updateClock, 30000);

    const params = new URLSearchParams(window.location.search);
    sessionId = params.get('session');

    if (!sessionId) {
      showError('No Session', 'Scan the QR code from the PC to connect.');
      return;
    }

    showLoading();
    connectToSession(sessionId);
    setupSendButton();
  }

  function renderIcons() {
    const wifiEl = $('#statusWifi');
    const battEl = $('#statusBattery');
    const connIcon = $('#connIcon');
    const sendIcon = $('#sendBtnIcon');
    const filesIcon = $('#filesHeaderIcon');
    const emptyIcon = $('#filesEmptyIcon');
    const startLogo = $('#miniStartLogo');

    if (wifiEl) wifiEl.innerHTML = ICONS.wifi;
    if (battEl) battEl.innerHTML = ICONS.battery;
    if (connIcon) connIcon.innerHTML = ICONS.connecting;
    if (sendIcon) sendIcon.innerHTML = ICONS.send;
    if (filesIcon) filesIcon.innerHTML = ICONS.folder;
    if (emptyIcon) emptyIcon.innerHTML = ICONS.emptyFiles;
    if (startLogo) startLogo.innerHTML = ICONS.windows;
  }

  function connectToSession(sid) {
    peerManager = new PeerManager();
    fileTransfer = new FileTransfer(peerManager);

    peerManager.onConnected = () => {
      isConnected = true;
      showConnected();
    };

    peerManager.onDisconnected = () => {
      isConnected = false;
      showDisconnected();
    };

    peerManager.onError = (message) => {
      showError('Connection Error', message);
    };

    fileTransfer.onTransferStart = (info) => {
      if (info.direction === 'receive') {
        showProgress(info.name, 0);
      } else {
        showProgress(info.name, 0);
      }
    };

    fileTransfer.onProgress = (info) => {
      updateProgress(info.progress, info.name);
    };

    fileTransfer.onFileReceived = (info) => {
      hideProgress();
      addReceivedFile(info);
    };

    fileTransfer.onTransferComplete = (info) => {
      if (info.direction === 'send') {
        hideProgress();
      }
    };

    fileTransfer.onError = (message) => {
      hideProgress();
      showToast(message);
    };

    peerManager.joinSession(sid);
  }

  function setupSendButton() {
    const sendBtn = $('#sendBtn');
    const fileInput = $('#mobileFileInput');

    if (sendBtn) {
      sendBtn.addEventListener('click', () => {
        if (!isConnected) {
          showToast('Not connected to PC');
          return;
        }
        if (fileInput) fileInput.click();
      });
    }

    if (fileInput) {
      fileInput.addEventListener('change', () => {
        if (fileInput.files.length > 0) {
          for (const file of fileInput.files) {
            fileTransfer.sendFile(file);
          }
          fileInput.value = '';
        }
      });
    }
  }

  function showLoading() {
    const viewLoading = $('#viewLoading');
    const viewMain = $('#viewMain');
    const viewError = $('#viewError');
    if (viewLoading) viewLoading.classList.remove('hidden');
    if (viewMain) viewMain.classList.add('hidden');
    if (viewError) viewError.classList.add('hidden');
  }

  function showConnected() {
    const viewLoading = $('#viewLoading');
    const viewMain = $('#viewMain');
    const viewError = $('#viewError');
    if (viewLoading) viewLoading.classList.add('hidden');
    if (viewMain) viewMain.classList.remove('hidden');
    if (viewError) viewError.classList.add('hidden');

    const connIcon = $('#connIcon');
    const connTitle = $('#connTitle');
    const connSub = $('#connSubtitle');
    const sendBtn = $('#sendBtn');

    if (connIcon) connIcon.innerHTML = ICONS.connected;
    if (connTitle) connTitle.textContent = 'Connected';
    if (connSub) {
      connSub.textContent = 'Ready to transfer files';
      connSub.className = 'conn-card-subtitle connected-text';
    }
    if (sendBtn) sendBtn.disabled = false;
  }

  function showDisconnected() {
    const connIcon = $('#connIcon');
    const connTitle = $('#connTitle');
    const connSub = $('#connSubtitle');
    const sendBtn = $('#sendBtn');

    if (connIcon) connIcon.innerHTML = ICONS.disconnected;
    if (connTitle) connTitle.textContent = 'Disconnected';
    if (connSub) {
      connSub.textContent = 'Connection lost. Refresh to reconnect.';
      connSub.className = 'conn-card-subtitle';
    }
    if (sendBtn) sendBtn.disabled = true;
  }

  function showError(title, message) {
    const viewLoading = $('#viewLoading');
    const viewMain = $('#viewMain');
    const viewError = $('#viewError');
    const errIcon = $('#errorIcon');
    const errTitle = $('#errorTitle');
    const errMsg = $('#errorMessage');

    if (viewLoading) viewLoading.classList.add('hidden');
    if (viewMain) viewMain.classList.add('hidden');
    if (viewError) viewError.classList.remove('hidden');
    if (errIcon) errIcon.innerHTML = ICONS.error;
    if (errTitle) errTitle.textContent = title;
    if (errMsg) errMsg.textContent = message;
  }

  function showProgress(filename, progress) {
    const container = $('#progressContainer');
    if (!container) return;

    container.classList.remove('hidden');
    container.innerHTML = `
      <div class="mobile-progress">
        <div class="progress-header">
          <span class="progress-filename">${escapeHtml(filename)}</span>
          <span class="progress-percent" id="progressPct">0%</span>
        </div>
        <div class="xp-progress-bar">
          <div class="xp-progress-fill" id="progressFill" style="width:0%"></div>
        </div>
        <div class="progress-detail" id="progressDetail">Transferring...</div>
      </div>
    `;
  }

  function updateProgress(progress, name) {
    const fill = $('#progressFill');
    const pct = $('#progressPct');
    const detail = $('#progressDetail');
    const percent = Math.round(progress * 100);

    if (fill) fill.style.width = percent + '%';
    if (pct) pct.textContent = percent + '%';
    if (detail) detail.textContent = percent < 100 ? 'Transferring...' : 'Completing...';
  }

  function hideProgress() {
    const container = $('#progressContainer');
    if (container) {
      setTimeout(() => {
        container.classList.add('hidden');
        container.innerHTML = '';
      }, 500);
    }
  }

  function addReceivedFile(info) {
    const list = $('#filesList');
    if (!list) return;

    const empty = list.querySelector('.files-empty');
    if (empty) empty.remove();

    const item = document.createElement('div');
    item.className = 'mobile-file-item';
    item.innerHTML = `
      <div class="mf-icon">${ICONS.fileReceived}</div>
      <div class="mf-info">
        <div class="mf-name">${escapeHtml(info.name)}</div>
        <div class="mf-size">${formatSize(info.size)}</div>
      </div>
      <div class="mf-action">
        <a href="${info.url}" download="${escapeHtml(info.name)}" class="xp-button" style="text-decoration:none">Save</a>
      </div>
    `;
    list.prepend(item);
  }

  function showToast(message) {
    let toast = $('#mobileToast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'mobileToast';
      toast.style.cssText = `
        position:fixed;bottom:50px;left:50%;transform:translateX(-50%);
        background:rgba(0,0,0,0.85);color:white;padding:10px 20px;border-radius:6px;
        font-size:13px;z-index:9999;text-align:center;max-width:300px;
        animation:slideUp 0.3s ease-out;
        box-shadow:0 4px 12px rgba(0,0,0,0.3);
      `;
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.style.display = 'block';
    setTimeout(() => {
      if (toast) toast.style.display = 'none';
    }, 3000);
  }

  function updateClock() {
    const now = new Date();
    let h = now.getHours();
    const m = now.getMinutes().toString().padStart(2, '0');
    const ampm = h >= 12 ? 'PM' : 'AM';
    h = h % 12 || 12;
    const timeStr = `${h}:${m} ${ampm}`;
    const el = $('#miniClock');
    const el2 = $('#statusClock');
    if (el) el.textContent = timeStr;
    if (el2) el2.textContent = `${h}:${m}`;
  }

  function formatSize(bytes) {
    if (bytes === 0) return '0 B';
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return (bytes / Math.pow(1024, i)).toFixed(i > 0 ? 1 : 0) + ' ' + sizes[i];
  }

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  window.addEventListener('beforeunload', () => {
    if (peerManager) peerManager.destroy();
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
