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
  } else if (request == "Addex1-Record") {
    //-----------------------------------
    //現在の表示を記録
    //console.log("addex1-", $("td.table_tableData-scout").length);
    let _resulttxt = "";
    $("td.table_tableData-scout").each(function(index, element){
      //社名,学歴で記録
      let companyname = $(element).find('h3').text();
      let acadeic_bg = $(element).find('div:nth-child(1) p.truncate:nth-child(1)').text();
      _resulttxt += companyname.trim()+"@@@"+acadeic_bg.trim()+"\n";
    });;
    //社名+会社名
    sendResponse(_resulttxt);
  } else if(request == "Addex1-Highlight"){
    //------------------------
    //追加機能ハイライト
    let _addstorageKey = "__addex1Highlight";
    /*HighLight*/
    console.log("addex highlight");
    $("body").removeHighlight();//リセット
    chrome.storage.local.get([_addstorageKey], (items) => {
      var searchwords = items[_addstorageKey].split("\n");
      //console.log(searchwords);
      if (searchwords) {
        searchwords = Array.from(new Set(searchwords));
        console.log(`件数=${searchwords.length}`);
        //HighLight
        searchwords.forEach((searchword) => {
          searchword = searchword.trim()
          if(searchword.indexOf('@@@')==-1){
            console.log("学歴が見つかりません");
          }else{
            let _targetAry = searchword.split('@@@');//0=社名, 1=学歴
            console.log(_targetAry);
            //チェックして該当したらハイライト
            let _h3el = $(`.table_tableData-scout h3:contains('${_targetAry[0]}')`);
            if(_h3el.length>0){
              //要素が存在する場合-for
              _h3el.each(function(index, element){
                let _ac = $(element).closest("td").find("div:nth-child(2) > div:nth-child(1) p.truncate:nth-child(1)").text().trim();
                console.log(_ac);
                if($(element).text().trim()==_targetAry[0] && _targetAry[1]==_ac){
                //社名&学歴の一致でハイライト
                $(element).closest("tr").find('td > div').wrap('<i class="Already-read">');
                //console.log(`ok 社名=${_targetAry[0]}\n学歴=${_ac}`);
              }else{
                //console.log(`社名と学歴が一致しません  検索=${searchword} 社名=${_h3el.text().trim()} 学歴=${_ac.trim()}`);
              }
              });
            }else{
              console.log(`要素が見つかりません\n社名=${_targetAry[0]}\n学歴=${_targetAry[1]}`);
            }
          }
        });
      } else {
        return;
      }
    });
  }else if(request == "Addex1-Highlight-ADD"){
    //ハイライト前に削除なし
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
/*================================
===================================
追加機能１
===================================
==================================*/
//Window読み込み時
window.addEventListener("load", () => {
  const storageKey = "__searchwords";
  /*HighLight*/
  chrome.storage.local.get([storageKey], (items) => {
    var searchwords = items[storageKey].split("\n");
    //console.log(searchwords);
    if (searchwords) {
      searchwords = Array.from(new Set(searchwords));
      /*HighLight*/
      $("body").removeHighlight();
      searchwords.forEach((searchword) => {
        searchword = searchword.trim()
        let _targetAry = searchword.split('@@@');//0=社名, 1=学歴
        //チェックして該当したらハイライト
        if($(`.table_tableData-scout h3:contains('${_targetAry[0]}')`)[0]){
          //要素が存在する場合
          let _ac = $(`.table_tableData-scout h3:contains('${_targetAry[0]}')`).parent("td").find("div:nth-child(2) > div:nth-child(1) p.truncate:nth-child(1)");
          if(_targetAry[1]==_ac){
            //社名&学歴の一致でハイライト
            $(`.table_tableData-scout h3:contains('${_targetAry[0]}')`).parent("td").filter('td>div').wrap('<i class="Already-read">');
          }
        }
      });
    } else {
      return;
    }
  });
});
//