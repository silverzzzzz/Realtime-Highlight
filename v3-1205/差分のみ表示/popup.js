/*===================
**タブの切り替え
=====================*/
$(function () {
  $(".tab-btn").on("click", function () {
    $(".tab-btn").removeClass("active");
    $(this).addClass("active");
    var index = $(".tab-btn").index(this);
    //console.log(index);
    if (index == 0) {
      $("#tab1").removeClass("hidden");
      $("#tab2").addClass("hidden");
    } else if (index == 1) {
      $("#tab2").removeClass("hidden");
      $("#tab1").addClass("hidden");
    }
  });
});
//--------------------
//ダウンロード
$(function () {
  $("#addex1-download").on("click", function () {
    chrome.storage.local.get(["__addex1Highlight"], function (value) {
      var swords = value["__addex1Highlight"];
      var now = new Date();
      let month = now.getMonth() + 1;
      let date = now.getDate();
      let hour = now.getHours();
      let min = now.getMinutes();
      let sec = now.getSeconds();
      const blob = new Blob([swords], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      document.body.appendChild(a);
      a.download =
        "Highlight-data-" +
        month +
        date +
        "-" +
        hour +
        "-" +
        min +
        "-" +
        sec +
        ".txt";
      a.href = url;
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    });
  });
});
//--------------------------
//削除
$(function () {
  $("#addex1-remove").on("click", function () {
    let checkSaveFlg = window.confirm(
      "記録されているデータを削除してもよろしいですか？"
    );
    if (checkSaveFlg) {
      console.log("削除しました");
      //textareaを削除
      $("#addex1-highlight").val("");
      //storageからも削除
      chrome.storage.local.set({ [Addex1StorageKey]: "" }, async () => {
        const queryOptions = { active: true, currentWindow: true };
        const [tab] = await chrome.tabs.query(queryOptions);
        chrome.tabs.sendMessage(tab.id, "SET_MODE_OFF");
      });
    }
  });
});
/*===================
**Main
====================*/
//-----------------------------------------
//標準ハイライト
const HightlightstorageKey = "__searchwords";
const IdmodeStorageKey = "__idmodeflag";
$(function () {
  const searchbox = $("#highlight-words");
  const searchbt = $("#submit-bt");
  searchbox.on("input", function () {
    var idmodebt = $("#idsearch").prop("checked") ? "1" : "0";
    //console.log("prop=");
    //console.log(idmodebt);
    if ($('[name="onoff"]').prop("checked")) {
      var sw = searchbox.val();
      chrome.storage.local.set(
        { [HightlightstorageKey]: sw, [IdmodeStorageKey]: idmodebt },
        async () => {
          const queryOptions = { active: true, currentWindow: true };
          const [tab] = await chrome.tabs.query(queryOptions);
          chrome.tabs.sendMessage(tab.id, "SET_SW");
        }
      );
    }
  });
  searchbt.click(function () {
    var idmodebt = $("#idsearch").prop("checked") ? "1" : "0";
    if ($('[name="onoff"]').prop("checked")) {
      var sw = searchbox.val();
      //console.log("prop=");
      //console.log(idmodebt);
      chrome.storage.local.set(
        { [HightlightstorageKey]: sw, [IdmodeStorageKey]: idmodebt },
        async () => {
          const queryOptions = { active: true, currentWindow: true };
          const [tab] = await chrome.tabs.query(queryOptions);
          chrome.tabs.sendMessage(tab.id, "SET_SW");
        }
      );
    }
  });
  //-------
  //Enable Disable button
  $('[name="onoff"]').change(function () {
    var idmodebt = $("#idsearch").prop("checked") ? "1" : "0";
    //console.log("prop=");
    //console.log(idmodebt);
    if ($(this).prop("checked")) {
      var sw = searchbox.val();
      chrome.storage.local.set(
        { [HightlightstorageKey]: sw, [IdmodeStorageKey]: idmodebt },
        async () => {
          const queryOptions = { active: true, currentWindow: true };
          const [tab] = await chrome.tabs.query(queryOptions);
          chrome.tabs.sendMessage(tab.id, "SET_SW");
        }
      );
    } else {
      //console.log("change!");
      chrome.storage.local.set(
        { [HightlightstorageKey]: sw, [IdmodeStorageKey]: idmodebt },
        async () => {
          const queryOptions = { active: true, currentWindow: true };
          const [tab] = await chrome.tabs.query(queryOptions);
          chrome.tabs.sendMessage(tab.id, "SET_MODE_OFF");
        }
      );
    }
  });
});
//load
$(window).on("load", function () {
  //--------------------------
  //ロード時の読み込み
  //Highlight
  chrome.storage.local.get([HightlightstorageKey], function (value) {
    var swords = value[HightlightstorageKey];
    if (swords) {
      $("#highlight-words").val("");
      $("#highlight-words").val(swords);
    }
  });
  //--------------------------
  //追加機能1を読み込む
  chrome.storage.local.get(["__addex1Highlight"], function (value) {
    var swords = value["__addex1Highlight"];
    if (swords) {
      //$("#addex1-highlight").val("");
      //$("#addex1-highlight").val(swords);
      //ハイライト
      chrome.storage.local.set({ [Addex1StorageKey]: swords }, async () => {
        const queryOptions = { active: true, currentWindow: true };
        const [tab] = await chrome.tabs.query(queryOptions);
        chrome.tabs.sendMessage(tab.id, "Addex1-Highlight");
      });
    }
  });
});
//============================================
//追加機能1
//============================================
const Addex1StorageKey = "__addex1Highlight";
//--------------------------
//現在の表示を記録
//コールバック
function addex_recordcallback(text) {
  console.log("取得した値=", text);
  //現在の表示にtextを追加
  let textarea = $("#addex1-highlight");
  //重複分は設定しない
  chrome.storage.local.get(["__addex1Highlight"], function (value) {
    var swords = value["__addex1Highlight"];
    let _result = "";
    text = text.split("\n");
    text.forEach((_p) => {
      //_pがあるか確認
      if (swords.indexOf(_p) == -1) {
        //含まないときは追加
        _result = _result + _p + "\n";
      }
    });
    //---------
    //現在の値をハイライト&記録
    //console.log("result=",_result);
    chrome.storage.local.set(
      { [Addex1StorageKey]: _result + swords },
      async () => {
        const queryOptions = { active: true, currentWindow: true };
        const [tab] = await chrome.tabs.query(queryOptions);
        if ($('[name="addex1-onoff"]').prop("checked")) {
          chrome.tabs.sendMessage(tab.id, "Addex1-Highlight");
        }
      }
    );
    //resultがからでないときは追加
    if (_result) {
      textarea.val(_result);
    }
  });
}
//現在のTabidを取得
async function getCurrentTab() {
  let queryOptions = { active: true, currentWindow: true };
  let [tab] = await chrome.tabs.query(queryOptions);
  return tab;
}
//本体
$("#addex1-record").click(function () {
  //記録
  //console.log("recordclick");
  //記録本体
  //console.log("本体=");
  //const queryOptions = { active: true, currentWindow: true };
  //const [tab] = chrome.tabs.query(queryOptions);
  getCurrentTab().then((tab) => {
    chrome.tabs.sendMessage(tab.id, "Addex1-Record", addex_recordcallback);
  });
});
//-----------------------
//テキストエリアに入力でハイライト
$(function () {
  $("#addex1-highlight").on("input", function () {
    //console.log("input addex1");
    if ($('[name="addex1-onoff"]').prop("checked")) {
      //console.log("addex1");
      var sw = $("#addex1-highlight").val();
      chrome.storage.local.set({ [Addex1StorageKey]: sw }, async () => {
        const queryOptions = { active: true, currentWindow: true };
        const [tab] = await chrome.tabs.query(queryOptions);
        chrome.tabs.sendMessage(tab.id, "Addex1-Highlight");
      });
    }
  });
});
//---------------------------
//追加機能ON-OFFを押した時の挙動
$('[name="addex1-onoff"]').change(function () {
  if ($(this).prop("checked")) {
    //ONになった時
    var sw = $("#addex1-highlight").val();
    chrome.storage.local.set({ [Addex1StorageKey]: sw }, async () => {
      const queryOptions = { active: true, currentWindow: true };
      const [tab] = await chrome.tabs.query(queryOptions);
      chrome.tabs.sendMessage(tab.id, "Addex1-Highlight");
    });
  } else {
    //OFFになった時
    chrome.storage.local.set({ [Addex1StorageKey]: sw }, async () => {
      const queryOptions = { active: true, currentWindow: true };
      const [tab] = await chrome.tabs.query(queryOptions);
      chrome.tabs.sendMessage(tab.id, "SET_MODE_OFF");
    });
  }
});
