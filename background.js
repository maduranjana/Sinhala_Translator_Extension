chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "FETCH_TRANSLATION") {
    fetch(`https://www.maduraonline.com/?find=${encodeURIComponent(message.word)}`)
      .then(response => response.text())
      .then(html => {
        sendResponse({ success: true, html });
      })
      .catch(error => {
        sendResponse({ success: false, error: error.toString() });
      });

    return true; // ✅ REQUIRED to keep sendResponse alive
  }
});
