/*On Message */
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request == "SET_SW") {
    const storageKey = "__searchwords";
    const IdmodeStorageKey = "__idmodeflag";
    console.log("on Message!");
    //IDモードを取得
    chrome.storage.local.get(IdmodeStorageKey, function (value) {
      var idmode = value[IdmodeStorageKey];
      //console.log(idmode);
      /*HighLight*/
      chrome.storage.local.get([storageKey], (items) => {
        var searchwords = items[storageKey].split("\n");
        //console.log(searchwords);
        if (searchwords) {
          searchwords = Array.from(new Set(searchwords));
          /*HighLight*/
          $("body").removeHighlight();
          searchwords.forEach((searchword) => {
            $("body").highlight(searchword);
            /*id検索 ONのとき*/
            if (idmode == "1") {
              var w = "#".concat(searchword);
              $(w).wrap('<i class="Already-read">');
              //親要素のtrもwrap
              $(w).closest("tr").wrap('<i class="Already-read">');
            }
          });
        } else {
          return;
        }
      });
    });
  } else if (request == "SET_MODE_OFF") {
    console.log("off Message!");
    $("body").removeHighlight();
  }
});

/*==============
==On load
===============*/
window.addEventListener("load", () => {
  const storageKey = "__searchwords";
  const IdmodeStorageKey = "__idmodeflag";
  //console.log("on Message!");
  //IDモードを取得
  chrome.storage.local.get(IdmodeStorageKey, function (value) {
    var idmode = value[IdmodeStorageKey];
    //console.log(idmode);
    /*HighLight*/
    chrome.storage.local.get([storageKey], (items) => {
      var searchwords = items[storageKey].split("\n");
      //console.log(searchwords);
      if (searchwords) {
        searchwords = Array.from(new Set(searchwords));
        /*HighLight*/
        $("body").removeHighlight();
        searchwords.forEach((searchword) => {
          $("body").highlight(searchword);
          /*id検索 ONのとき*/
          if (idmode == "1") {
            var w = "#".concat(searchword);
            $(w).wrap('<i class="Already-read">');
          }
        });
      } else {
        return;
      }
    });
  });
});
