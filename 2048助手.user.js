// ==UserScript==
// @name         2048助手
// @description  2048论坛直接预览帖子内图片，过滤低质量帖子
// @version      1.0.1
// @author       qinghuiKAKA
// @namespace    hjd2048.com
// @match        *://hjd2048.com/*
// @match        *://v5oob.346142.org/*
// @require      https://code.jquery.com/jquery-3.4.1.min.js
// @grant        GM_xmlhttpRequest
// @license 	 GNU GPLv3
// ==/UserScript==

(function () {
  "use strict";
  $("head").append($(`<style></style>`));

  var getCookies = function () {
    var pairs = document.cookie.split(";");
    var cookies = {};
    for (var i = 0; i < pairs.length; i++) {
      var pair = pairs[i].split("=");
      cookies[(pair[0] + "").trim()] = unescape(pair.slice(1).join("="));
    }
    return cookies;
  };

  var href = document.location.href;
  var headers = {
          "User-agent": window.navigator.userAgent,
          Accept:
            "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
          cookie: document.cookie,
          referer: href,
        };


  // 预览内容图片
  $(".tr3.t_one, .tr3.tac").each(function () {
    var that = $(this);
    //修改网址
    var url = document.location.origin + "/2048/" + $(this).find("a").attr("href");
    //过滤搜索或者板块内的垃圾内容，垃圾板块，空板块
    if (href.indexOf("search.php") >= 0) {
      var thattd = that.find("th:eq(0)");
      if (thattd.text().match(/伪娘|破壊版|有码/i) ||
          that.find("td:eq(1)").text().match(/豆芽高手/i) ||
          that.find("td:eq(0)").find('a[href*="fid=0"]').length > 0 ||
          that.find("td:eq(0)").text().match(/中字原創|H-GAME|日本騎兵|三級寫真|卡通漫畫|实用漫画|多挂原创|歐美新片|歐美激情|熟女专图|高跟絲襪|街拍精品|网盘二区|网盘三区|高清有碼|AI視界|A I 智能|真实街拍|图你所图/i)) {
        that.remove();
        return true;
      }
    }
    else{
      var thattd = that.find("td:eq(1)");
      //that.find("td:eq(2)").text().match(/国产专员|優衣庫|hdgc|日落黄昏|罗马教皇|avp2p|东华帝君|東方秋白|feixue124|YouKu|soav.|myheroman|zgome|魔火帝皇|豆芽高手|1080fuli/i
      if (thattd.text().match(/伪娘|破壊版|有码/i)) {
        that.remove();
        return true;
      }
    }
    //第二个td元素为标题,搜索中第一个th为标题

    if (url.indexOf("read.php") >= 0 || url.indexOf("state") >= 0 ) {
      GM_xmlhttpRequest({
        method: "GET",
        url: url,
        headers: headers,
        onload: function (result) {
          var doc = result.responseText;
          //查找所有子元素的图片，不含无关的图片，有data-original就选data-original
          $(doc).find(".f14.cc img:not([align='absmiddle'])").each(function (index) {
                if (index == 0) {
                  thattd.append("<br />");
                }
                var src = $(this).attr('data-original') !== undefined
                    ? $(this).attr('data-original')
                    : $(this).attr('src');
                thattd.append(
                  "<img object-fit='contain' style='width:200px;' src='" +
                    src +
                    "' />"
                );
              });
          //多种格式图片
          $(doc).find(".showhide img:not([align='absmiddle'])").each(function (index) {
                  if (index == 0) {
                    thattd.append("<br />");
                  }
                  var src = $(this).attr('data-original') !== undefined
                      ? $(this).attr('data-original')
                      : $(this).attr('src');
                  thattd.append(
                    "<img object-fit='contain' style='width:200px;' src='" +
                      src +
                      "' />"
                  );
                });
        }
      });
    }
 });

})();
