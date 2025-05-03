document.addEventListener('DOMContentLoaded', () => {
    const messageInput = document.querySelector('#message-box input');
    const sendButton = document.querySelector('.send-btn');

    async function handleSendMessage() {
        const message = messageInput.value.trim();
        if (!message) return;

        // Add user message to UI
        addMessage(message, true);
        messageInput.value = '';

        // Send message to background script
        console.log("Sending message to background script:", message);
        await chrome.runtime.sendMessage({
            action: 'sendMessage',
            message: message
        });
    }

    // Listen for messages from background script
    chrome.runtime.onMessage.addListener((request) => {
        if (request.action === 'updateMessages') {
            // Add AI response to UI
            addMessage(request.aiResponse);
        }
    });

     // More reliable cleanup on panel close
     async function clearStorage() {
        try {
            await chrome.storage.local.clear();
            console.log('Storage cleared successfully');
        } catch (error) {
            console.error('Error clearing storage:', error);
        }
    }

    // Event listeners
    sendButton.addEventListener('click', handleSendMessage);
    messageInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleSendMessage();
    });

    // Listen for panel visibility changes
    document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'hidden') {
            clearStorage();
        }
    });

    // Handle window unload
    window.addEventListener('beforeunload', () => {
        clearStorage();
    });

    // Handle extension specific events
    chrome.runtime.onSuspend.addListener(clearStorage);
});

function addMessage(text, isUser = false) {
    const messagesContainer = document.querySelector('#sidebar-messages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message-container ${isUser ? 'user-message' : 'ai-message'}`;
    messageDiv.innerHTML = `
    <div class="message-container-body-${isUser ? 'user' : 'ai'}">
      <p>${text}</p>
    </div>
  `;
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}