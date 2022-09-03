// ==UserScript==
// @name         __APP_NAME__
// @namespace    http://tampermonkey2.net/
// @version      __APP_VERSION__
// @description  提供漫画搜索、漫画分章节下载(可直接下载/压缩下载)并记录下载历史，适用于 酷漫屋、百漫谷、武侠漫画、动漫之家、七夕漫画、36漫画网、古风漫画网、腾讯漫画、漫画星球、好漫8、漫画屋、27漫画网、最漫画、前未漫画、六漫画、漫画芯、包子漫画；对个别漫画网站修改阅读样式；可按需编写规定的定义规则JSON导入以支持其他漫画网站；
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
// @resource   vantcss   https://unpkg.com/vant@2.12/lib/index.css
// @require      https://cdn.bootcdn.net/ajax/libs/vue/2.6.12/vue.min.js
// @require      https://unpkg.com/vant@2.12/lib/vant.min.js
// @require      https://cdn.bootcdn.net/ajax/libs/jszip/3.7.1/jszip.min.js
//
// @match        *://www.kumw5.com/*
// @connect      kumw5.com
//
// @match        *://www.darpou.com/*
// @match        *://darpou.com/*
// @connect      manga8.xyz
//
// @match        *://m.wuxiamh.com/*
// @match        *://www.wuxiamh.com/*
// @connect      169gouwu.com
//
// @match        *://*.dmzj.com/*
// @connect      dmzj.com
//
// @match        *://qiximh1.com/*
// @connect      qiximh1.com
// @connect      byteimg.com
//
// @match        *://www.36manga.com/*
// @connect      arc-theday.com
//
// @match        *://www.gufengmanhua.com/*
// @connect      gufengmanhua.com
// @match        *://www.123gf.com/*
// @connect      123gf.com
// @connect      xiaoqinre.com
// @connect      bdstatic.com
//
// @match        *://ac.qq.com/*
// @connect      ac.qq.com
// @connect      acimg.cn
//
// @match        *://www.mhxqiu1.com/*
// @connect      mhxqiu1.com
// @connect      byteimg.com
//
// @match        *://www.haoman8.com/*
// @connect      haoman8.com
//
// @match        *://www.mh5.org/*
// @connect      mh5.org
// @connect      xiaomingtaiji.net
//
// @match        *://www.2mzx.com/*
// @connect      2mzx.com
// @connect      hnsrht.com
// @connect      huayingrenren.cn
//
// @match        *://www.zuimh.com/*
// @connect      zuimh.com
// @connect      pinmh.com
// @connect      ejujiu.com
// @connect      dodomh.com
//
// @match        *://www.qianwee.com/*
// @connect      qianwee.com
// @connect      szssjg.com
//
// @match        *://www.sixmh7.com/*
// @connect      ixmh7.com
// @connect      byteimg.com
//
// @match        *://www.mhxin.com/*
// @connect      mhxin.com
//
// @match        *://www.pkssj.com/*
// @connect      pkssj.com
// @connect      manhuatu.cc
//
// @connect      *
// @connect      laimidao.com
// @connect      izhegu.com
// @connect      nicefee.com
// @connect      dcarimg.com
// @connect      baozimh.com
// @license      MIT
// ==/UserScript==
