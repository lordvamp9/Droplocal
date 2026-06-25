

class FileTransfer {
  constructor(peerManager) {
    this.peer = peerManager;

    this.CHUNK_SIZE = 131072; // 128KB chunks for better speed on large files 

    this.receiving = {};
    this.activeReceiveId = null; 
    this.sending = false;
    this.sendQueue = [];

    this.onTransferStart = null;
    this.onProgress = null;
    this.onFileReceived = null;
    this.onTransferComplete = null;
    this.onError = null;

    this.peer.onData = (data) => this._handleData(data);
  }

  async sendFile(file) {
    if (!this.peer.isConnected) {
      if (this.onError) {
        this.onError('Not connected. Cannot send file.');
      }
      return;
    }

    if (this.sending) {
      this.sendQueue.push(file);
      return;
    }

    this.sending = true;
    const transferId = Date.now().toString(36) + Math.random().toString(36).substring(2, 6);
    const totalChunks = Math.ceil(file.size / this.CHUNK_SIZE);

    const startMeta = JSON.stringify({
      type: 'file-start',
      transferId: transferId,
      name: file.name,
      size: file.size,
      mime: file.type || 'application/octet-stream',
      totalChunks: totalChunks
    });
    this.peer.send(startMeta);

    if (this.onTransferStart) {
      this.onTransferStart({
        transferId: transferId,
        name: file.name,
        size: file.size,
        direction: 'send'
      });
    }

    try {
      const buffer = await file.arrayBuffer();

      for (let i = 0; i < totalChunks; i++) {
        if (!this.peer.isConnected) {
          throw new Error('Connection lost during transfer');
        }

        const start = i * this.CHUNK_SIZE;
        const end = Math.min(start + this.CHUNK_SIZE, file.size);
        const chunk = buffer.slice(start, end);

        this.peer.send(chunk);

        if (this.onProgress && i % 10 === 0 || i === totalChunks - 1) { 
          this.onProgress({
            transferId: transferId,
            name: file.name,
            progress: (i + 1) / totalChunks,
            sent: Math.min(end, file.size),
            total: file.size,
            direction: 'send'
          });
        }

        if (i % 64 === 63) {
          await this._sleep(5);
        }
      }

      const endMeta = JSON.stringify({
        type: 'file-end',
        transferId: transferId
      });
      this.peer.send(endMeta);

      if (this.onTransferComplete) {
        this.onTransferComplete({
          transferId: transferId,
          name: file.name,
          size: file.size,
          direction: 'send'
        });
      }

    } catch (err) {
      console.error('[FileTransfer] Send error:', err);
      if (this.onError) {
        this.onError(`Failed to send "${file.name}": ${err.message}`);
      }
    }

    this.sending = false;

    if (this.sendQueue.length > 0) {
      const next = this.sendQueue.shift();
      this.sendFile(next);
    }
  }

  _handleData(data) {
    if (typeof data === 'string') {
      try {
        const msg = JSON.parse(data);
        if (msg.type === 'file-start') {
          this._handleFileStart(msg);
        } else if (msg.type === 'file-end') {
          this._handleFileEnd(msg);
        }
      } catch (e) {
        console.error("Failed to parse string metadata", e);
      }
    } else {

      this._handleFileChunk(data);
    }
  }

  _handleFileStart(data) {
    this.activeReceiveId = data.transferId;
    this.receiving[data.transferId] = {
      name: data.name,
      size: data.size,
      mime: data.mime,
      totalChunks: data.totalChunks,
      chunks: [], 
      received: 0,
      startTime: Date.now()
    };

    if (this.onTransferStart) {
      this.onTransferStart({
        transferId: data.transferId,
        name: data.name,
        size: data.size,
        direction: 'receive'
      });
    }
  }

  _handleFileChunk(data) {
    if (!this.activeReceiveId) return; 

    const transfer = this.receiving[this.activeReceiveId];
    if (!transfer) return;

    transfer.chunks.push(data);
    transfer.received++;

    if (this.onProgress && transfer.received % 10 === 0 || transfer.received === transfer.totalChunks) {
      this.onProgress({
        transferId: this.activeReceiveId,
        name: transfer.name,
        progress: transfer.received / transfer.totalChunks,
        sent: transfer.chunks.reduce((acc, c) => acc + (c.byteLength || c.length || 0), 0),
        total: transfer.size,
        direction: 'receive'
      });
    }
  }

  _handleFileEnd(data) {
    const transfer = this.receiving[data.transferId];
    if (!transfer) return;

    const blob = new Blob(transfer.chunks, { type: transfer.mime });
    const url = URL.createObjectURL(blob);
    const elapsed = ((Date.now() - transfer.startTime) / 1000).toFixed(1);

    if (this.onFileReceived) {
      this.onFileReceived({
        transferId: data.transferId,
        name: transfer.name,
        size: transfer.size,
        mime: transfer.mime,
        url: url,
        elapsed: elapsed
      });
    }

    if (this.onTransferComplete) {
      this.onTransferComplete({
        transferId: data.transferId,
        name: transfer.name,
        size: transfer.size,
        direction: 'receive'
      });
    }

    delete this.receiving[data.transferId];
    this.activeReceiveId = null;
  }

  _formatSize(bytes) {
    if (bytes === 0) return '0 B';
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return (bytes / Math.pow(1024, i)).toFixed(i > 0 ? 1 : 0) + ' ' + sizes[i];
  }

  _sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
