// ==UserScript==
// @name         __APP_NAME__
// @namespace    http://tampermonkey2.net/
// @version      __APP_VERSION__
// @description  任意网页提供部分漫画网站搜索；漫画分章节下载(可直接下载/压缩下载/拼接下载)，可用于动漫之家、极速漫画、腾讯漫画、哔哩哔哩等35多个网站；对个别漫画网站修改阅读样式；可按需编写定义规则JSON导入以支持其他漫画网站
// @author       journey3510
// @run-at       document-end
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_setClipboard
// @grant        GM_info
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @grant        GM_download
// @grant        GM_registerMenuCommand
// @grant        unsafeWindow
// @resource   vantcss   https://unpkg.com/vant@2.12/lib/index.css
// @require      https://unpkg.com/vue@2.6.12/dist/vue.min.js
// @require      https://unpkg.com/vant@2.12/lib/vant.min.js
// @require      https://unpkg.com/jszip@3.7.1/dist/jszip.min.js
//
// @license      GPLv3
// @include      *
// @connect      *
// ==/UserScript==
