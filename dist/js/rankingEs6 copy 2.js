import{genreData}from"./genreData.js";class RankingNavigation{constructor(){this.naviTabPositionArray=[],this.naviTabWidthArray=[],this.pageGenre=null,this.genreData=genreData,this.rankContentsHeightFlag=!1,this.rankContentsHeight=275,this.rankStock={action:"stockArray",genre:null,period:"daily",number:5},this.self=this}identifyUrl(){var e=window.location.href;e.match("/movie/")?this.pageGenre="movie":e.match("/comic/")?this.pageGenre="comic":e.match("/music/")?this.pageGenre="music":e.match("/book/")?this.pageGenre="book":e.match("/motorcycle/")?this.pageGenre="motorcycle":e.match("/game/")?this.pageGenre="game":e.match("/pc/")?this.pageGenre="pc":this.pageGenre="all",this.setNavHtml()}setNavHtml(){const n=document.createElement("ul");n.classList.add("navigationWrapper");this.genreData[this.pageGenre].naviTitle.forEach((e,t)=>{var a=document.createElement("li");a.classList.add("js_rank"),a.classList.add("js_"+this.genreData[this.pageGenre].naviTitleEn[t]),a.textContent=e,n.appendChild(a)});var e=document.createElement("div"),t=(e.classList.add("spinner"),document.createElement("a")),a=(t.classList.add("toEachGenreButton"),document.createElement("div")),i=(a.classList.add("leftArrow"),document.createElement("div")),s=(i.classList.add("rightArrow"),document.querySelector("div.ranking"));s.appendChild(e),s.appendChild(t),s.appendChild(a),s.appendChild(i),document.querySelector(".rankTabArea").appendChild(n),this.switchingNavAndPage(0)}async callApi(e,t,a,n){try{document.querySelector(".rankContents").innerHTML="",document.querySelector(".spinner").style.display="block";var i=await fetch(`./js/json/${e}.json`,{method:"GET",timeout:1e4});if(!i.ok)throw new Error("HTTP error! status: "+i.status);var s=await i.json();this.setHtml(s,t,e)}catch(e){console.error("NG because: ",e),console.log("The content of the ranking has been deleted in relation to the API."),document.querySelectorAll(".rankBox").forEach(e=>e.remove())}}formatPrice(e){return e.replace(/(\d)(?=(\d{3})+$)/g,"$1,")}ellipsis(){document.querySelectorAll(".itemText").forEach(e=>{e.style.overflow="hidden",e.style.height="2.6rem",e.style.lineHeight="1.3";const t=e.innerHTML;var a=e.cloneNode(!0);for(a.style.display="none",a.style.position="absolute",a.style.backgroundColor="red",a.style.overflow="visible",a.style.width=e.offsetWidth+"px",a.style.height="auto",e.after(a);0<t.length&&a.offsetHeight>e.offsetHeight;){var n=t.slice(0,-1);a.innerHTML=n+"...",a.offsetHeight>e.offsetHeight&&(t=n)}e.innerHTML=a.innerHTML,a.remove()})}setHtml(e,t,a){(e.data||[]).forEach((e,t)=>{var a=document.createElement("span");a.classList.add("rankingMark"),a.textContent=e.rank,"1"===e.rank?a.classList.add("icon_gold"):"2"===e.rank?a.classList.add("icon_silver"):"3"===e.rank&&a.classList.add("icon_bronze");let n,i;t<3?((s=document.createElement("img")).src=e.imageUrl+"?fitin=200:200",s.alt=e.title,(n=document.createElement("div")).classList.add("itemImageWrapper"),n.appendChild(a),n.appendChild(s)):((n=document.createElement("div")).classList.add("itemImageWrapper2"),n.appendChild(a));var s=document.createElement("dd"),a=(s.classList.add("itemData__autherAndPrice"),s.innerHTML=`<span class="innerAuther">${e.author}</span><span class="innerPrice">${this.formatPrice(e.price)}円(税込)</span>`,document.createElement("dt")),r=(a.classList.add("itemText"),a.textContent=e.title,document.createElement("dt")),a=(r.classList.add("itemTextWrapper"),r.appendChild(a),document.createElement("dl")),r=(a.classList.add("itemData"),a.appendChild(r),a.appendChild(s),document.createElement("div")),s=(r.classList.add("itemDataWrap"),r.appendChild(a),(i=document.createElement("div")).classList.add("rankItem"),3<=t&&i.classList.add("itemUsuall"),i.appendChild(n),i.appendChild(r),document.createElement("div"));s.classList.add("js_itemLinkBox"),s.dataset.link=e.link,s.style.cursor="pointer",s.appendChild(i),document.querySelector(".rankContents").appendChild(s)});e="fbook"===this.pageGenre?`//suzuki/${a}/t`:`//suzuki/${a}/u`;document.querySelector(".toEachGenreButton").setAttribute("href",e),this.applyCss()}applyCss(){var e=document.querySelector(".rankContents");const t=document.querySelector(".spinner");e.animate([{opacity:"0"},{opacity:"1"}],{duration:200,fill:"forwards",easing:"ease"}).onfinish=()=>{t.style.display="none"};var a=0===this.rankContentsHeight?"28rem":this.rankContentsHeight+"px";e.style.cssText=`
      margin-top: 1.2rem;
      height: ${a};
      `,this.ellipsis(),this.attachEvents()}setNavWidthPositionArray(e){this.naviTabPositionArray=[],this.naviTabWidthArray=[];let a=0;document.querySelectorAll(".js_rank").forEach(e=>{e=e.offsetWidth;this.naviTabWidthArray.push(e+=20)}),this.naviTabWidthArray.forEach((e,t)=>{0===t?this.naviTabPositionArray.push(0):(t=t-1,a+=Number(this.naviTabWidthArray[t])+.5,this.naviTabPositionArray.push(a))}),this.setNavAttribute(e)}setNavAttribute(e){document.querySelector(`li:nth-of-type(${e+1})`).classList.add("pressed");document.querySelector(".navigationWrapper").scrollTo({left:this.naviTabPositionArray[e],behavior:"smooth"});var t=this.genreData[this.pageGenre].naviTitle.length-1,a=document.querySelector(".leftArrow"),n=document.querySelector(".rightArrow");0===e?(a.style.display="none",n.style.display="table"):e===t?(a.style.display="table",n.style.display="none"):(a.style.display="table",n.style.display="table"),this.naviTabWidthArray.forEach((e,t)=>{document.querySelector(`.js_rank:nth-of-type(${t+1})`).style.left=this.naviTabPositionArray[t]+"px"})}judgeTouchAction(e,t,a,n,i){e-=t,t=a-n;80<e?this.executePageNavDirection("right"):e<-80?this.executePageNavDirection("left"):(a=i.dataset.link)&&Math.abs(t)<5&&Math.abs(e)<5&&(location.href=a)}calcCount(e,t){return"up"==t?++e>this.genreData[this.pageGenre].naviTitle.length-1&&(e=0):--e<0&&(e=this.genreData[this.pageGenre].naviTitle.length-1),e}executePageNavDirection(e){var t,a=this.rankStock.genre;"left"==e?(t=this.calcCount(a,"down"),this.switchingNavAndPage(t),this.rankStock.genre=t):"right"==e&&(t=this.calcCount(a,"up"),this.switchingNavAndPage(t),this.rankStock.genre=t)}switchingNavAndPage(e){const t=document.querySelector(".rankContents"),a=document.querySelector(".spinner");t.animate([{opacity:"1"},{opacity:"0"}],{duration:200,fill:"forwards",easing:"ease"}).onfinish=()=>{a.style.display="block",t.innerHTML="",this.setNavWidthPositionArray(e),this.callApi(this.genreData[this.pageGenre].genreNo[e],e,this.genreData[this.pageGenre].period,this.genreData[this.pageGenre].displayNumber),this.removeEvents()}}attachEvents(){let t,a,n,i;const s="ontouchstart"in window;document.querySelectorAll(".js_itemLinkBox").forEach(e=>{e.addEventListener("touchstart",e=>{e.stopPropagation(),t=(s?e.changedTouches[0]:e).pageX,n=(s?e.changedTouches[0]:e).pageY}),e.addEventListener("mousedown",e=>{e.stopPropagation(),t=(s?e.changedTouches[0]:e).pageX,n=(s?e.changedTouches[0]:e).pageY}),e.addEventListener("touchmove ",e=>{e.stopPropagation()}),e.addEventListener("mousemove",e=>{e.stopPropagation()}),e.addEventListener("touchend",e=>{e.stopPropagation(),a=(s?e.changedTouches[0]:e).pageX,i=(s?e.changedTouches[0]:e).pageY;e=e.target;this.judgeTouchAction(t,a,n,i,e)}),e.addEventListener("mouseup",e=>{e.stopPropagation(),a=(s?e.changedTouches[0]:e).pageX,i=(s?e.changedTouches[0]:e).pageY;e=e.target;this.judgeTouchAction(t,a,n,i,e)})});const r=document.querySelectorAll(".js_rank");r.forEach(t=>{t.addEventListener("click",()=>{var e=Array.from(r).indexOf(t);this.rankStock.genre=e,this.switchingNavAndPage(e)})})}removeEvents(){document.querySelectorAll(".js_itemLinkBox").forEach(e=>{e.removeEventListener("touchstart",e=>{e.stopPropagation(),startX=(isTouch?e.changedTouches[0]:e).pageX,startY=(isTouch?e.changedTouches[0]:e).pageY}),e.removeEventListener("mousedown",e=>{e.stopPropagation(),startX=(isTouch?e.changedTouches[0]:e).pageX,startY=(isTouch?e.changedTouches[0]:e).pageY}),e.removeEventListener("touchmove ",e=>{e.stopPropagation()}),e.removeEventListener("mousemove",e=>{e.stopPropagation()}),e.removeEventListener("touchend",e=>{e.stopPropagation(),endX=(isTouch?e.changedTouches[0]:e).pageX,endY=(isTouch?e.changedTouches[0]:e).pageY;e=e.target;this.judgeTouchAction(startX,endX,startY,endY,e)}),e.removeEventListener("mouseup",e=>{e.stopPropagation(),endX=(isTouch?e.changedTouches[0]:e).pageX,endY=(isTouch?e.changedTouches[0]:e).pageY;e=e.target;this.judgeTouchAction(startX,endX,startY,endY,e)})}),document.querySelectorAll(".js_rank").forEach(e=>{e.removeEventListener("click",this.handleRankClick)})}initial(){var e=this.rankStock.genre;null==e||"undefined"==e||""==e?this.identifyUrl():this.switchingNavAndPage(e)}}const rank=new RankingNavigation;window.onload=()=>{rank.initial()};