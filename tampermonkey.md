## 漫画下载

### 功能
- 仿手机页面，默认 **隐藏在网页右侧**，点击按钮可切换显示/隐藏，含（主页，章节，下载，设置）四个标签栏，点击切换显示各自内容
- 主页
  - 显示脚本目前适用的漫画网站和导入规则网站，点击可 *跳转* 至网站
- 章节页
  - 在适用的漫画网站某一 **漫画目录页** 下，点击加载获取当前网页漫画章节
  - 可**全选\全取消\多选\区间选择(按shift)章节**，选择后点击下载按钮，开始下载
  - 点击分割线 **重载列表** 文字，重新加载章节
- 下载页
  - 含（下载中、待下载、已下载）三个列表项，显示下载的章节名称。
  - "下载中"列表项显示章节下载进度
  - **压缩下载**， 保存压缩章节漫画文件: **漫画名(文件夹)\章节链接名称.zip** (含文件夹需要设置油猴 [浏览器 API](#browserapi), 否则保存为 *漫画名_章节链接名称.zip*) <br />
    **直接下载**，保存图片文件: **漫画名(文件夹)\章节链接名称(文件夹)\图片序号.jpg** (含文件夹同需要设置油猴 [浏览器 API](#browserapi), 否则保存为 *漫画名_章节链接名称_图片序号.jpg*)
  - 显示下载记录,可删除指定下载记录,点击漫画名 *跳转* 该漫画目录页
- 设置页
  - app加载选项(初始是否加载界面,设置加载界面快捷键-(默认Alt + V))
  - 设置最多可同时下载章节数量
  - 设置每章最大下载图片数
  - 选择下载方式（压缩下载/直接下载）
  - 图片数字命名指定最少位数(图片序号小于指定位数则向前补充0命名)
  - 对个别漫画网站图片上下拼接(可选)
  - 可**导入、删除其他网站漫画规则**（导入规则见-[自定义添加规则](#自定义添加规则))
  - 可初始化设置中所有数据
- 搜索 (默认隐藏)
  - 对多个网站搜索漫画，可跳转指定漫画网页

### 操作指北
 - <sapn id='browserapi'> 油猴-浏览器API
    - 油猴 - 设置 - 通用 - 配置模式 - 选高级
    - 设置 - 下载 BETA - 下载模式 - 选浏览器API

### <font color="#dd0000">* 声明/注意</font>
  - 该脚本仅用于学习交流，不可用于其他用途，否则后果自负
  - 请合理使用线程
  - 下载 *仅限免费部分* ，部分网站不能正常阅读，下载也可能会失败
  - 文件后缀名为 **.xx** 表示 *下载该图片失败*
  - 网站可能会更换域名而导致脚本失效
  - **刷新页面** 任务会终止
  - 如更新脚本后脚本运行出错(新版本存储数据格式可能有不同)，请尝试脚本中初始化设置数据
  - 如压缩下载有较多油猴弹窗提示跨域,建议直接下载

### 自定义添加规则
- 导入规则JOSN 字段说明 (未加入搜索字段)

```js
[
  {
    domain，String,  域名,
    homepage，String, 网站主页,
    webName，String, 网站名,
    comicNameCss，String, 漫画名的CSS选择器,
    chapterCss，String, 含有所有章节链接的dom的CSS选择器,
    readtype， Number, 值:1 -卷轴阅读或SPA网页, 值:0 -翻页阅读
    iswork， Boolean,  网站是否正常运行
    getImgs，String,  字符内容为获取章节图片的函数,
      * @param {String} context  某一章节链接的请求正文，
      * @return_1 {Array} imgArray
          * readtype == 1 时，要求返回imgArray 数组 含章节所有图片地址
          * 例如  ['http://xx.xx.xx/1.jpg','http://xx.xx.xx/2.jpg']
      * @return_2 {Object} 
          * readtype == 0 时，要求返回{ imgUrl, nextPageUrl, number }
          * {imgUrl-当前页的图片地址,nextPageUrl-下一页地址,number-图片总数量}
          * 例如  { 
              imgUrl: ['http://xx.xx.xx/1.jpg','http://xx.xx.xx/2.jpg']
              nextPageUrl: 'http://xx.xx.xx/xx.html'
              number: 12
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

- 最后脚本添加// @match   域名
  - 如    //@match   \*://xx.xx.com/\*


### v1.2 更新记录
  - 2022/9/18 *v1.2.6*  新增动漫戏说
  - 2022/9/12 *v1.2.5*  搜索减少使用油猴跨域请求,优化搜索提示
  - 2022/9/11 *v1.2.4*  新增爱国漫
  - 2022/9/6 *v1.2.3*  优化搜索界面，新增4个搜索源，封装通过get请求的搜索方法
  - 2022/9/3 *v1.2.2*  修复下载bug
  - 2022/9/3 *v1.2.1*  增加搜索功能，可对多个网站搜索漫画并展示，点击跳转指定漫画网页 （已适配9个网站)
  - 2022/8/30 *v1.2.0*  增加油猴菜单，设置页app加载选项(初始是否加载界面,设置加载界面快捷键)


### 感谢
  - [Tampermonkey-Vue](https://github.com/huangxubo23/tampermonkey-vue)
  - [用JS实现多个任务并行执行的队列](https://juejin.cn/post/6844903961728647181)

