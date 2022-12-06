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
    console.log("prop=");
    console.log(idmodebt);
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
      console.log("prop=");
      console.log(idmodebt);
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
  chrome.storage.local.get([HightlightstorageKey], function (value) {
    console.log(value);
    var swords = value[HightlightstorageKey];
    if (swords) {
      $("#highlight-words").val("");
      $("#highlight-words").val(swords);
    }
  });
});
//-----------------------------------------
//追加機能1
//ON-OFF
$('[name="addex1-onoff"]').change(function () {
  //ON-OFFの処理
  console.log("addex1-onoff");
});
//現在の表示を記録
$("#addex1-record").click(function () {
  //記録
  //console.log("recordclick");
  //記録本体
  console.log("本体=");
  chrome.storage.local.set(
    { [HightlightstorageKey]: sw, [IdmodeStorageKey]: idmodebt },
    async () => {
      const queryOptions = { active: true, currentWindow: true };
      const [tab] = await chrome.tabs.query(queryOptions);
      chrome.tabs.sendMessage(tab.id, "Addex1-Record");
    }
  );
});
