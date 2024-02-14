var thisClass;
var rankingNavigation = function() {
  thisClass = this;
};
rankingNavigation.prototype = {
  rankNavPositionArray: [],
  rankNavWidthArray: [],
  serverType: null,
  pageGenre: null,
  genreData: {
    all: {
      genreNo: ["000", "001", "101", "007", "005", "003", "002", "006", "004"],
      period: "daily",
      displayNumber: 5,
      naviTitle: [
        "総合(全ジャンル)",
        "映画",
        "アニメ",
        "音楽",
        "漫画",
        "バイク",
        "ゲーム",
        "PCソフト・周辺機器",
      ],
      naviTitleEn: [
        "all",
        "movie",
        "animation",
        "music",
        "cartoon",
        "bike",
        "game",
        "pc-soft-accessory",
      ],
    },
    movie: {
      genreNo: ["001", "0011", "0012", "0013", "0014", "0015"],
      period: "daily",
      displayNumber: 5,
      naviTitle: [
        "総合（映画）",
        "SFX",
        "アクション",
        "サスペンス",
        "ドラマ",
        "ホラー",
        "ドキュメンタリー",
        "歴史",
        "音楽",
      ],
      naviTitleEn: [
        "all-movie",
        "sfx",
        "action",
        "suspense",
        "drama",
        "horror",
        "documentary",
        "history",
        "music",
      ],
    },
    comic: {
      genreNo: ["007", "0071", "0072", "0073", "0074"],
      period: "daily",
      displayNumber: 5,
      naviTitle: [
        "総合（マンガ）",
        "少年マンガ",
        "少女マンガ",
        "アダルト",
        "BL",
      ],
      naviTitleEn: [
        "all-cartoon",
        "for-boys",
        "for-girls",
        "for-adults",
        "boys-love",
      ],
    },
    music: {
      genreNo: ["005", "0051", "0052", "0053", "0054"],
      period: "daily",
      displayNumber: 5,
      naviTitle: [
        "総合（洋書）",
        "J-Pop",
        "韓流",
        "洋楽",
        "EDM",
        "Hip Hop",
        "R&B",
        "Dance",
        "アイドル",
        "歌謡曲・演歌",
      ],
      naviTitleEn: [
        "all-music",
        "jpop",
        "kpop",
        "europeAndAmerica",
        "edm",
        "hiphop",
        "R&B",
        "dance",
        "idol",
        "kayoukyoku",
      ],
    },
    book: {
      genreNo: ["003", "0031", "0032", "0033", "0034"],
      period: "daily",
      displayNumber: 5,
      naviTitle: [
        "総合（本）",
        "小説",
        "ジャーナリズム",
        "エッセイ",
        "絵本",
        "ビジネス",
        "自己啓発",
        "マネー",
      ],
      naviTitleEn: [
        "all-book",
        "novel",
        "journalism",
        "essay",
        "picture-book",
        "business",
        "self-development",
        "money",
      ],
    },
    motorcycle: {
      genreNo: ["002", "0021", "0022", "0023", "0024"],
      period: "daily",
      displayNumber: 5,
      naviTitle: [
        "総合（バイク）",
        "中型ロード",
        "小型ロード",
        "大型ロード",
        "スクーター",
        "オフロード",
      ],
      naviTitleEn: [
        "all-bike",
        "medium-road-type",
        "small-road-type",
        "large-road-type",
        "scooter",
        "off-road",
      ],
    },
    game: {
      genreNo: ["006", "0061", "0062", "0063", "0064"],
      period: "daily",
      displayNumber: 5,
      naviTitle: [
        "総合（ゲーム）",
        "ニンテンドースイッチ",
        "ニンテンドー3DS",
        "PS4",
        "おもちゃ",
      ],
      naviTitleEn: [
        "all-game",
        "nintendo-switch",
        "nintendo-3DS",
        "PS4",
        "toys",
      ],
    },
    PC: {
      genreNo: ["004", "0041", "0042", "0043", "0044"],
      period: "daily",
      displayNumber: 5,
      naviTitle: [
        "総合（PC・周辺機器）",
        "タブレット・ノート",
        "PC",
        "ソフト",
        "周辺機器",
      ],
      naviTitleEn: ["all-pc", "tablet-note", "pc", "soft", "accessory"],
    },
  },
  rankContentsHeightFlag: false,
  rankContentsHeight: 275,
  rankStock: {
    action: "stockArray",
    genre: null,
    period: "daily",
    number: 5,
  },
  UrlDiscrimination: function() {
    var uri = window.location.href;
    if (uri.match("/movie/")) {
      thisClass.pageGenre = "movie";
    } else if (uri.match("/comic/")) {
      thisClass.pageGenre = "comic";
    } else if (uri.match("/music/")) {
      thisClass.pageGenre = "music";
    } else if (uri.match("/book/")) {
      thisClass.pageGenre = "book";
    } else if (uri.match("/motorcycle/")) {
      thisClass.pageGenre = "motorcycle";
    } else if (uri.match("/game/")) {
      thisClass.pageGenre = "game";
    } else if (uri.match("/pc/")) {
      thisClass.pageGenre = "pc";
    } else {
      thisClass.pageGenre = "all";
    }
    thisClass.setNavHtml();
  },
  setNavHtml: function() {
    var ul_navRank = $("<ul>").addClass("navRank");
    for (
      var i = 0;
      i < thisClass.genreData[thisClass.pageGenre]["naviTitle"].length;
      i++
    ) {
      var li_js_Rank = $("<li>")
        .addClass("js_rank")
        .addClass(
          "js_" + thisClass.genreData[thisClass.pageGenre]["naviTitleEn"][i]
        )
        .text(thisClass.genreData[thisClass.pageGenre]["naviTitle"][i]);
      ul_navRank.append(li_js_Rank);
    }
    $(".rankTabArea").append(ul_navRank);
    thisClass.switchingNavAndPage(0);
  },
  callApi: function(genreNo, navIndex, period, number) {
    $(".rankContents").empty();
    $(".rankSpinner").css({
      display: "block",
    });
    var URI = "./js/json/" + genreNo + ".json";
    $.ajax({
      url: URI,
      type: "GET",
      dataType: "json",
      timeout: 10000,
      success: function(data) {
        thisClass.setHtml(data, navIndex, genreNo);
      },
      error: function(xhr, textStatus, errorThrown) {
        console.log("NG because : " + textStatus.responseText);
        console.log(
          "The content of the ranking has been deleted in relation to the API."
        );
        $(".rankBox").remove();
      },
      complete: function() {},
    });
  },
  formatPrice: function(string) {
    var fstring = string.replace(/(\d)(?=(\d{3})+$)/g, "$1,");
    return fstring;
  },
  ellipsis: function() {
    $(".rankData__ttl").css({
      overflow: "hidden",
      height: "2.6rem",
      "line-height": "1.3",
    });
    $(".rankData__ttl").each(function() {
      var rankTarget = $(this);
      var html = rankTarget.html();
      var rankClone = rankTarget.clone();
      rankClone
        .css({
          display: "none",
          position: "absolute",
          "background-color": "red",
          overflow: "visible",
        })
        .width(rankTarget.width())
        .height("auto");
      rankTarget.after(rankClone);
      if (rankClone.height() > rankTarget.height()) {
        while (html.length > 0 && rankClone.height() > rankTarget.height()) {
          html = html.substr(0, html.length - 1);
          rankClone.html(html + "...");
        }
        rankTarget.html(rankClone.html());
        rankClone.remove();
      }
    });
  },
  setHtml: function(data, navIndex, genre) {
    for (var i = 0; i < data["data"].length; i++) {
      if (i < 3) {
        var bookImg = $("<img>")
          .attr("src", data["data"][i]["imageUrl"] + "?fitin=200:200")
          .attr("alt", data["data"][i]["title"]);
        var rankImg__mark = $("<span>")
          .addClass("rankImg__mark")
          .text(data["data"][i]["rank"]);
        if (data["data"][i]["rank"] == "1") {
          rankImg__mark.addClass("icon_gold");
        } else if (data["data"][i]["rank"] == "2") {
          rankImg__mark.addClass("icon_silver");
        } else if (data["data"][i]["rank"] == "3") {
          rankImg__mark.addClass("icon_bronze");
        }
        var rankImg = $("<div>")
          .addClass("rankImg")
          .append(rankImg__mark)
          .append(bookImg);
        var rankData__price = $("<dd>")
          .addClass("rankData__price")
          .text(thisClass.formatPrice(data["data"][i]["price"]) + "円(税込)");
        var rankData__auther = $("<dd>")
          .addClass("rankData__auther")
          .text(data["data"][i]["author"]);
        var rankData__ttl = $("<span>")
          .addClass("rankData__ttl")
          .text(data["data"][i]["title"]);
        var rankData__ttl_wrap = $("<dt>")
          .addClass("rankData__ttl_wrap")
          .append(rankData__ttl);
        var rankData = $("<dl>")
          .addClass("rankData")
          .append(rankData__ttl_wrap)
          .append(rankData__auther)
          .append(rankData__price);
        var rankDataWrap = $("<div>")
          .addClass("rankDataWrap")
          .append(rankData);
        var rankItem = $("<div>")
          .addClass("rankItem")
          .append(rankImg)
          .append(rankDataWrap);
        var rank_link = $("<div>")
          .addClass("js_rankLinkBox")
          .data("link", data["data"][i]["link"])
          .css({
            cursor: "pointer",
          })
          .append(rankItem);
      } else {
        var rankImg__mark = $("<span>")
          .addClass("rankImg__mark")
          .addClass("icon_usuall")
          .text(data["data"][i]["rank"]);
        var rankImg = $("<div>")
          .addClass("rankImg2")
          .append(rankImg__mark);
        var rankData__autherAndPrice = $("<dd>").addClass(
          "rankData__autherAndPrice"
        );
        rankData__autherAndPrice.html(
          '<span class="innerAuther">' +
            data["data"][i]["author"] +
            '</span><span class="innerPrice">' +
            thisClass.formatPrice(data["data"][i]["price"]) +
            "円(税込)</span>"
        );
        var rankData__ttl = $("<dt>")
          .addClass("rankData__ttl")
          .text(data["data"][i]["title"]);
        var rankData__ttl_wrap = $("<dt>")
          .addClass("rankData__ttl_wrap")
          .append(rankData__ttl);
        var rankData = $("<dl>")
          .addClass("rankData")
          .append(rankData__ttl_wrap)
          .append(rankData__autherAndPrice);
        var rankDataWrap = $("<div>")
          .addClass("rankDataWrap")
          .append(rankData);
        var rankItem = $("<div>")
          .addClass("rankItem")
          .addClass("itemUsuall")
          .append(rankImg)
          .append(rankDataWrap);
        var rank_link = $("<div>")
          .addClass("js_rankLinkBox")
          .data("link", data["data"][i]["link"])
          .css({
            cursor: "pointer",
          })
          .append(rankItem);
      }
      $(".rankContents").append(rank_link);
    }
    if (navIndex == 0) {
      $(".js_rankLinkBtn").attr({
        href: "//suzuki/" + genre + "s",
      });
      $(document).ready(function() {
        thisClass.applyCss();
      });
    } else {
      if (thisClass.pageGenre == "fbook") {
        $(".js_rankLinkBtn").attr({
          href: "//suzuki/" + genre + "/t",
        });
      } else {
        $(".js_rankLinkBtn").attr({
          href: "//suzuki/" + genre + "/u",
        });
      }
      $(document).ready(function() {
        thisClass.applyCss();
      });
    }
  },
  applyCss: function() {
    $(".rankContents")
      .stop()
      .animate(
        {
          opacity: 1,
        },
        200,
        function() {
          $(".rankSpinner").css({
            display: "none",
          });
        }
      );
    if (thisClass.rankContentsHeightFlag == true) {
      if (thisClass.rankContentsHeight == 0) {
        $(".rankContents").css({
          "margin-top": "1.2rem",
          height: "28rem",
        });
      } else {
        $(".rankContents").css({
          "margin-top": "1.2rem",
          height: thisClass.rankContentsHeight + "px",
        });
      }
    } else {
      thisClass.rankContentsHeight = $(".rankContents").height();
      $(".rankContents").css({
        "margin-top": "1.2rem",
        height: "28rem",
      });
      thisClass.rankContentsHeightFlag = true;
    }
    thisClass.ellipsis();
    thisClass.attachEvents();
  },
  setNavWidthPositionArray: function(navIndex) {
    thisClass.rankNavPositionArray = [];
    thisClass.rankNavWidthArray = [];
    var ulLength = 0;
    $(".js_rank").each(function() {
      var thisWidth = $(this).width();
      thisWidth = thisWidth + 20;
      thisClass.rankNavWidthArray.push(thisWidth);
    });
    for (var i = 0; i < thisClass.rankNavWidthArray.length; i++) {
      if (i == 0) {
        thisClass.rankNavPositionArray.push(0);
      } else {
        var t = i - 1;
        ulLength = ulLength + Number(thisClass.rankNavWidthArray[t]) + 0.5;
        thisClass.rankNavPositionArray.push(ulLength);
      }
    }
    $(document).ready(function() {
      thisClass.setNavAttribute(navIndex);
    });
  },

  setNavAttribute: function(navIndex) {
    var activeNavIndex = navIndex + 1;
    var nowActiveNavObj = $("li:nth-of-type(" + activeNavIndex + ")");
    nowActiveNavObj.addClass("pressed");
    $(".navRank").animate(
      {
        scrollLeft: thisClass.rankNavPositionArray[navIndex],
      },
      200
    );
    if (navIndex == 0) {
      $(".rankLeftNavArrow").css({
        display: "none",
      });
      $(".rankrightNavArrow").css({
        display: "table",
      });
    } else if (
      navIndex ==
      thisClass.genreData[thisClass.pageGenre]["naviTitle"].length - 1
    ) {
      $(".rankLeftNavArrow").css({
        display: "table",
      });
      $(".rankrightNavArrow").css({
        display: "none",
      });
    } else {
      $(".rankLeftNavArrow").css({
        display: "table",
      });
      $(".rankrightNavArrow").css({
        display: "table",
      });
    }
    for (var i = 0; i < thisClass.rankNavWidthArray.length; i++) {
      var t = i + 1;
      $(".js_rank:nth-of-type(" + t + ")").css({
        left: thisClass.rankNavPositionArray[i] + "px",
      });
    }
  },
  judgeTouchAction: function(startX, endX, startY, endY, thisRankLinkBox) {
    var directionSpeedX = startX - endX;
    var directionSpeedY = startY - endY;
    if (directionSpeedX > 80) {
      thisClass.executePageNavDirection("right");
    } else if (directionSpeedX < -80) {
      thisClass.executePageNavDirection("left");
    } else {
      var thisLink = thisRankLinkBox.data("link");
      if (thisLink) {
        if (Math.abs(directionSpeedY) < 5 && Math.abs(directionSpeedX) < 5) {
          location.href = thisLink;
        }
      }
    }
  },
  caluCount: function(count, action) {
    if (action == "up") {
      count++;
      if (
        count >
        thisClass.genreData[thisClass.pageGenre]["naviTitle"].length - 1
      ) {
        count = 0;
      }
    } else {
      count--;
      if (count < 0) {
        count =
          thisClass.genreData[thisClass.pageGenre]["naviTitle"].length - 1;
      }
    }
    return count;
  },
  executePageNavDirection: function(direction) {
    var rankNavCount = thisClass.rankStock["genre"];
    if (direction == "left") {
      var pageNum = thisClass.caluCount(rankNavCount, "down");
      thisClass.switchingNavAndPage(pageNum);
      thisClass.rankStock["genre"] = pageNum;
    } else if (direction == "right") {
      var pageNum = thisClass.caluCount(rankNavCount, "up");
      thisClass.switchingNavAndPage(pageNum);
      thisClass.rankStock["genre"] = pageNum;
    }
  },
  switchingNavAndPage: function(navIndex) {
    $(".rankContents")
      .stop()
      .animate(
        {
          opacity: 0,
        },
        200
      );
    $(".js_rank").removeClass("pressed");
    $(document).ready(function() {
      thisClass.setNavWidthPositionArray(navIndex);
      thisClass.callApi(
        thisClass.genreData[thisClass.pageGenre]["genreNo"][navIndex],
        navIndex,
        thisClass.genreData[thisClass.pageGenre]["period"],
        thisClass.genreData[thisClass.pageGenre]["displayNumber"]
      );
      thisClass.removeEvents();
    });
  },
  //ENENTS____________________________________________________________________
  attachEvents: function() {
    var startX, endX, startY, endY;
    var isTouch = "ontouchstart" in window;
    $(document).on("touchstart mousedown", ".js_rankLinkBox", function(e) {
      e.stopPropagation();
      startX = isTouch ? e.changedTouches[0].pageX : e.pageX;
      startY = isTouch ? e.changedTouches[0].pageY : e.pageY;
    });
    $(document).on("touchmove mousemove", ".js_rankLinkBox", function(e) {
      e.stopPropagation();
    });
    $(document).on("touchend mouseup", ".js_rankLinkBox", function(e) {
      e.stopPropagation();
      endX = isTouch ? e.changedTouches[0].pageX : e.pageX;
      endY = isTouch ? e.changedTouches[0].pageY : e.pageY;
      var nowTthis = $(this);
      thisClass.judgeTouchAction(startX, endX, startY, endY, nowTthis);
    });
    $(".js_rank").on("click touch", function() {
      var index = $(this).index();
      thisClass.rankStock["genre"] = index;
      thisClass.switchingNavAndPage(index);
    });
  },
  removeEvents: function() {
    $(document).off(
      "touchend mouseup touchmove mousemove touchstart mousedown",
      ".js_rankLinkBox"
    );
    $(".js_rank").off("click touch");
  },
  //ACTION____________________________________________________________________
  initial: function() {
    var nowPage = thisClass.rankStock["genre"];
    if (
      nowPage == null ||
      nowPage == undefined ||
      nowPage == "undefined" ||
      nowPage == ""
    ) {
      thisClass.UrlDiscrimination();
    } else {
      thisClass.switchingNavAndPage(nowPage);
    }
  },
};
var rank = new rankingNavigation();
window.onload = function() {
  rank.initial();
};
