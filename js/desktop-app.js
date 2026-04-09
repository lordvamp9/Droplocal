

(function () {
  'use strict';

  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => document.querySelectorAll(sel);

  const ICONS = {
    folder: `<svg viewBox="0 0 48 48"><path d="M6 10v28c0 1.1.9 2 2 2h32c1.1 0 2-.9 2-2V16c0-1.1-.9-2-2-2H22l-4-4H8c-1.1 0-2 .9-2 2z" fill="#FFC107"/><path d="M6 14h36v24c0 1.1-.9 2-2 2H8c-1.1 0-2-.9-2-2V14z" fill="#FFD54F"/></svg>`,
    file: `<svg viewBox="0 0 48 48"><path d="M12 4h18l10 10v28c0 1.1-.9 2-2 2H12c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" fill="#E3F2FD"/><path d="M30 4l10 10H32c-1.1 0-2-.9-2-2V4z" fill="#90CAF9"/><path d="M12 4h18l10 10v28c0 1.1-.9 2-2 2H12c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" fill="none" stroke="#64B5F6" stroke-width="1"/></svg>`,
    fileDown: `<svg viewBox="0 0 48 48"><path d="M12 4h18l10 10v28c0 1.1-.9 2-2 2H12c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" fill="#E8F5E9"/><path d="M30 4l10 10H32c-1.1 0-2-.9-2-2V4z" fill="#A5D6A7"/><path d="M24 20v14M18 28l6 6 6-6" fill="none" stroke="#4CAF50" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    fileSend: `<svg viewBox="0 0 48 48"><path d="M12 4h18l10 10v28c0 1.1-.9 2-2 2H12c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" fill="#E3F2FD"/><path d="M30 4l10 10H32c-1.1 0-2-.9-2-2V4z" fill="#90CAF9"/><path d="M24 34V20M18 26l6-6 6 6" fill="none" stroke="#2196F3" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    computer: `<svg viewBox="0 0 48 48"><rect x="6" y="6" width="36" height="26" rx="2" fill="#455A64"/><rect x="9" y="9" width="30" height="20" rx="1" fill="#64B5F6"/><rect x="16" y="34" width="16" height="4" rx="1" fill="#78909C"/><rect x="12" y="38" width="24" height="3" rx="1.5" fill="#90A4AE"/></svg>`,
    network: `<svg viewBox="0 0 48 48"><circle cx="24" cy="12" r="6" fill="#42A5F5"/><circle cx="10" cy="36" r="6" fill="#66BB6A"/><circle cx="38" cy="36" r="6" fill="#FFA726"/><line x1="24" y1="18" x2="10" y2="30" stroke="#90A4AE" stroke-width="2"/><line x1="24" y1="18" x2="38" y2="30" stroke="#90A4AE" stroke-width="2"/></svg>`,
    recycle: `<svg viewBox="0 0 48 48"><path d="M8 14h32v26c0 2.2-1.8 4-4 4H12c-2.2 0-4-1.8-4-4V14z" fill="#78909C"/><path d="M8 14h32v4H8z" fill="#546E7A"/><rect x="14" y="6" width="20" height="8" rx="1" fill="#90A4AE"/><path d="M18 20v18M24 20v18M30 20v18" stroke="#546E7A" stroke-width="1.5"/></svg>`,
    windows: `<svg viewBox="0 0 48 48"><path d="M6 10l16-2.5v15H6z" fill="#F25022"/><path d="M24 7.2L42 4.5v19H24z" fill="#7FBA00"/><path d="M6 25.5h16V40L6 37.5z" fill="#00A4EF"/><path d="M24 25.5h18v18.5L24 40.5z" fill="#FFB900"/></svg>`,
    volume: `<svg viewBox="0 0 16 16" fill="white"><path d="M3 5.5v5h3l4 3V2.5l-4 3H3z"/><path d="M12.5 4c1.5 1.5 1.5 6.5 0 8" fill="none" stroke="white" stroke-width="1.2"/></svg>`,
    wifi: `<svg viewBox="0 0 16 16" fill="white"><path d="M8 12a1.5 1.5 0 110 3 1.5 1.5 0 010-3z"/><path d="M4.5 9.5a5 5 0 017 0" fill="none" stroke="white" stroke-width="1.2" stroke-linecap="round"/><path d="M2 7a8 8 0 0112 0" fill="none" stroke="white" stroke-width="1.2" stroke-linecap="round"/></svg>`,
    dropFile: `<svg viewBox="0 0 64 64"><rect x="14" y="8" width="36" height="48" rx="3" fill="#E3F2FD" stroke="#90CAF9" stroke-width="2"/><path d="M26 8l-12 12h10c1.1 0 2-.9 2-2V8z" fill="#BBDEFB"/><path d="M32 26v18M26 38l6 6 6-6" fill="none" stroke="#42A5F5" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`
  };

  let peerManager = null;
  let fileTransfer = null;
  let connected = false;
  let qrRefreshTimer = null;

  function init() {
    renderStaticIcons();
    updateClock();
    setInterval(updateClock, 30000);
    setupDragDrop();
    setupFileInput();
    initSession();
  }

  function renderStaticIcons() {

    const iconData = [
      { name: 'Mi PC', icon: ICONS.computer },
      { name: 'Mis sitios\nde red', icon: ICONS.network },
      { name: 'Papelera', icon: ICONS.recycle }
    ];
    const container = $('#desktopIcons');
    if (container) {
      container.innerHTML = iconData.map(it => `
        <div class="desktop-icon">
          <div class="icon-img">${it.icon}</div>
          <span>${it.name}</span>
        </div>
      `).join('');
    }

    const startLogo = $('#startLogo');
    if (startLogo) startLogo.innerHTML = ICONS.windows;

    const volIcon = $('#trayVolume');
    if (volIcon) volIcon.innerHTML = ICONS.volume;
    const wifiIcon = $('#trayWifi');
    if (wifiIcon) wifiIcon.innerHTML = ICONS.wifi;

    const tbIcon = $('#titlebarIcon');
    if (tbIcon) tbIcon.innerHTML = ICONS.folder;

    const dzIcon = $('#dropZoneIcon');
    if (dzIcon) dzIcon.innerHTML = ICONS.dropFile;

    const tlIcon = $('#transferLogIcon');
    if (tlIcon) tlIcon.innerHTML = ICONS.folder;

    const srcFolder = $('#copySrcFolder');
    const dstFolder = $('#copyDstFolder');
    if (srcFolder) srcFolder.innerHTML = ICONS.folder;
    if (dstFolder) dstFolder.innerHTML = ICONS.folder;

    $$('.flying-paper-svg').forEach(el => {
      el.innerHTML = ICONS.file;
    });
  }

  function updateClock() {
    const now = new Date();
    let h = now.getHours();
    const m = now.getMinutes().toString().padStart(2, '0');
    const ampm = h >= 12 ? 'PM' : 'AM';
    h = h % 12 || 12;
    const clockEl = $('#taskbarClock');
    if (clockEl) clockEl.textContent = `${h}:${m} ${ampm}`;
  }

  function initSession() {
    peerManager = new PeerManager();
    fileTransfer = new FileTransfer(peerManager);

    peerManager.onSessionCreated = (id) => {
      updateSessionDisplay(id);
      generateQR(id);
    };

    peerManager.onConnected = () => {
      connected = true;
      updateConnectionStatus('connected');

      if (qrRefreshTimer) {
        clearInterval(qrRefreshTimer);
        qrRefreshTimer = null;
      }
    };

    peerManager.onDisconnected = () => {
      connected = false;
      updateConnectionStatus('disconnected');

      startQRRefresh();
    };

    peerManager.onError = (message) => {
      console.error('[Desktop] Error:', message);
      showNotification('Error', message, 'error');
    };

    fileTransfer.onTransferStart = (info) => {
      addTransferItem(info);
      if (info.direction === 'receive') {
        showCopyDialog(info.name);
      }
    };

    fileTransfer.onProgress = (info) => {
      updateTransferProgress(info);
      if (info.direction === 'receive') {
        updateCopyDialogProgress(info.progress);
      }
    };

    fileTransfer.onFileReceived = (info) => {
      completeTransferItem(info);
      hideCopyDialog();
      showNotification('File Received', `"${info.name}" received successfully in ${info.elapsed}s`);
    };

    fileTransfer.onTransferComplete = (info) => {
      if (info.direction === 'send') {
        completeTransferItemByDir(info, 'send');
      }
    };

    fileTransfer.onError = (message) => {
      showNotification('Transfer Error', message, 'error');
      hideCopyDialog();
    };

    peerManager.createSession();
    updateConnectionStatus('waiting');
    startQRRefresh();
  }

  function generateQR(sessionId) {
    const container = $('#qrContainer');
    if (!container) return;

    const baseUrl = window.location.origin + window.location.pathname.replace(/[^/]*$/, '');
    const mobileUrl = `${baseUrl}?session=${sessionId}`;

    container.innerHTML = '';

    try {
      const qr = qrcode(0, 'M');
      qr.addData(mobileUrl);
      qr.make();

      const size = 6;
      const imgTag = qr.createImgTag(size, 0);
      container.innerHTML = imgTag;

      const img = container.querySelector('img');
      if (img) {
        img.style.display = 'block';
        img.style.imageRendering = 'pixelated';
      }
    } catch (e) {
      console.error('[QR] Error generating QR:', e);
      container.innerHTML = '<p style="color:#c00;font-size:11px;">QR Error</p>';
    }
  }

  function startQRRefresh() {
    if (qrRefreshTimer) clearInterval(qrRefreshTimer);

    qrRefreshTimer = setInterval(() => {
      if (connected) return;

      const oldPeer = peerManager;
      const oldTransfer = fileTransfer;

      peerManager = new PeerManager();
      fileTransfer = new FileTransfer(peerManager);

      peerManager.onSessionCreated = (id) => {
        updateSessionDisplay(id);
        generateQR(id);
        const qrEl = $('#qrContainer');
        if (qrEl) {
          qrEl.style.animation = 'qrRefresh 0.5s ease';
          setTimeout(() => { qrEl.style.animation = ''; }, 500);
        }
      };

      peerManager.onConnected = () => {
        connected = true;
        updateConnectionStatus('connected');
        if (qrRefreshTimer) {
          clearInterval(qrRefreshTimer);
          qrRefreshTimer = null;
        }
      };

      peerManager.onDisconnected = () => {
        connected = false;
        updateConnectionStatus('disconnected');
        startQRRefresh();
      };

      peerManager.onError = (message) => {
        showNotification('Error', message, 'error');
      };

      fileTransfer.onTransferStart = (info) => {
        addTransferItem(info);
        if (info.direction === 'receive') showCopyDialog(info.name);
      };
      fileTransfer.onProgress = (info) => {
        updateTransferProgress(info);
        if (info.direction === 'receive') updateCopyDialogProgress(info.progress);
      };
      fileTransfer.onFileReceived = (info) => {
        completeTransferItem(info);
        hideCopyDialog();
        showNotification('File Received', `"${info.name}" received in ${info.elapsed}s`);
      };
      fileTransfer.onTransferComplete = (info) => {
        if (info.direction === 'send') completeTransferItemByDir(info, 'send');
      };
      fileTransfer.onError = (message) => {
        showNotification('Transfer Error', message, 'error');
        hideCopyDialog();
      };

      oldPeer.destroy();
      peerManager.createSession();
    }, 30000);
  }

  function updateSessionDisplay(id) {
    const el1 = $('#sessionId');
    const el2 = $('#sessionIdDisplay');
    if (el1) el1.textContent = id;
    if (el2) el2.textContent = id;
  }

  function updateConnectionStatus(status) {
    const indicator = $('#connIndicator');
    const toolbarStatus = $('#connectionStatus');

    if (indicator) {
      indicator.className = 'conn-status ' + status;
      const dot = indicator.querySelector('.conn-dot');
      const text = indicator.querySelector('.conn-text');
      if (text) {
        switch (status) {
          case 'waiting':
            text.textContent = 'Waiting for device...';
            break;
          case 'connected':
            text.textContent = 'Device connected';
            break;
          case 'disconnected':
            text.textContent = 'Disconnected';
            break;
        }
      }
    }

    if (toolbarStatus) {
      switch (status) {
        case 'waiting':
          toolbarStatus.innerHTML = '<span style="color:rgba(255,200,100,0.9)">Waiting for device...</span>';
          break;
        case 'connected':
          toolbarStatus.innerHTML = '<span style="color:rgba(100,255,150,0.9);font-weight:bold">Connected</span>';
          break;
        case 'disconnected':
          toolbarStatus.innerHTML = '<span style="color:rgba(255,255,255,0.4)">Disconnected</span>';
          break;
      }
    }
  }

  function setupDragDrop() {
    const dropZone = $('#dropZone');
    if (!dropZone) return;

    ['dragenter', 'dragover'].forEach(evt => {
      dropZone.addEventListener(evt, (e) => {
        e.preventDefault();
        e.stopPropagation();
        dropZone.classList.add('drag-over');
      });
    });

    ['dragleave', 'drop'].forEach(evt => {
      dropZone.addEventListener(evt, (e) => {
        e.preventDefault();
        e.stopPropagation();
        dropZone.classList.remove('drag-over');
      });
    });

    dropZone.addEventListener('drop', (e) => {
      const files = e.dataTransfer.files;
      if (files.length > 0) {
        handleFiles(files);
      }
    });

    dropZone.addEventListener('click', () => {
      const fileInput = $('#fileInput');
      if (fileInput) fileInput.click();
    });
  }

  function setupFileInput() {
    const fileInput = $('#fileInput');
    const browseBtn = $('#browseBtn');

    if (fileInput) {
      fileInput.addEventListener('change', () => {
        if (fileInput.files.length > 0) {
          handleFiles(fileInput.files);
          fileInput.value = '';
        }
      });
    }

    if (browseBtn) {
      browseBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (fileInput) fileInput.click();
      });
    }
  }

  function handleFiles(files) {
    if (!connected) {
      showNotification('Not connected', 'Wait for a device to connect first.', 'error');
      return;
    }
    for (const file of files) {
      fileTransfer.sendFile(file);
    }
  }

  function addTransferItem(info) {
    const list = $('#transferList');
    if (!list) return;

    const empty = list.querySelector('.transfer-empty');
    if (empty) empty.remove();

    const isSend = info.direction === 'send';
    const icon = isSend ? ICONS.fileSend : ICONS.fileDown;
    const statusClass = isSend ? 'sending' : 'receiving';
    const statusText = isSend ? 'Sending...' : 'Receiving...';

    const item = document.createElement('div');
    item.className = 'transfer-item';
    item.id = `transfer-${info.transferId}`;
    item.innerHTML = `
      <div class="t-icon">${icon}</div>
      <div class="t-info">
        <div class="t-name">${escapeHtml(info.name)}</div>
        <div class="t-meta">${formatSize(info.size)}</div>
      </div>
      <div class="t-progress">
        <div class="xp-progress-bar" style="height:12px">
          <div class="xp-progress-fill" id="progress-${info.transferId}" style="width:0%"></div>
        </div>
      </div>
      <span class="t-status ${statusClass}" id="status-${info.transferId}">${statusText}</span>
    `;
    list.prepend(item);
  }

  function updateTransferProgress(info) {
    const fill = $(`#progress-${info.transferId}`);
    if (fill) {
      fill.style.width = Math.round(info.progress * 100) + '%';
    }
  }

  function completeTransferItem(info) {
    const fill = $(`#progress-${info.transferId}`);
    const status = $(`#status-${info.transferId}`);
    const item = $(`#transfer-${info.transferId}`);

    if (fill) fill.style.width = '100%';
    if (status) {
      status.className = 't-status complete';
      status.innerHTML = `<a href="${info.url}" download="${escapeHtml(info.name)}" class="xp-button" style="font-size:10px;padding:2px 8px" onclick="event.stopPropagation()">Save</a>`;
    }
    if (item) {
      item.classList.add('complete');
    }
  }

  function completeTransferItemByDir(info, dir) {
    const status = $(`#status-${info.transferId}`);
    const fill = $(`#progress-${info.transferId}`);
    if (fill) fill.style.width = '100%';
    if (status) {
      status.className = 't-status complete';
      status.textContent = 'Sent';
    }
  }

  function showCopyDialog(filename) {
    const dialog = $('#copyDialog');
    const overlay = $('#copyOverlay');
    const nameEl = $('#copyFileName');
    const progressEl = $('#copyProgress');
    const detailsEl = $('#copyDetails');

    if (nameEl) nameEl.textContent = filename;
    if (progressEl) progressEl.style.width = '0%';
    if (detailsEl) detailsEl.textContent = '0% complete';
    if (dialog) dialog.classList.remove('hidden');
    if (overlay) overlay.classList.remove('hidden');
  }

  function updateCopyDialogProgress(progress) {
    const progressEl = $('#copyProgress');
    const detailsEl = $('#copyDetails');
    const pct = Math.round(progress * 100);
    if (progressEl) progressEl.style.width = pct + '%';
    if (detailsEl) detailsEl.textContent = pct + '% complete';
  }

  function hideCopyDialog() {
    const dialog = $('#copyDialog');
    const overlay = $('#copyOverlay');
    if (dialog) dialog.classList.add('hidden');
    if (overlay) overlay.classList.add('hidden');
  }

  function showNotification(title, message, type) {
    const el = document.createElement('div');
    el.className = 'xp-notification';
    el.innerHTML = `
      <div class="xp-window" style="animation:bounceIn 0.3s ease-out; background:#FFFFCC; border:1px solid #000; box-shadow:2px 2px 4px rgba(0,0,0,0.2); padding:8px 12px; position:absolute; bottom:20px; right:20px; z-index:1000; max-width:250px;">
        <div style="font-size:11px; font-family:Tahoma, sans-serif; font-weight:bold; color:#000; margin-bottom:4px;">
          ${escapeHtml(title)}
          <span style="float:right; cursor:pointer; color:#888; font-weight:normal; margin-left:10px" onclick="this.closest('.xp-notification').remove()">&times;</span>
        </div>
        <div style="font-size:10px; font-family:Tahoma, sans-serif; color:#333;">
          ${escapeHtml(message)}
        </div>
      </div>
    `;

    document.body.appendChild(el);
    setTimeout(() => { if (el.parentNode) el.remove(); }, 5000);
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

  document.addEventListener('click', (e) => {
    if (e.target.id === 'closeCopyDialog' || e.target.id === 'copyOverlay') {
      hideCopyDialog();
    }
  });

  window.addEventListener('beforeunload', () => {
    if (peerManager) peerManager.destroy();
    if (qrRefreshTimer) clearInterval(qrRefreshTimer);
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
