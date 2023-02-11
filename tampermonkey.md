## 功能
- 默认 **隐藏在网页右侧**，点击按钮可切换显示/隐藏，含（主页，加载，下载，设置）四个标签栏，点击切换显示各自内容
- 主页
  - 显示脚本目前适用的漫画网站和导入规则网站，点击可 *跳转* 至网站
- 加载页
  - 在适用的漫画网站某一 **漫画目录页** 下，点击加载获取当前网页漫画章节
  - 可**全选\全取消\多选\区间选择(按shift)章节**，选择后点击下载按钮，开始下载
  - 点击分割线 **重载列表** 文字，重新加载章节
  - 自动增加章节序号(可选)
- 下载页
  - 含（下载中、待下载、已下载）三个列表项，显示下载的章节名称。
  - "下载中"列表项显示章节下载进度
  - **压缩下载**， 保存压缩章节漫画文件: **漫画名(文件夹)\章节链接名称.zip** (含文件夹需要设置油猴 [浏览器 API](#browserapi), 否则保存为 *漫画名_章节链接名称.zip*) <br />
    **直接下载**，保存图片文件: **漫画名(文件夹)\章节链接名称(文件夹)\图片序号.jpg** (含文件夹同需要设置油猴 [浏览器 API](#browserapi), 否则保存为 *漫画名_章节链接名称_图片序号.jpg*)
  - 显示下载记录,可删除指定下载记录,点击漫画名 *跳转* 该漫画目录页
- 设置页
  - app加载选项(初始是否加载界面,设置加载界面快捷键-(默认Alt + V),设置窗口加载比例缩放)
  - 设置最多可同时下载章节数量
  - 设置每章最大下载图片数
  - 选择下载方式（压缩下载/直接下载）
  - 图片数字命名指定最少位数(图片序号小于指定位数则向前补充0命名)
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
  从 **1.4.0** 版本起脚本更改为任意网页运行，脚本默认不加载界面，可通过快捷键 **Alt + V** 加载界面，或点击浏览器油猴扩展图标点击本脚本中的-加载UI
  当然也可以在脚本设置中恢复默认加载界面（不建议，脚本使用 Vant 组件库, 可能影响原网站样式，如会改变网站的字体大小等
<br /><br />

## 操作指北
 - <sapn id='browserapi'> 油猴-浏览器API
    - 油猴 - 设置 - 通用 - 配置模式 - 选高级
    - 设置 - 下载 BETA - 下载模式 - 选浏览器API
<br /><br />


## 漫画网站列表
| **网站** | **网站首页**                      |
|-------------|-----------------------------------|
| 动漫之家        | https://manhua.dmzj.com/        |
| 动漫之家2       | https://www.dmzj.com/           |
| Mangabz     | http://www.mangabz.com/         |
| 极速漫画        | https://www.1kkk.com/           |
| 动漫屋         | https://www.dm5.com/            |
| 奇漫屋         | http://www.qiman58.com/         |
| 咚漫          | https://www.dongmanmanhua.cn/   |
| webtoon          | https://www.webtoons.com/   |
| 腾讯漫画        | https://ac.qq.com/              |
| 酷漫屋         | http://www.kumw6.com/           |
| 哔哩哔哩        | https://manga.bilibili.com/     |
| 哔哩哔哩漫画国际版   | https://www.bilibilicomics.com/ |
| 百漫谷(简)    | https://www.darpou.com/         |
| 百漫谷(繁)    | https://darpou.com/              |
| 武侠漫画（手机）    | https://m.wuxiamh.com/          |
| 武侠漫画网（电脑）   | https://www.wuxiamh.com/        |
| 七夕漫画        | http://qiximh3.com/              |
| 36漫画网       | https://www.36manga.com/        |
| 古风漫画网       | https://www.gufengmanhua.com/   |
| 古风漫画网 2     | https://www.123gf.com/          |
| 滴滴漫画        | http://www.txydd.com/           |
| 动漫戏说        | https://comic.acgn.cc/          |
| 新新漫画        | https://www.77mh.xyz/           |
| 漫画星球        | http://www.mhxqiu2.com/         |
| 漫画屋         | https://www.mhua5.com/          |
| 27漫画网       | https://www.2mzx.com/           |
| 最漫画         | https://www.zuimh.com/          |
| 六漫画         | http://www.sixmh7.com/          |
| 漫画芯         | https://www.mhxin.com/          |
| 包子漫画        | https://cn.baozimh.com/         |
| 爱国漫         | https://www.aiguoman.com/       |
| 快看漫画        | https://www.kuaikanmanhua.com/  |
| 好看的漫画网      | https://www.cnanjie.com/        |
| 漫画猫         | https://www.maofly.com/         |
| 好漫8         | https://www.haoman8.com/        |

<br />

## <font color="#dd0000">* 声明/注意</font>
  - **该脚本及其产生的内容数据仅限用于个人学习，不要将其用于任何非法使用，后果与作者无关**
  - 请合理使用线程
  - 如存在**付费章节**需**登录并提前购买**，部分网站不能正常阅读，下载也可能会失败
  - 文件后缀名为 **.xx** 表示 *下载该图片失败*
  - 网站可能会更换域名而导致脚本失效
  - **刷新页面** 任务会终止
  - 如更新脚本后脚本运行出错(新版本存储数据格式可能有不同)，请尝试脚本中初始化设置数据
  - 如压缩下载有较多油猴弹窗提示跨域,建议直接下载
<br /><br />


## 自定义添加规则（可适用于部分静态网页）
- JOSN 字段说明 (未加入搜索字段)

```js
[
  {
    domain，String,  域名,
    homepage，String, 网站主页,
    webName，String, 网站名,
    comicNameCss，String, 漫画名的CSS选择器,
    chapterCss，String, 含有所有章节链接的dom的CSS选择器,
    readtype， Number, 值:1 -卷轴阅读或SPA网页, 值:0 -翻页阅读 (指不能一次性获取到某章节所有图片地址),
    webDesc, String,  一些网站备注或提醒信息

    getImgs，String,  字符内容为获取章节图片的函数,
      * 1、(readtype == 1) - 卷轴阅读或SPA网页
      * @param {String} (context)  
        * context 某一章节链接的请求正文
      * @return {Array} imgArray
          * 要求返回imgArray 数组 包含该章节所有图片地址
          * 例如 return ['http://xx.xx.xx/1.jpg','http://xx.xx.xx/2.jpg']
          
      * 2、(readtype == 0) - 翻页阅读
      * @param {String, Object} (context, processData)
        * context 章节某一页链接的请求正文
        * processData 进程反馈数据及自定义保存的数据,首页请求时 processData 未定义
      * @return {Object} 
          * 要求返回 { *imgUrlArr, *nextPageUrl, *imgCount, otherData }
          * imgUrlArr -当前页的所有图片地址, 如果本页 imgUrlArr.length == 0 结束下载, 否则请求下一页地址
          * nextPageUrl -下一页地址, nextPageUrl == '' 可以结束下载
          * imgCount -章节图片总数量
          * otherData -(可选值)结束当前页请求后自定义保存需要的数据，请求下一页数据时 processData.otherData可获取到
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
  }
]
```


- 导入规则 JOSN举例

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


## v1.5 更新记录
  - 2023/2/11 *v1.5.1* 
    - 新增 webtoons 网站
    - 获取漫画章节列表可选正则来匹配章节名称
  - 2023/2/10 *v1.5.0* 
    - 修改README与配置文件
    - 脚本开源-[GitHub](https://github.com/journey3510/10Comic)

<br />


## 感谢
  - [Tampermonkey-Vue](https://github.com/huangxubo23/tampermonkey-vue)
  - [用JS实现多个任务并行执行的队列](https://juejin.cn/post/6844903961728647181)

