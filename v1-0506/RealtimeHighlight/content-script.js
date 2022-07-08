/*On Message */
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request == "SET_SW") {
    const storageKey = "__searchwords";
    //console.log("on Message!");
    /*HighLight*/
    chrome.storage.local.get([storageKey], (items) => {
      var searchwords = items[storageKey].split("\n");
      //console.log(searchwords);
      if (searchwords) {
        searchwords = Array.from(new Set(searchwords));
        /*HighLight*/
        $("body").removeHighlight();
        $.each(searchwords, function (i) {
          $("body").highlight(searchwords[i]);
        });
      } else {
        return;
      }
    });
  }else if(request == "SET_MODE_OFF"){
    console.log("off Message!");
    $("body").removeHighlight();
  }
});
window.addEventListener("load", () => {
  const storageKey = "__searchwords";
  //console.log("on Message!");
  /*HighLight*/
  chrome.storage.local.get([storageKey], (items) => {
    var searchwords = items[storageKey].split("\n");
    //console.log(searchwords);
    if (searchwords) {
      searchwords = Array.from(new Set(searchwords));
      /*HighLight*/
      $("body").removeHighlight();
      $.each(searchwords, function (i) {
        $("body").highlight(searchwords[i]);
      });
    } else {
      return;
    }
  });
});
