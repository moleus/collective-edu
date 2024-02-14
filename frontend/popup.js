// Display intercepted data in popup
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  document.getElementById('content').textContent = message.data;
});

