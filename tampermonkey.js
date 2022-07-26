// ==UserScript==
// @name         __APP_NAME__
// @namespace    http://tampermonkey2.net/
// @version      __APP_VERSION__
// @description  漫画分章节压缩下载。适用于 武侠漫画、酷漫屋、百漫谷、动漫之家、七夕漫画、36漫画网、古风漫画网、腾讯漫画、漫画星球
// @author       journey3510
// @run-at       document-end
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_setClipboard
// @grant        GM_info
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @grant        GM.getValue
// @grant        GM.setValue
// @grant        GM.setClipboard
// @grant        GM_info
// @grant        GM.xmlHttpRequest
// @resource   vantcss   https://unpkg.com/vant@2.12/lib/index.css
// @require      https://cdn.bootcdn.net/ajax/libs/vue/2.6.12/vue.min.js
// @require      https://cdn.bootcdn.net/ajax/libs/jszip/3.7.1/jszip.min.js
// @require      https://unpkg.com/vant@2.12/lib/vant.min.js

// @match        *://www.kumw5.com/*
// @match        *://darpou.com/*
// @match        *://m.wuxiamh.com/*
// @match        *://www.wuxiamh.com/*
// @match        *://manhua.dmzj.com/*
// @match        *://qiximh1.com/*
// @match        *://www.36manga.com/*
// @match        *://www.gufengmanhua.com/*
// @match        *://ac.qq.com/*
// @match        *://www.mhxqiu1.com/*
// @connect      kumw5.com
// @connect      manga8.xyz
// @connect      169gouwu.com
// @connect      dmzj.com
// @connect      byteimg.com
// @connect      arc-theday.com
// @connect      gufengmanhua.com
// @connect      acimg.cn
// @connect      byteimg.com
// @connect      *
// @connect      laimidao.com
// @connect      izhegu.com
// @connect      nicefee.com
// @license      MIT
// ==/UserScript==

