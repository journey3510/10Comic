## 功能
- 使用  通过快捷键（默认）**"Alt + V"** 唤起脚本，点击按钮可切换显示/隐藏界面，界面含（主页，加载，下载，设置）四个标签栏，点击切换显示各自内容
- 主页
  - 显示脚本目前适用的漫画网站和导入规则网站，点击可 *跳转* 至网站
- 加载页
  - 在适用的漫画网站**某一漫画目录页** 下，点击加载获取当前网页漫画章节
  - 可**全选\全取消\多选\区间选择(按shift)章节**，选择后点击下载按钮，开始下载
  - 点击分割线 **重载列表** 文字，重新加载章节
  - 章节排序显示
  - **章节名自定义编辑功能**
  - 编辑章节可批量删除所选章节首/末尾一个字符
  - 自动增加章节序号(可选)
  - 在阅读章节页面下载当前章节(test)
- 下载页
  - 含（下载中、待下载、已下载）三个列表项，显示下载的章节名称。
  - "下载中"列表项显示章节下载进度
  - **压缩下载**， 保存压缩章节漫画文件: **10Comic(文件夹)\漫画名(文件夹)\章节链接名称.zip**  <br />
    **直接下载**，保存图片文件: **10Comic(文件夹)\漫画名(文件夹)\章节链接名称(文件夹)\图片序号.jpg** <br />
    **拼接下载**，保存图片文件: **10Comic(文件夹)\漫画名(文件夹)\章节链接名称(文件夹)\拼接后图片序号.jpg**  <br />
    如要保存在 ***文件夹*** 中，需要设置**油猴 [浏览器 API](#browserapi)**
  - 下载的 '序号.txt' 文件为记录下载错误或请求超时的图片地址
  - 显示下载记录,可删除指定下载记录,点击漫画名 *跳转* 该漫画目录页
- 设置页
  - app加载选项(初始是否加载界面,设置加载界面快捷键-(默认Alt + V),设置窗口加载比例缩放)
  - 设置最多可同时下载章节数量
  - 设置每章最大下载图片数
  - 选择下载方式（压缩下载/直接下载/拼接下载）
  - 可更改单张拼接图片最大高度
  - 图片数字命名指定最少位数(图片序号小于指定位数则向前补充0命名)
  - 设置章节图片下载范围 (默认 1至-1, 代表从第一张图片下载至最后一张)
  - 对个别漫画网站图片上下拼接(可选)
  - 可**导入、删除其他网站漫画规则**（导入规则见-[自定义添加规则](#自定义添加规则))
  - 可初始化设置中所有数据
  - 添加脚本反馈/评分跳转链接
- 搜索 (默认隐藏)
  - 对多个网站搜索漫画，可跳转指定漫画网页

<br />

[![github](https://img.shields.io/badge/journey3510-10Comic_-blue?style=flat&logo=github)](https://github.com/journey3510/10Comic)
[![github](https://img.shields.io/github/commit-activity/y/journey3510/10Comic?logo=github)](https://github.com/journey3510/10Comic)
[![10Comic](https://img.shields.io/badge/GreasyFork-10Comic_-blue?style=flat&logo=data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH3ggEBCQHM3fXsAAAAVdJREFUOMudkz2qwkAUhc/goBaGJBgUtBCZyj0ILkpwAW7Bws4yO3AHLiCtEFD8KVREkoiFxZzX5A2KGfN4F04zMN+ce+5c4LMUgDmANYBnrnV+plBSi+FwyHq9TgA2LQpvCiEiABwMBtzv95RSfoNEHy8DYBzHrNVqVEr9BWKcqNFoxF6vx3a7zc1mYyC73a4MogBg7vs+z+czO50OW60Wt9stK5UKp9Mpj8cjq9WqDTBHnjAdxzGQZrPJw+HA31oulzbAWgLoA0CWZVBKIY5jzGYzdLtdE9DlcrFNrY98zobqOA6TJKHW2jg4nU5sNBpFDp6mhVe5rsvVasUwDHm9Xqm15u12o+/7Hy0gD8KatOd5vN/v1FozTVN6nkchxFuI6hsAAIMg4OPxMJCXdtTbR7JJCMEgCJhlGUlyPB4XfumozInrupxMJpRSRtZlKoNYl+m/6/wDuWAjtPfsQuwAAAAASUVORK5CYII=)](https://greasyfork.org/zh-CN/scripts/447819)
<br /><br />

## 2023.2.10 
  **脚本开源-[GitHub](https://github.com/journey3510/10Comic)** <— 对你有帮助的话给我点个 star 吧


## 2023.2.7 
  从 **1.4.0** 版本起脚本更改为任意网页运行，脚本默认不加载界面，可通过快捷键 **Alt + V** 加载界面，或点击浏览器油猴扩展图标点击本脚本中的-加载UI <br />
  当然也可以在脚本设置中恢复默认加载界面 （**不建议**。1、部分网站为SPA页面，页面更改不会重新触发脚本。2、脚本使用 Vant 组件库, 可能影响原网站样式，如会改变网站的字体大小等)
<br /><br />

## 操作指北
 - <sapn id='browserapi'> 油猴-浏览器API （设置
    - 油猴 - 设置 - 通用 - 配置模式 - 选高级
    - 设置 - 下载 BETA - 下载模式 - 选浏览器API
  - **唤不起脚本界面?**
    - **原因**  脚本引入外部组件，可能会有因不同地区的网络影响导致没有加载的这些外部资源，使脚本无法正常运行。<br />
    具体点击油猴插件，右键“10图漫”脚本，进入脚本编辑页后，点击外部，查看是否有 4 个外部引用链接缓存（文件大小不为0
    <br />
    - **解决方法** 隔一段时间再尝试，网络影响可能就没有了（；´д｀）ゞ。也可以尝试使用加速器，刷新网页，再唤起脚本界面。（[参考1](https://greasyfork.org/zh-CN/scripts/447819B/discussions/218225)、 [参考2](https://greasyfork.org/zh-CN/scripts/447819/discussions/217570) )


<br /><br />


## 漫画网站列表
| **网站** | **首页**                    | **提示**                 |
|-------------|---------------------------------|-----------------------------|
| 动漫之家        | https://manhua.idmzj.com/        |                             |
| 动漫之家(手机)     | https://m.idmzj.com/       |                             |
| 动漫之家(访客)    | https://comic.idmzj.com/       |                             |
| Mangabz     | https://mangabz.com/            |                             |
| 再漫画        | https://manhua.zaimanhua.com/        |                       |
| 动漫屋         | https://www.dm5.com/            |                             |
| 动漫屋2         | https://tel.dm5.com/            |                             |
| GoDa         | https://godamh.com        |                             |
| 来漫画         | https://www.comemh.com/        |                             |
| R如漫画         | https://www.rumanhua.com/       |                             |
| 咚漫          | https://www.dongmanmanhua.cn/   |                             |
| webtoons    | https://www.webtoons.com/       | ？需要魔法？                      |
| comic.naver | https://comic.naver.com/        | 找到漫画目录页再使用                  |
| 腾讯漫画        | https://ac.qq.com/              | 2023.3.2起, 需要APP观看的章节无法完整下载 |
| 哔哩哔哩        | ~~https://manga.bilibili.com/~~    |       已失效                      |
| 哔哩哔哩漫画国际版   | ~~https://www.bilibilicomics.com/~~ |  已失效                      |
| Komiic漫画    | https://komiic.com/             | SPA页面, 新页面需“重载列表”重新匹配新名称    |
| 百漫谷      | https://www.darpou.com/         |                             |
| 七夕漫画        | http://www.qiximh2.com/             |                             |
| 拷贝漫画        | https://www.copymanga.tv/         |                     |
| 风车漫画        | https://www.fengchemh.com/        |                     |
| 漫画柜       | https://www.manhuagui.com/        |                           |
| 36漫画网       | https://www.36manga.com/        | ？可访问 ？                      |
| 古风漫画网     | https://www.gufengmh9.com/              |                             |
| 动漫戏说        | https://comic.acgn.cc/          |                             |
| 新新漫画        | https://www.77mh.xyz/           |                             |
| 仙漫网        | https://www.gaonaojin.com/           |                             |
| 漫画星球        | http://www.mhxqiu4.com/         |                             |
| 漫画屋         | https://www.mhua5.com/          |                             |
| 动漫狂         | https://www.cartoonmad.com          |                             |
| 最漫画         | https://www.zuimh.com/          |                             |
| 六漫画         | http://www.6mh1.com/          |                             |
| 漫画芯         | https://www.mhxin.com/          |                             |
| 包子漫画        | https://cn.baozimhcn.com/         |                             |
| 爱国漫         | https://www.guoman.net/       |                              |
| 最次元         | https://zcymh.com/       |                               |
| 看漫画        | https://www.kanman.com/   |                             |
| 快看漫画        | https://www.kuaikanmanhua.com/  |                             |
| 好漫8         | https://www.haoman8.com/        |                             |


<br />

## <font color="#dd0000">* 声明/注意</font>
  - **该脚本及其产生的内容数据仅限用于个人学习，不要将其用于任何非法使用，后果与作者无关**
  - 请合理使用线程
  - 网站可能会更换域名而导致脚本网站方法失效
  - 如脚本界面中网站显示**未匹配**，则代表**该网站未加入匹配规则**或**原网站域名已更换而失效**
  - 如存在**付费章节**需**登录并提前购买**，部分网站不能正常阅读，下载也可能会失败
  - '序号.txt' 文件记录下载错误和请求超时图片
  - **刷新页面** 任务会终止
  - 如更新脚本后脚本运行出错(新版本存储数据格式可能有不同)，请尝试脚本中初始化设置数据
  - 如压缩下载有较多油猴弹窗提示跨域,建议直接下载
<br /><br />


## 自定义添加规则
- JOSN 字段说明 (未加入搜索字段)

```js
[
  {
    domain，String || Array,  域名,
    homepage，String, 网站主页,
    webName，String, 网站名,
    comicNameCss，String, 漫画名的CSS选择器,
    chapterCss，String, 含有所有章节链接的dom的CSS选择器,
    readtype， Number, 值:1 -卷轴阅读或SPA网页, 值:0 -翻页阅读 (指不能一次性获取到某章节所有图片地址),
    useFrame, Boolean, 当 该 key存在 且 value为 true, 使用 隐藏的 iframe 窗口获取章节内容
    webDesc, String,  一些网站备注或提醒信息

    getImgs，String,  字符内容为获取章节图片的函数,
      // ———————— 1 —————————— 卷轴阅读或SPA网页
      * 1、(readtype == 1) 
      * @param {String} (context)  
        * context 某一章节链接的请求正文
      * @return {Array} imgArray
          * 要求返回imgArray 数组 包含该章节所有图片地址
          * 例如 return ['http://xx.xx.xx/1.jpg','http://xx.xx.xx/2.jpg']
          
  

      // ———————— 2 —————————— 翻页阅读
      * 2、(readtype == 0) 
      * @param {String, Object} (context, processData)
        * context 章节某一页链接的请求正文
        * processData 进程反馈数据及自定义保存的数据
      * @return {Object} 
          * 要求返回 { *imgUrlArr, *nextPageUrl, *imgCount, otherData }
          * imgUrlArr -当前页的所有图片地址, 如果本页 imgUrlArr.length == 0 结束下载, 否则请求下一页地址
          * nextPageUrl -下一页地址,如果 nextPageUrl == '' ，获取完 imgUrlArr 后结束下载
          * imgCount -章节图片总数量
          * otherData -(可选值)结束当前页请求后自定义保存需要的数据，请求下一页数据时 processData.otherData可获取到,首页请求时 otherData 未定义
          * 参考 
            * return  { 
              imgUrlArr: ['http://xx.xx.xx/3.jpg','http://xx.xx.xx/4.jpg']
              nextPageUrl: 'http://xx.xx.xx/xxx/3.html'
              imgCount: 12,
              otherData: {
                currentPage: 2,
                sign: 'FSFRGGFDBFRHHEYSDGHNTRRSSGS',
                ……
              }
            }



      // ———————— 3 ——————————   使用 iframe 窗口获取章节内容
      * 3、(readtype == 1 且 useFrame == true) 
      * @param {String, Object} (context, processData)
        * context 章节某一页链接的请求正文
        * processData 进程反馈数据及自定义保存的数据
      // 参考下面规则 JOSN 2
  }
]
```


- 导入规则 JOSN参考

  1、  **readtype == 1**

```
[
  {
    domain: 'xx.xx.com',
    homepage: 'https://xx.xx.com/',
    webName: 'xxx',
    comicNameCss: '.oddtitle_m .title_text h1',
    chapterCss: '.online_border',
    readtype: 1,
    getImgs: `function(context) {
      // 函数写在字符里面， 注意正则内容转义
      const imgStr = context.match(/xx正则xx/g)
      const imgs = eval(imgStr)
      return imgs
    }`
  },{……},{……},{……}
]
```
<br />

  2、  **useFrame == true 且 readtype == 1** <br />
  **使用 iframe 打开章节网页后获取内容 （iframe是隐藏的)**  

```
[
  {
    domain: 'xx.xx.com',
    homepage: 'https://xx.xx.com/',
    webName: 'xxx',
    comicNameCss: '.oddtitle_m .title_text h1',
    chapterCss: '.online_border',
    useFrame: true,
    readtype: 1,
    getImgs: `async function(context, processData) {
      // processData.frameId 是脚本打开某一章节网页 iframe 的 id
      const iframeWindow = document.getElementById(processData.frameId).contentWindow
      const iframeDom = document.getElementById(processData.frameId).contentDocument


      // iframeWindow 的变量和函数方法 （或许会用到）
      // const xx = iframeWindow.xx
      // const xxfun = iframeWindow.xxfun()

      const image = [...iframeDom.querySelectorAll('.xx img')].map(img => img.dataset.src ?? img.src)

      // 最后关闭打开的 iframe 并返回图片数组
      document.getElementById(processData.frameId).remove()
      return image
    }`
  }
]
```
<br />



## v2.0 更新记录
  - 2025/6/1 *v2.0.8* 
    - 修正包子漫画域名
    - 替换全局样式为LESS格式，移除SCSS相关依赖 (by Raven-tu)
    - 更新R如漫画、拷贝漫画的新域名匹配
  - 2024/12/25 *v2.0.7* 
    - 修改下载失效的GoDa、来漫画、百漫谷网站
    - 新增风车漫画匹配、修改拷贝漫画章节chapterCss
    - 修改md文件
  - 2024/10/24 *v2.0.6* 
    - 新匹配再漫画网站
  - 2024/10/01 *v2.0.5* 
    - 完善部分 md 文档
    - 重新匹配动漫之家手机版网页
  - 2024/10/01 *v2.0.4* 
    - 新增匹配来漫画、R如漫画网站
  - 2024/9/30 *v2.0.3* 
    - 修改GoDa网站新域名匹配方法
    - 修复下载错误时可能出现进度条不变bug
  - 2024/8/10 *v2.0.2* 
    - 新增匹配yymanhua、xmanhua
    - 修改动漫狂网站获取图片方法
  - 2024/8/3 *v2.0.1* 
    - 修改动漫之家网站获取章节图片方法
  - 2024/7/12 *v2.0.0* 
    - frame滚动获取图片整理（三年了 φ(゜▽゜*)♪


<br />


## 感谢
  - [Tampermonkey-Vue](https://github.com/huangxubo23/tampermonkey-vue)
  - [用JS实现多个任务并行执行的队列](https://juejin.cn/post/6844903961728647181)

