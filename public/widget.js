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

    .ai-widget-close {
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
      margin-left: auto !important;
    }

    .ai-widget-close:hover {
      background: rgba(255, 255, 255, 0.1) !important;
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

    .ai-widget-avatar {
      width: 32px !important;
      height: 32px !important;
      border-radius: 50% !important;
      background: #2563eb !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      color: white !important;
      flex-shrink: 0 !important;
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
          <img src="${baseUrl}/svarbot-logo.png" alt="AI Support" style="width: 80% !important; height: 80% !important;" />
        </div>
        <span>AI Support</span>
      </div>
      <button class="ai-widget-close">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M18 6L6 18M6 6l12 12" stroke-width="2" stroke-linecap="round" />
        </svg>
      </button>
    </div>
    <div class="ai-widget-messages"></div>
    <div class="ai-widget-input">
      <form class="ai-widget-form">
        <textarea
          class="ai-widget-textarea"
          placeholder="Type your message..."
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
      <img src="${baseUrl}/chatbutton.png" alt="Chat" style="width: 80% !important; height: 80% !important; object-fit: contain !important;" />
    </div>
  `;

  // Chat functionality
  const messagesContainer = container.querySelector('.ai-widget-messages');
  const form = container.querySelector('.ai-widget-form');
  const textarea = container.querySelector('.ai-widget-textarea');
  const sendButton = container.querySelector('.ai-widget-send');
  const closeButton = container.querySelector('.ai-widget-close');

  // Load chat history
  const chatHistory = loadChatHistory();
  chatHistory.forEach(message => addMessage(message.text, message.isUser));

  function addMessage(text, isUser = false) {
    const message = document.createElement('div');
    message.className = `ai-widget-message ${isUser ? 'user' : ''}`;
    message.innerHTML = `
      <div class="ai-widget-avatar">
        ${isUser ? 
          `<img src="${baseUrl}/chatbutton.png" alt="User" style="width: 80% !important; height: 80% !important;" />` :
          `<img src="${baseUrl}/svarbot-logo.png" alt="AI" style="width: 80% !important; height: 80% !important;" />`
        }
      </div>
      <div class="ai-widget-bubble">${text}</div>
    `;
    messagesContainer.appendChild(message);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;

    // Save to chat history
    chatHistory.push({ text, isUser, timestamp: new Date().toISOString() });
    saveChatHistory(chatHistory);
  }

  function showTyping() {
    const typing = document.createElement('div');
    typing.className = 'ai-widget-typing';
    typing.innerHTML = `
      <div class="ai-widget-avatar">
        <img src="${baseUrl}/svarbot-logo.png" alt="AI" style="width: 80% !important; height: 80% !important;" />
      </div>
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

  // Event listeners
  textarea.addEventListener('input', () => {
    sendButton.disabled = !textarea.value.trim();
    textarea.style.height = 'auto';
    textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const message = textarea.value.trim();
    if (!message) return;

    addMessage(message, true);
    textarea.value = '';
    textarea.style.height = '44px';
    sendButton.disabled = true;

    const typing = showTyping();

    try {
      const response = await fetch('https://incomparable-froyo-d0582a.netlify.app/.netlify/functions/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          message,
          context: chatHistory.slice(-3) // Send last 3 messages for context
        })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to get response');
      }

      typing.remove();
      addMessage(data.response);
    } catch (error) {
      typing.remove();
      addMessage("I'm sorry, I'm having trouble connecting right now. Please try again later.");
      console.error('Chat error:', error);
    }
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
    if (container.classList.contains('visible')) {
      container.classList.remove('visible');
      button.innerHTML = `
        <div style="display: flex !important; align-items: center !important; justify-content: center !important; width: 100% !important; height: 100% !important;">
          <img src="${baseUrl}/chatbutton.png" alt="Chat" style="width: 80% !important; height: 80% !important; object-fit: contain !important;" />
        </div>
      `;
    } else {
      container.classList.add('visible');
      button.innerHTML = `
        <div style="display: flex !important; align-items: center !important; justify-content: center !important; width: 100% !important; height: 100% !important;">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white">
            <path d="M18 6L6 18M6 6l12 12" stroke-width="2" stroke-linecap="round" />
          </svg>
        </div>
      `;
    }
  }

  button.addEventListener('click', toggleWidget);
  closeButton.addEventListener('click', toggleWidget);

  // Add button to page
  document.body.appendChild(button);

  // Add welcome message
  setTimeout(() => {
    if (chatHistory.length === 0) {
      addMessage("👋 Hi there! How can I help you today?");
    }
  }, 500);
})();
