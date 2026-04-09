

class PeerManager {
  constructor() {
    this.peer = null;
    this.connection = null;
    this.sessionId = null;
    this.isHost = false;
    this.destroyed = false;

    this.onSessionCreated = null;
    this.onConnected = null;
    this.onDisconnected = null;
    this.onData = null;
    this.onError = null;
    this.onPeerOpen = null;
  }

  createSession() {
    this.isHost = true;
    this.sessionId = this._generateSessionId();

    this.peer = new Peer(this.sessionId, {
      debug: 0,
      config: {
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' },
          { urls: 'stun:stun1.l.google.com:19302' },
          { urls: 'stun:stun2.l.google.com:19302' },
          { urls: 'stun:stun3.l.google.com:19302' },
          { urls: 'stun:stun4.l.google.com:19302' }
        ]
      }
    });

    this.peer.on('open', (id) => {
      console.log('[PeerManager] Session created:', id);
      if (this.onPeerOpen) this.onPeerOpen(id);
      if (this.onSessionCreated) this.onSessionCreated(id);
    });

    this.peer.on('connection', (conn) => {

      if (this.connection) {
        console.warn('[PeerManager] Rejecting extra connection');
        conn.close();
        return;
      }
      console.log('[PeerManager] Incoming connection from:', conn.peer);
      this.connection = conn;
      this._setupConnection(conn);
    });

    this.peer.on('error', (err) => {
      console.error('[PeerManager] Error:', err);
      this._handleError(err);
    });

    this.peer.on('disconnected', () => {
      console.warn('[PeerManager] Disconnected from signaling server');
      if (!this.destroyed) {

        setTimeout(() => {
          if (!this.destroyed && this.peer) {
            try { this.peer.reconnect(); } catch (e) {  }
          }
        }, 2000);
      }
    });

    return this.sessionId;
  }

  joinSession(sessionId) {
    this.isHost = false;
    this.sessionId = sessionId;

    this.peer = new Peer({
      debug: 0,
      config: {
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' },
          { urls: 'stun:stun1.l.google.com:19302' },
          { urls: 'stun:stun2.l.google.com:19302' },
          { urls: 'stun:stun3.l.google.com:19302' },
          { urls: 'stun:stun4.l.google.com:19302' }
        ]
      }
    });

    this.peer.on('open', () => {
      console.log('[PeerManager] Connecting to session:', sessionId);
      if (this.onPeerOpen) this.onPeerOpen(this.peer.id);

      this.connection = this.peer.connect(sessionId, {
        reliable: true
      });
      this._setupConnection(this.connection);
    });

    this.peer.on('error', (err) => {
      console.error('[PeerManager] Error:', err);
      this._handleError(err);
    });
  }

  _setupConnection(conn) {
    conn.on('open', () => {
      console.log('[PeerManager] Connection opened');
      if (this.onConnected) this.onConnected();
    });

    conn.on('data', (data) => {
      if (this.onData) this.onData(data);
    });

    conn.on('close', () => {
      console.log('[PeerManager] Connection closed');
      this.connection = null;
      if (this.onDisconnected) this.onDisconnected();
    });

    conn.on('error', (err) => {
      console.error('[PeerManager] Connection error:', err);
      this._handleError(err);
    });
  }

  send(data) {
    if (this.connection && this.connection.open) {
      try {
        this.connection.send(data);
        return true;
      } catch (e) {
        console.error('[PeerManager] Send error:', e);
        return false;
      }
    }
    return false;
  }

  destroy() {
    this.destroyed = true;
    if (this.connection) {
      try { this.connection.close(); } catch (e) {  }
    }
    if (this.peer) {
      try { this.peer.destroy(); } catch (e) {  }
    }
    this.connection = null;
    this.peer = null;
    this.sessionId = null;
    console.log('[PeerManager] Session destroyed');
  }

  get isConnected() {
    return this.connection && this.connection.open;
  }

  _handleError(err) {
    let message = 'Connection error';

    if (err.type === 'peer-unavailable') {
      message = 'Session not found. The QR code may have expired.';
    } else if (err.type === 'network') {
      message = 'Network error. Check your internet connection.';
    } else if (err.type === 'server-error') {
      message = 'Signaling server error. Please try again.';
    } else if (err.type === 'unavailable-id') {
      message = 'Session ID already in use. Generating a new one...';
    } else if (err.message) {
      message = err.message;
    }

    if (this.onError) this.onError(message, err.type);
  }

  _generateSessionId() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let id = 'XD-';
    for (let i = 0; i < 6; i++) {
      id += chars[Math.floor(Math.random() * chars.length)];
    }
    return id;
  }
}
