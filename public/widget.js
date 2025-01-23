// AI Support Widget Loader
(function() {
  // Only initialize once
  if (window.aiWidgetInitialized) return;
  window.aiWidgetInitialized = true;

  // Get the base URL from the script source
  const scriptElement = document.currentScript || (function() {
    const scripts = document.getElementsByTagName('script');
    return scripts[scripts.length - 1];
  })();
  
  const baseUrl = scriptElement.src.substring(0, scriptElement.src.lastIndexOf('/'));
  
  // Chat history management
  const CHAT_HISTORY_KEY = 'ai_widget_chat_history';
  const MAX_HISTORY_MESSAGES = 10;

  function loadChatHistory() {
    try {
      const history = localStorage.getItem(CHAT_HISTORY_KEY);
      return history ? JSON.parse(history) : [];
    } catch (error) {
      console.error('Error loading chat history:', error);
      return [];
    }
  }

  function saveChatHistory(messages) {
    try {
      // Keep only the last MAX_HISTORY_MESSAGES
      const historyToSave = messages.slice(-MAX_HISTORY_MESSAGES);
      localStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(historyToSave));
    } catch (error) {
      console.error('Error saving chat history:', error);
    }
  }

  // Create styles
  const styles = document.createElement('style');
  styles.textContent = `
    .ai-widget-container {
      position: fixed !important;
      bottom: 80px !important;
      right: 20px !important;
      z-index: 999999 !important;
      width: 400px !important;
      max-width: calc(100vw - 40px) !important;
      height: 600px !important;
      max-height: calc(100vh - 120px) !important;
      background: white !important;
      border-radius: 16px !important;
      box-shadow: 0 4px 24px rgba(0, 0, 0, 0.15) !important;
      display: none !important;
      opacity: 0 !important;
      transform: translateY(20px) !important;
      transition: all 0.3s ease !important;
      overflow: hidden !important;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif !important;
      line-height: normal !important;
      box-sizing: border-box !important;
    }

    .ai-widget-container.visible {
      display: block !important;
      opacity: 1 !important;
      transform: translateY(0) !important;
    }

    .ai-widget-container * {
      box-sizing: border-box !important;
      margin: 0 !important;
      padding: 0 !important;
      font-size: 16px !important;
      line-height: 1.5 !important;
    }

    .ai-widget-header {
      background: #2563eb !important;
      color: white !important;
      padding: 16px !important;
      display: flex !important;
      align-items: center !important;
      justify-content: space-between !important;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1) !important;
      height: 64px !important;
    }

    .ai-widget-title {
      display: flex !important;
      align-items: center !important;
      gap: 8px !important;
      font-weight: 600 !important;
    }

    .ai-widget-avatar {
      width: 28px !important;
      height: 28px !important;
      border-radius: 50% !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      flex-shrink: 0 !important;
    }

    .ai-widget-controls {
      display: flex !important;
      gap: 8px !important;
    }

    .ai-widget-button {
      background: none !important;
      border: none !important;
      color: white !important;
      cursor: pointer !important;
      padding: 8px !important;
      border-radius: 50% !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      transition: background-color 0.2s !important;
      position: relative !important;
      z-index: 2 !important;
      width: 32px !important;
      height: 32px !important;
    }

    .ai-widget-button:hover {
      background: rgba(255, 255, 255, 0.1) !important;
    }

    .ai-widget-settings-panel {
      position: absolute !important;
      top: 64px !important;
      left: 0 !important;
      right: 0 !important;
      bottom: 0 !important;
      background: white !important;
      z-index: 3 !important;
      display: none !important;
      flex-direction: column !important;
      padding: 24px !important;
    }

    .ai-widget-settings-panel.visible {
      display: flex !important;
    }

    .ai-widget-settings-button {
      background: none !important;
      border: none !important;
      padding: 16px !important;
      width: 100% !important;
      text-align: left !important;
      cursor: pointer !important;
      border-radius: 12px !important;
      color: #1f2937 !important;
      transition: all 0.2s !important;
      font-size: 16px !important;
      margin-bottom: 8px !important;
    }

    .ai-widget-settings-button:hover {
      background: #f3f4f6 !important;
      transform: translateX(4px) !important;
    }

    .ai-widget-settings-button.back {
      background: #2563eb !important;
      color: white !important;
      font-weight: 600 !important;
      margin-top: auto !important;
      margin-bottom: 16px !important;
    }

    .ai-widget-settings-button.back:hover {
      background: #1d4ed8 !important;
    }

    .ai-widget-settings-footer {
      text-align: center !important;
      padding-top: 16px !important;
      border-top: 1px solid #e5e7eb !important;
    }

    .ai-widget-settings-footer a {
      color: #2563eb !important;
      text-decoration: none !important;
      font-size: 14px !important;
      opacity: 0.8 !important;
      transition: opacity 0.2s !important;
    }

    .ai-widget-settings-footer a:hover {
      opacity: 1 !important;
      text-decoration: underline !important;
    }

    .ai-widget-messages {
      padding: 16px !important;
      height: calc(100% - 140px) !important;
      overflow-y: auto !important;
      display: flex !important;
      flex-direction: column !important;
      gap: 16px !important;
      background: #f8fafc !important;
    }

    .ai-widget-message {
      display: flex !important;
      align-items: flex-start !important;
      gap: 8px !important;
      max-width: 85% !important;
    }

    .ai-widget-message.user {
      margin-left: auto !important;
      flex-direction: row-reverse !important;
    }

    .ai-widget-bubble {
      background: white !important;
      padding: 12px 16px !important;
      border-radius: 16px !important;
      border-top-left-radius: 4px !important;
      color: #1f2937 !important;
      line-height: 1.5 !important;
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05) !important;
    }

    .ai-widget-message.user .ai-widget-bubble {
      background: #2563eb !important;
      color: white !important;
      border-radius: 16px !important;
      border-top-right-radius: 4px !important;
    }

    .ai-widget-timestamp {
      text-align: center !important;
      color: #6b7280 !important;
      font-size: 12px !important;
      margin: 8px 0 !important;
    }

    .ai-widget-input {
      padding: 16px !important;
      background: white !important;
      border-top: 1px solid #e5e7eb !important;
      position: absolute !important;
      bottom: 0 !important;
      left: 0 !important;
      right: 0 !important;
      z-index: 1 !important;
    }

    .ai-widget-form {
      display: flex !important;
      gap: 8px !important;
      background: white !important;
    }

    .ai-widget-textarea {
      flex: 1 !important;
      padding: 12px !important;
      border: 1px solid #e5e7eb !important;
      border-radius: 12px !important;
      resize: none !important;
      height: 44px !important;
      line-height: 20px !important;
      outline: none !important;
      transition: border-color 0.2s !important;
      background: white !important;
      color: #1f2937 !important;
      font-size: 14px !important;
      font-family: inherit !important;
      max-height: 120px !important;
      overflow-y: auto !important;
    }

    .ai-widget-textarea:focus {
      border-color: #2563eb !important;
    }

    .ai-widget-send {
      background: #2563eb !important;
      color: white !important;
      border: none !important;
      border-radius: 12px !important;
      width: 44px !important;
      height: 44px !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      cursor: pointer !important;
      transition: background-color 0.2s !important;
      flex-shrink: 0 !important;
      position: relative !important;
      z-index: 2 !important;
    }

    .ai-widget-send:hover {
      background: #1d4ed8 !important;
    }

    .ai-widget-send:disabled {
      background: #93c5fd !important;
      cursor: not-allowed !important;
    }

    .ai-widget-typing {
      display: flex !important;
      gap: 4px !important;
      padding: 16px !important;
      align-items: center !important;
    }

    .ai-widget-typing-dot {
      width: 8px !important;
      height: 8px !important;
      background: #94a3b8 !important;
      border-radius: 50% !important;
      animation: typing 1.4s infinite !important;
    }

    .ai-widget-typing-dot:nth-child(2) { animation-delay: 0.2s !important; }
    .ai-widget-typing-dot:nth-child(3) { animation-delay: 0.4s !important; }

    @keyframes typing {
      0%, 60%, 100% { transform: translateY(0) !important; }
      30% { transform: translateY(-4px) !important; }
    }

    .ai-widget-toggle {
      position: fixed !important;
      bottom: 20px !important;
      right: 20px !important;
      z-index: 999998 !important;
      width: 56px !important;
      height: 56px !important;
      border-radius: 28px !important;
      background-color: #2563eb !important;
      color: white !important;
      border: none !important;
      cursor: pointer !important;
      box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3) !important;
      transition: all 0.2s ease !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      outline: none !important;
      padding: 0 !important;
    }

    .ai-widget-toggle:hover {
      transform: scale(1.1) !important;
      box-shadow: 0 6px 16px rgba(37, 99, 235, 0.4) !important;
    }

    .ai-widget-toggle.open {
      transform: scale(0.77) !important;
    }

    .ai-widget-toggle img {
      width: 58.4% !important;
      height: 58.4% !important;
      object-fit: contain !important;
    }

    .ai-widget-toggle.open img {
      width: 77% !important;
      height: 77% !important;
    }

    .ai-widget-settings-confirm {
      position: absolute !important;
      top: 0 !important;
      left: 0 !important;
      right: 0 !important;
      bottom: 0 !important;
      background: white !important;
      padding: 24px !important;
      display: none !important;
      flex-direction: column !important;
      align-items: center !important;
      justify-content: center !important;
      text-align: center !important;
    }

    .ai-widget-confirm-message {
      font-size: 16px !important;
      color: #1f2937 !important;
      margin-bottom: 24px !important;
    }

    .ai-widget-confirm-buttons {
      display: flex !important;
      gap: 16px !important;
      width: 100% !important;
    }

    .ai-widget-confirm-buttons button {
      flex: 1 !important;
    }

    .confirm-yes {
      background: #ef4444 !important;
      color: white !important;
    }

    .confirm-yes:hover {
      background: #dc2626 !important;
    }

    .confirm-no {
      margin-top: 0 !important;
    }
  `;
  document.head.appendChild(styles);

  // Create container
  const container = document.createElement('div');
  container.className = 'ai-widget-container';
  
  // Create chat interface
  container.innerHTML = `
    <div class="ai-widget-header">
      <div class="ai-widget-title">
        <div class="ai-widget-avatar">
          <img src="${baseUrl}/svarbot-logo.png" alt="KBHbot" style="width: 100% !important; height: 100% !important;" />
        </div>
        <span>KBHbot</span>
      </div>
      <div class="ai-widget-controls">
        <button class="ai-widget-button ai-widget-settings">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M12 15a3 3 0 100-6 3 3 0 000 6z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
        <button class="ai-widget-button ai-widget-minimize">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M20 12H4" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
        <button class="ai-widget-button ai-widget-close">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M18 6L6 18M6 6l12 12" stroke-width="2" stroke-linecap="round" />
          </svg>
        </button>
      </div>
    </div>
    <div class="ai-widget-settings-panel">
      <div class="ai-widget-settings-content">
        <button class="ai-widget-settings-button" data-action="restart">Start forfra</button>
        <button class="ai-widget-settings-button" data-action="save">Gem chatlog</button>
        <button class="ai-widget-settings-button" data-action="clear">Slet chatlog</button>
        <button class="ai-widget-settings-button back" data-action="back">Gå tilbage til chatten</button>
        <div class="ai-widget-settings-footer">
          <a href="https://svarbot.dk" target="_blank" rel="noopener noreferrer">Drevet af svarbot.dk</a>
        </div>
      </div>
      <div class="ai-widget-settings-confirm" style="display: none;">
        <p class="ai-widget-confirm-message"></p>
        <div class="ai-widget-confirm-buttons">
          <button class="ai-widget-settings-button confirm-yes">Ja</button>
          <button class="ai-widget-settings-button back confirm-no">Nej</button>
        </div>
      </div>
    </div>
    <div class="ai-widget-messages"></div>
    <div class="ai-widget-input">
      <form class="ai-widget-form">
        <textarea
          class="ai-widget-textarea"
          placeholder="Stil mig et spørgsmål..."
          rows="1"
        ></textarea>
        <button type="submit" class="ai-widget-send" disabled>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </form>
    </div>
  `;

  document.body.appendChild(container);

  // Create toggle button
  const button = document.createElement('button');
  button.className = 'ai-widget-toggle';
  button.innerHTML = `
    <div style="display: flex !important; align-items: center !important; justify-content: center !important; width: 100% !important; height: 100% !important;">
      <img src="${baseUrl}/chatbutton.png" alt="Chat" style="width: 58.4% !important; height: 58.4% !important; object-fit: contain !important;" />
    </div>
  `;

  // Chat functionality
  const messagesContainer = container.querySelector('.ai-widget-messages');
  const form = container.querySelector('.ai-widget-form');
  const textarea = container.querySelector('.ai-widget-textarea');
  const sendButton = container.querySelector('.ai-widget-send');
  const closeButton = container.querySelector('.ai-widget-close');
  const minimizeButton = container.querySelector('.ai-widget-minimize');
  const settingsButton = container.querySelector('.ai-widget-settings');
  const settingsPanel = container.querySelector('.ai-widget-settings-panel');
  const settingsButtons = container.querySelectorAll('.ai-widget-settings-button');

  let isMinimized = false;
  let isSettingsOpen = false;
  let chatHistoryBackup = null;

  // Format timestamp
  function formatMessageTime(timestamp, prevTimestamp) {
    if (!prevTimestamp || Math.abs(new Date(timestamp).getTime() - new Date(prevTimestamp).getTime()) >= 60000) {
      return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    return null;
  }

  // Load chat history
  const chatHistory = loadChatHistory();
  chatHistory.forEach((message, index) => {
    const prevMessage = index > 0 ? chatHistory[index - 1] : null;
    addMessage(message.text, message.isUser, message.timestamp, prevMessage?.timestamp);
  });

  function addMessage(text, isUser = false, timestamp = new Date().toISOString(), prevTimestamp = null) {
    const timeString = formatMessageTime(timestamp, prevTimestamp);

    if (timeString) {
      const timeDiv = document.createElement('div');
      timeDiv.className = 'ai-widget-timestamp';
      timeDiv.textContent = timeString;
      messagesContainer.appendChild(timeDiv);
    }

    const message = document.createElement('div');
    message.className = `ai-widget-message ${isUser ? 'user' : ''}`;
    message.innerHTML = `
      <div class="ai-widget-bubble">${text}</div>
    `;
    messagesContainer.appendChild(message);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;

    // Save to chat history
    chatHistory.push({ text, isUser, timestamp });
    saveChatHistory(chatHistory);
  }

  function showTyping() {
    const typing = document.createElement('div');
    typing.className = 'ai-widget-typing';
    typing.innerHTML = `
      <div class="ai-widget-bubble">
        <div style="display: flex !important; gap: 4px !important;">
          <div class="ai-widget-typing-dot"></div>
          <div class="ai-widget-typing-dot"></div>
          <div class="ai-widget-typing-dot"></div>
        </div>
      </div>
    `;
    messagesContainer.appendChild(typing);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    return typing;
  }

  // Settings functionality
  const settingsContent = container.querySelector('.ai-widget-settings-content');
  const confirmPanel = container.querySelector('.ai-widget-settings-confirm');
  const confirmMessage = container.querySelector('.ai-widget-confirm-message');
  const confirmYes = container.querySelector('.confirm-yes');
  const confirmNo = container.querySelector('.confirm-no');

  function showConfirmation(message, onConfirm) {
    confirmMessage.textContent = message;
    settingsContent.style.display = 'none';
    confirmPanel.style.display = 'flex';

    const handleYes = () => {
      onConfirm();
      hideConfirmation();
    };

    const handleNo = () => {
      hideConfirmation();
    };

    const cleanup = () => {
      confirmYes.removeEventListener('click', handleYes);
      confirmNo.removeEventListener('click', handleNo);
    };

    confirmYes.addEventListener('click', handleYes);
    confirmNo.addEventListener('click', handleNo);
  }

  function hideConfirmation() {
    confirmPanel.style.display = 'none';
    settingsContent.style.display = 'block';
  }

  settingsButtons.forEach(button => {
    button.addEventListener('click', () => {
      const action = button.dataset.action;
      
      if (action === 'back') {
        settingsPanel.classList.remove('visible');
        isSettingsOpen = false;
        return;
      }

      switch (action) {
        case 'restart':
          showConfirmation('Er du sikker på, at du vil starte forfra?', () => {
            chatHistory.length = 0;
            saveChatHistory(chatHistory);
            messagesContainer.innerHTML = '';
            addMessage("👋 Hej! Hvordan kan jeg hjælpe dig i dag?");
            settingsPanel.classList.remove('visible');
            isSettingsOpen = false;
          });
          break;
        case 'save':
          const blob = new Blob([JSON.stringify(chatHistory, null, 2)], { type: 'application/json' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'chat-history.json';
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
          break;
        case 'clear':
          showConfirmation('Er du sikker på, at du vil slette hele chatloggen?', () => {
            chatHistory.length = 0;
            saveChatHistory(chatHistory);
            messagesContainer.innerHTML = '';
            settingsPanel.classList.remove('visible');
            isSettingsOpen = false;
          });
          break;
      }
    });
  });

  // Add keydown event listener for Enter key
  textarea.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (textarea.value.trim()) {
        form.dispatchEvent(new Event('submit'));
      }
    }
  });

  // Toggle widget visibility
  function toggleWidget() {
    if (isMinimized) {
      isMinimized = false;
      container.classList.add('visible');
    } else if (container.classList.contains('visible')) {
      container.classList.remove('visible');
    } else {
      container.classList.add('visible');
    }
    updateToggleButton();
  }

  function updateToggleButton() {
    if (container.classList.contains('visible')) {
      button.classList.add('open');
      button.innerHTML = `
        <div style="display: flex !important; align-items: center !important; justify-content: center !important; width: 100% !important; height: 100% !important;">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white">
            <path d="M18 6L6 18M6 6l12 12" stroke-width="2" stroke-linecap="round" />
          </svg>
        </div>
      `;
    } else {
      button.classList.remove('open');
      button.innerHTML = `
        <div style="display: flex !important; align-items: center !important; justify-content: center !important; width: 100% !important; height: 100% !important;">
          <img src="${baseUrl}/chatbutton.png" alt="Chat" style="width: 58.4% !important; height: 58.4% !important; object-fit: contain !important;" />
        </div>
      `;
    }
  }

  button.addEventListener('click', toggleWidget);
  closeButton.addEventListener('click', () => {
    container.classList.remove('visible');
    updateToggleButton();
  });

  minimizeButton.addEventListener('click', () => {
    isMinimized = true;
    container.classList.remove('visible');
    updateToggleButton();
  });

  settingsButton.addEventListener('click', () => {
    isSettingsOpen = !isSettingsOpen;
    settingsPanel.classList.toggle('visible');
  });

  // Add button to page
  document.body.appendChild(button);

  // Add welcome message
  setTimeout(() => {
    if (chatHistory.length === 0) {
      addMessage("👋 Hej! Hvordan kan jeg hjælpe dig i dag?");
    }
  }, 500);
})();