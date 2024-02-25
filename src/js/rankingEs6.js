import { genreData } from "./genreData.js";

// TODO: 初期画面の崩れを修正する。
class RankingNavigation {
  constructor() {
    this.naviTabPositionArray = [];
    this.naviTabWidthArray = [];
    this.pageGenre = null;
    this.genreData = genreData;
    this.rankContentsHeightFlag = false;
    this.rankContentsHeight = 275;
    this.rankStock = {
      action: "stockArray",
      genre: null,
      period: "daily",
      number: 5,
    };
    this.self = this;
    this.touchstartListener = this.touchstartListener.bind(this);
    this.mousedownListener = this.mousedownListener.bind(this);
    this.touchmoveListener = this.touchmoveListener.bind(this);
    this.mousemoveListener = this.mousemoveListener.bind(this);
    this.touchendListener = this.touchendListener.bind(this);
    this.mouseupListener = this.mouseupListener.bind(this);
    this.tabNavAcion = this.tabNavAcion.bind(this);
  }

  identifyUrl() {
    const url = window.location.href;
    if (url.match("/movie/")) {
      this.pageGenre = "movie";
    } else if (url.match("/comic/")) {
      this.pageGenre = "comic";
    } else if (url.match("/music/")) {
      this.pageGenre = "music";
    } else if (url.match("/book/")) {
      this.pageGenre = "book";
    } else if (url.match("/motorcycle/")) {
      this.pageGenre = "motorcycle";
    } else if (url.match("/game/")) {
      this.pageGenre = "game";
    } else if (url.match("/pc/")) {
      this.pageGenre = "pc";
    } else {
      this.pageGenre = "all";
    }
    this.setNavHtml();
  }

  setNavHtml() {
    const navigationWrapper = document.createElement("ul");
    navigationWrapper.classList.add("navigationWrapper");
    const titleAll = this.genreData[this.pageGenre]["naviTitle"];
    titleAll.forEach((title, i) => {
      const rankTab = document.createElement("li");
      rankTab.classList.add("js_tabNavigation");
      rankTab.classList.add(
        "js_" + this.genreData[this.pageGenre]["naviTitleEn"][i]
      );
      rankTab.textContent = title;
      navigationWrapper.appendChild(rankTab);
    });

    const spinner = document.createElement("div");
    spinner.classList.add("spinner");

    const toEachGenreButton = document.createElement("a");
    toEachGenreButton.classList.add("toEachGenreButton");
    const leftArrow = document.createElement("div");
    leftArrow.classList.add("leftArrow");

    const rightArrow = document.createElement("div");
    rightArrow.classList.add("rightArrow");

    const ranking = document.querySelector("div.ranking");
    ranking.appendChild(spinner);
    ranking.appendChild(toEachGenreButton);
    ranking.appendChild(leftArrow);
    ranking.appendChild(rightArrow);

    document.querySelector(".rankTabArea").appendChild(navigationWrapper);
    this.switchingNavAndPage(0);
  }

  async callApi(genreNo, navIndex, period, number) {
    try {
      document.querySelector(".rankContents").innerHTML = "";
      document.querySelector(".spinner").style.display = "block";
      const url = `./js/json/${genreNo}.json`;
      const response = await fetch(url, { method: "GET", timeout: 10000 });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      this.setHtml(data, navIndex, genreNo);
    } catch (error) {
      console.error("NG because: ", error);
      console.log(
        "The content of the ranking has been deleted in relation to the API."
      );
      document.querySelectorAll(".rankBox").forEach((box) => box.remove());
    } finally {
    }
  }

  formatPrice(string) {
    const formattedString = string.replace(/(\d)(?=(\d{3})+$)/g, "$1,");
    return formattedString;
  }

  ellipsis() {
    const rankItemText = document.querySelectorAll(".itemText");
    rankItemText.forEach((targetText) => {
      targetText.style.overflow = "hidden";
      targetText.style.height = "2.6rem";
      targetText.style.lineHeight = "1.3";

      const textAll = targetText.innerHTML;
      const targetTextClone = targetText.cloneNode(true);
      targetTextClone.style.display = "none";
      targetTextClone.style.position = "absolute";
      targetTextClone.style.backgroundColor = "red";
      targetTextClone.style.overflow = "visible";
      targetTextClone.style.width = `${targetText.offsetWidth}px`;
      targetTextClone.style.height = "auto";
      targetText.after(targetTextClone);

      while (
        textAll.length > 0 &&
        targetTextClone.offsetHeight > targetText.offsetHeight
      ) {
        const truncatedHtml = textAll.slice(0, -1);
        targetTextClone.innerHTML = truncatedHtml + "...";
        if (targetTextClone.offsetHeight > targetText.offsetHeight) {
          textAll = truncatedHtml;
        }
      }

      targetText.innerHTML = targetTextClone.innerHTML;
      targetTextClone.remove();
    });
  }

  setHtml(data, navIndex, genre) {
    const rankingData = data.data || [];
    rankingData.forEach((item, i) => {
      const rankingMark = document.createElement("span");
      rankingMark.classList.add("rankingMark");
      rankingMark.textContent = item.rank;
      if (item.rank === "1") {
        rankingMark.classList.add("icon_gold");
      } else if (item.rank === "2") {
        rankingMark.classList.add("icon_silver");
      } else if (item.rank === "3") {
        rankingMark.classList.add("icon_bronze");
      }

      let itemImageWrapper, rankItem;
      if (i < 3) {
        const itemImg = document.createElement("img");
        itemImg.src = `${item.imageUrl}?fitin=200:200`;
        itemImg.alt = item.title;

        itemImageWrapper = document.createElement("div");
        itemImageWrapper.classList.add("itemImageWrapper");
        itemImageWrapper.appendChild(rankingMark);
        itemImageWrapper.appendChild(itemImg);
      } else {
        itemImageWrapper = document.createElement("div");
        itemImageWrapper.classList.add("itemImageWrapper2");
        itemImageWrapper.appendChild(rankingMark);
      }

      const itemData__autherAndPrice = document.createElement("dd");
      itemData__autherAndPrice.classList.add("itemData__autherAndPrice");
      itemData__autherAndPrice.innerHTML = `<span class="innerAuther">${
        item.author
      }</span><span class="innerPrice">${this.formatPrice(
        item.price
      )}円(税込)</span>`;

      const itemText = document.createElement("dt");
      itemText.classList.add("itemText");
      itemText.textContent = item.title;

      const itemTextWrapper = document.createElement("dt");
      itemTextWrapper.classList.add("itemTextWrapper");
      itemTextWrapper.appendChild(itemText);

      const itemData = document.createElement("dl");
      itemData.classList.add("itemData");
      itemData.appendChild(itemTextWrapper);
      itemData.appendChild(itemData__autherAndPrice);

      const itemDataWrap = document.createElement("div");
      itemDataWrap.classList.add("itemDataWrap");
      itemDataWrap.appendChild(itemData);

      rankItem = document.createElement("div");
      rankItem.classList.add("rankItem");
      if (i >= 3) {
        rankItem.classList.add("itemUsuall");
      }
      rankItem.appendChild(itemImageWrapper);
      rankItem.appendChild(itemDataWrap);

      const itemEventBox = document.createElement("div");
      itemEventBox.classList.add("js_itemLinkBox");
      itemEventBox.dataset.link = item.link;
      itemEventBox.style.cursor = "pointer";
      itemEventBox.appendChild(rankItem);
      document.querySelector(".rankContents").appendChild(itemEventBox);
    });

    const linkHref =
      this.pageGenre === "fbook"
        ? `//suzuki/${genre}/t`
        : `//suzuki/${genre}/u`;
    document.querySelector(".toEachGenreButton").setAttribute("href", linkHref);
    this.applyCss();
  }

  applyCss() {
    const rankContents = document.querySelector(".rankContents");
    const spinner = document.querySelector(".spinner");
    rankContents.animate([{ opacity: "0" }, { opacity: "1" }], {
      duration: 200,
      fill: "forwards",
      easing: "ease",
    }).onfinish = () => {
      spinner.style.display = "none";
    };
    const newHeight =
      this.rankContentsHeight === 0 ? "28rem" : `${this.rankContentsHeight}px`;
    rankContents.style.cssText = `
      margin-top: 1.2rem;
      height: ${newHeight};
      `;
    this.ellipsis();
    this.attachEvents();
  }

  setNavWidthPositionArray(navIndex) {
    this.naviTabPositionArray = [];
    this.naviTabWidthArray = [];
    let navigationWrapper = 0;
    document.querySelectorAll(".js_tabNavigation").forEach((rankTab) => {
      let thisWidth = rankTab.offsetWidth;
      thisWidth += 20;
      this.naviTabWidthArray.push(thisWidth);
    });
    this.naviTabWidthArray.forEach((width, i) => {
      if (i === 0) {
        this.naviTabPositionArray.push(0);
      } else {
        const t = i - 1;
        navigationWrapper += Number(this.naviTabWidthArray[t]) + 0.5;
        this.naviTabPositionArray.push(navigationWrapper);
      }
    });
    this.setNavAttribute(navIndex);
  }

  setNavAttribute(navIndex) {
    const activeNavIndex = navIndex + 1;
    const currentActiveNav = document.querySelector(
      `li:nth-of-type(${activeNavIndex})`
    );
    currentActiveNav.classList.add("pressed");
    const navigationWrapper = document.querySelector(".navigationWrapper");
    navigationWrapper.scrollTo({
      left: this.naviTabPositionArray[navIndex],
      behavior: "smooth",
    });
    const lastNavIndex = this.genreData[this.pageGenre]["naviTitle"].length - 1;
    const leftArrow = document.querySelector(".leftArrow");
    const rightArrow = document.querySelector(".rightArrow");
    if (navIndex === 0) {
      leftArrow.style.display = "none";
      rightArrow.style.display = "table";
    } else if (navIndex === lastNavIndex) {
      leftArrow.style.display = "table";
      rightArrow.style.display = "none";
    } else {
      leftArrow.style.display = "table";
      rightArrow.style.display = "table";
    }
    this.naviTabWidthArray.forEach((width, i) => {
      const t = i + 1;
      const rankTab = document.querySelector(
        `.js_tabNavigation:nth-of-type(${t})`
      );
      rankTab.style.left = `${this.naviTabPositionArray[i]}px`;
    });
  }

  judgeTouchAction(startX, endX, startY, endY, thisRankLinkBox) {
    var directionSpeedX = startX - endX;
    var directionSpeedY = startY - endY;
    if (directionSpeedX > 80) {
      this.executePageNavDirection("right");
    } else if (directionSpeedX < -80) {
      this.executePageNavDirection("left");
    } else {
      var thisLink = thisRankLinkBox.dataset.link;
      if (thisLink) {
        if (Math.abs(directionSpeedY) < 5 && Math.abs(directionSpeedX) < 5) {
          location.href = thisLink;
        }
      }
    }
  }

  calcCount(count, action) {
    if (action == "up") {
      count++;
      if (count > this.genreData[this.pageGenre]["naviTitle"].length - 1) {
        count = 0;
      }
    } else {
      count--;
      if (count < 0) {
        count = this.genreData[this.pageGenre]["naviTitle"].length - 1;
      }
    }
    return count;
  }

  executePageNavDirection(direction) {
    var rankNavCount = this.rankStock["genre"];
    if (direction == "left") {
      var pageNum = this.calcCount(rankNavCount, "down");
      this.switchingNavAndPage(pageNum);
      this.rankStock["genre"] = pageNum;
    } else if (direction == "right") {
      var pageNum = this.calcCount(rankNavCount, "up");
      this.switchingNavAndPage(pageNum);
      this.rankStock["genre"] = pageNum;
    }
  }

  switchingNavAndPage(navIndex) {
    const tabNavAll = document.querySelectorAll(".js_tabNavigation");
    tabNavAll.forEach((tabNav) => {
      tabNav.classList.remove("pressed");
    });
    const rankContents = document.querySelector(".rankContents");
    const spinner = document.querySelector(".spinner");
    rankContents.animate([{ opacity: "1" }, { opacity: "0" }], {
      duration: 200,
      fill: "forwards",
      easing: "ease",
    }).onfinish = () => {
      spinner.style.display = "block";
      rankContents.innerHTML = "";
      this.setNavWidthPositionArray(navIndex);
      this.callApi(
        this.genreData[this.pageGenre]["genreNo"][navIndex],
        navIndex,
        this.genreData[this.pageGenre]["period"],
        this.genreData[this.pageGenre]["displayNumber"]
      );
      this.removeEvents();
    };
  }

  touchstartListener(e) {
    e.stopPropagation();
    this.startX = this.isTouch ? e.changedTouches[0].pageX : e.pageX;
    this.startY = this.isTouch ? e.changedTouches[0].pageY : e.pageY;
  }

  mousedownListener(e) {
    e.stopPropagation();
    this.startX = this.isTouch ? e.changedTouches[0].pageX : e.pageX;
    this.startY = this.isTouch ? e.changedTouches[0].pageY : e.pageY;
  }

  touchmoveListener(e) {
    e.stopPropagation();
  }

  mousemoveListener(e) {
    e.stopPropagation();
  }

  touchendListener(e) {
    e.stopPropagation();
    this.endX = this.isTouch ? e.changedTouches[0].pageX : e.pageX;
    this.endY = this.isTouch ? e.changedTouches[0].pageY : e.pageY;
    const currentElement = e.target;
    this.judgeTouchAction(
      this.startX,
      this.endX,
      this.startY,
      this.endY,
      currentElement
    );
  }

  mouseupListener(e) {
    e.stopPropagation();
    this.endX = this.isTouch ? e.changedTouches[0].pageX : e.pageX;
    this.endY = this.isTouch ? e.changedTouches[0].pageY : e.pageY;
    const currentElement = e.target;
    this.judgeTouchAction(
      this.startX,
      this.endX,
      this.startY,
      this.endY,
      currentElement
    );
  }

  addAllEventListener(element) {
    this.isTouch = "ontouchstart" in window;
    element.addEventListener("touchstart", this.touchstartListener);
    element.addEventListener("mousedown", this.mousedownListener);
    element.addEventListener("touchmove", this.touchmoveListener);
    element.addEventListener("mousemove", this.mousemoveListener);
    element.addEventListener("touchend", this.touchendListener);
    element.addEventListener("mouseup", this.mouseupListener);
  }

  tabNavAcion(e) {
    const index = Array.from(e.currentTarget.parentNode.children).indexOf(
      e.currentTarget
    );
    this.rankStock["genre"] = index;
    this.switchingNavAndPage(index);
  }

  attachEvents() {
    const itemLinkBoxAll = document.querySelectorAll(".js_itemLinkBox");
    itemLinkBoxAll.forEach((linkBox) => {
      this.addAllEventListener(linkBox);
    });
    const tabNavAll = document.querySelectorAll(".js_tabNavigation");
    tabNavAll.forEach((tabNav) => {
      tabNav.addEventListener("click", this.tabNavAcion);
    });
  }

  removeAllEventListener(element) {
    element.removeEventListener("touchstart", this.touchstartListener);
    element.removeEventListener("mousedown", this.mousedownListener);
    element.removeEventListener("touchmove", this.touchmoveListener);
    element.removeEventListener("mousemove", this.mousemoveListener);
    element.removeEventListener("touchend", this.touchendListener);
    element.removeEventListener("mouseup", this.mouseupListener);
  }

  removeEvents() {
    const itemLinkBoxAll = document.querySelectorAll(".js_itemLinkBoxAll");
    itemLinkBoxAll.forEach((linkBox) => {
      this.removeAllEventListener(linkBox);
    });
    const tabNavAll = document.querySelectorAll(".js_tabNavigation");
    tabNavAll.forEach((tabNav) => {
      tabNav.removeEventListener("click", this.tabNavAcion); // イベントの削除
    });
  }

  initial() {
    var nowPage = this.rankStock["genre"];
    if (
      nowPage == null ||
      nowPage == undefined ||
      nowPage == "undefined" ||
      nowPage == ""
    ) {
      this.identifyUrl();
    } else {
      this.switchingNavAndPage(nowPage);
    }
  }
}

const rank = new RankingNavigation();
window.onload = () => {
  rank.initial();
};
