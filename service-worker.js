// Open on action click (Recommended)
chrome.runtime.onInstalled.addListener(() => {
    chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true });
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === "SONG_INFO") {
      console.log("Currently Playing Song:", message.songName);
    }
  });
  