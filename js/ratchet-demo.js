/**
 * Double-Ratchet Cryptographic Simulator
 * Implements a visual simulation of Signal's Double-Ratchet Algorithm (DH Ratchet + Symmetric KDF Chains)
 * Featuring Forward Secrecy & Post-Compromise Security demonstrations.
 */

class DoubleRatchetSimulator {
  constructor() {
    this.state = {
      alice: {
        dhPair: 'DH_A1 (0x8F3A)',
        sendChainStep: 0,
        recvChainStep: 0,
        status: 'Active / Synced'
      },
      bob: {
        dhPair: 'DH_B1 (0x4E19)',
        sendChainStep: 0,
        recvChainStep: 0,
        status: 'Active / Synced'
      },
      rootKey: '0x9B22...C01A',
      currentCiphertext: '7f9a2b0c99ef4128ab77d4',
      messageCount: 0,
      turn: 'alice',
      isCompromised: false,
      logs: []
    };

    this.messages = [
      "Let's discuss the cryptographic protocol design.",
      "Got it! Initial DH shared secret established.",
      "Notice how our symmetric KDF advances with each message.",
      "Even if an ephemeral key is stolen, the next DH step restores security!",
      "Signal protocol double-ratchet ensures forward & post-compromise secrecy."
    ];

    this.initDOM();
  }

  initDOM() {
    this.aliceKeyEl = document.getElementById('alice-dh-key');
    this.bobKeyEl = document.getElementById('bob-dh-key');
    this.rootKeyEl = document.getElementById('root-key-val');
    this.cipherEl = document.getElementById('cipher-val');
    this.logContainer = document.getElementById('ratchet-log-box');
    this.sendBtn = document.getElementById('ratchet-send-btn');
    this.compromiseBtn = document.getElementById('ratchet-compromise-btn');
    this.resetBtn = document.getElementById('ratchet-reset-btn');

    if (this.sendBtn) {
      this.sendBtn.addEventListener('click', () => this.handleSendMessage());
    }
    if (this.compromiseBtn) {
      this.compromiseBtn.addEventListener('click', () => this.handleCompromise());
    }
    if (this.resetBtn) {
      this.resetBtn.addEventListener('click', () => this.handleReset());
    }

    this.log("Double-Ratchet Engine initialized with Root Key & DH Ephemeral Keypairs.");
    this.updateUI();
  }

  log(text, type = 'info') {
    const time = new Date().toLocaleTimeString().split(' ')[0];
    this.state.logs.unshift(`[${time}] ${text}`);
    if (this.state.logs.length > 8) this.state.logs.pop();

    if (this.logContainer) {
      this.logContainer.innerHTML = this.state.logs
        .map(l => `<div class="log-line ${type}">${l}</div>`)
        .join('');
    }
  }

  generateRandomHex(length = 6) {
    const chars = '0123456789ABCDEF';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  handleSendMessage() {
    this.state.messageCount++;
    const sender = this.state.turn;
    const receiver = sender === 'alice' ? 'bob' : 'alice';
    const msgText = this.messages[(this.state.messageCount - 1) % this.messages.length];

    // Simulate KDF step
    this.state[sender].sendChainStep++;
    this.state[receiver].recvChainStep++;

    // Generate simulated ciphertext & message key
    const mk = `MK_${this.generateRandomHex(4)}`;
    this.state.currentCiphertext = `ENC_${this.generateRandomHex(8)}_${mk}`;

    // Perform DH Ratchet step when turn changes
    const newHex = this.generateRandomHex(4);
    if (sender === 'alice') {
      this.state.alice.dhPair = `DH_A${Math.floor(this.state.messageCount / 2) + 1} (0x${newHex})`;
      this.log(`Alice advances KDF chain & sends ciphertext: "${msgText.substring(0, 32)}..."`);
    } else {
      this.state.bob.dhPair = `DH_B${Math.floor(this.state.messageCount / 2) + 1} (0x${newHex})`;
      this.log(`Bob advances DH Ratchet & KDF chain with new key ${this.state.bob.dhPair}`);
    }

    // Advance Root Key via KDF_RK(RK, DH_out)
    this.state.rootKey = `0x${this.generateRandomHex(4)}...${this.generateRandomHex(4)}`;

    if (this.state.isCompromised) {
      this.log("🛡️ Post-Compromise Security Triggered: New DH exchange re-keyed Root Key! Adversary locked out.", "success");
      this.state.isCompromised = false;
    }

    // Toggle turn
    this.state.turn = receiver;
    this.updateUI();
  }

  handleCompromise() {
    this.state.isCompromised = true;
    this.log("⚠️ SIMULATED ATTACK: Ephemeral message key leaked to eavesdropper.", "warning");
    this.log("🔒 Forward Secrecy guarantees past messages remain unreadable. Next message DH ratchet will re-establish confidentiality.");
    this.updateUI();
  }

  handleReset() {
    this.state = {
      alice: { dhPair: 'DH_A1 (0x8F3A)', sendChainStep: 0, recvChainStep: 0, status: 'Active / Synced' },
      bob: { dhPair: 'DH_B1 (0x4E19)', sendChainStep: 0, recvChainStep: 0, status: 'Active / Synced' },
      rootKey: '0x9B22...C01A',
      currentCiphertext: '7f9a2b0c99ef4128ab77d4',
      messageCount: 0,
      turn: 'alice',
      isCompromised: false,
      logs: []
    };
    this.log("Ratchet state reset to initial parameters.");
    this.updateUI();
  }

  updateUI() {
    if (this.aliceKeyEl) this.aliceKeyEl.textContent = this.state.alice.dhPair;
    if (this.bobKeyEl) this.bobKeyEl.textContent = this.state.bob.dhPair;
    if (this.rootKeyEl) this.rootKeyEl.textContent = this.state.rootKey;
    if (this.cipherEl) this.cipherEl.textContent = this.state.currentCiphertext;
    
    if (this.sendBtn) {
      const nextSender = this.state.turn === 'alice' ? 'Alice → Bob' : 'Bob → Alice';
      this.sendBtn.innerHTML = `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
        Send Step (${nextSender})
      `;
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.ratchetSim = new DoubleRatchetSimulator();
});
