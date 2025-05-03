const CONTEXT_LIMIT = 10;

// for opening th side panel on clicking the toolbar icon
chrome.sidePanel
  .setPanelBehavior({ openPanelOnActionClick: true })
  .catch((error) => console.error(error));


//send message to the model
import GeminiGenerator from "./Agents/Generator.js";
const generator = new GeminiGenerator();

async function generateResponse(prompt) {

  const history = await getConversationHistory();
  const context = history.map(msg =>
    `${msg.isUser ? 'User' : 'Assistant'}: ${msg.content}`
  ).join('\n');

  // Add current prompt to history
  await addToHistory(prompt, true);
  const response = await generator.generateResponse(
    `Previous conversation:\n${context}\n\nUser: ${prompt}\nAssistant:`
  );

  if (response.success) {
    await addToHistory(response.content, false);
    return response.content;
  } else {
    console.error(response.error);
    return "Error generating response.";
  }
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'sendMessage') {

    (async () => {
      try {
        console.log("Received message:", request.message);
        const aiResponse = await generateResponse(request.message);
        console.log("Generated AI response:", aiResponse);

        const history = await getConversationHistory();
        chrome.runtime.sendMessage({
          action: 'updateMessages',
          userMessage: request.message,
          aiResponse: aiResponse,
          history: history
        });
      } catch (error) {
        console.error("Error processing message:", error);
      }
    })();
    return true;

  }
});


async function getConversationHistory() {
  const { history = [] } = await chrome.storage.local.get('history');
  return history;
}

// Add a message to the conversation history
async function addToHistory(message, isUser = true) {
  const history = await getConversationHistory();
  history.push({
    content: message,
    timestamp: new Date().toISOString(),
    isUser
  });

  // Keep only the last CONTEXT_LIMIT messages
  if (history.length > CONTEXT_LIMIT) {
    history.splice(0, history.length - CONTEXT_LIMIT);
  }

  await chrome.storage.local.set({ history });
}

// Clear storage when the extension is suspended
chrome.runtime.onSuspend.addListener(async () => {
  try {
      await chrome.storage.local.clear();
      console.log('Storage cleared on extension suspend');
  } catch (error) {
      console.error('Error clearing storage on suspend:', error);
  }
});

// Listen for side panel closing
chrome.runtime.onConnect.addListener((port) => {
  if (port.name === 'sidebar') {
      port.onDisconnect.addListener(async () => {
          try {
              await chrome.storage.local.clear();
              console.log('Storage cleared on sidebar disconnect');
          } catch (error) {
              console.error('Error clearing storage:', error);
          }
      });
  }
});