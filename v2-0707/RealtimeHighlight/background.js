const showAlert = () => {
  console.log("Hilight on");
  chrome.tabs.sendMessage(tab.id, "SET_SW");
};
chrome.action.onClicked.addListener((tab) => {
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: showAlert,
  });
});
