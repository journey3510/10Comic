## 漫画 搜索|下载

### 功能
- 默认 **隐藏在网页右侧**，点击按钮可切换显示/隐藏，含（主页，加载，下载，设置）四个标签栏，点击切换显示各自内容
- 主页
  - 显示脚本目前适用的漫画网站和导入规则网站，点击可 *跳转* 至网站
- 加载页
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

### 操作指北
 - <sapn id='browserapi'> 油猴-浏览器API
    - 油猴 - 设置 - 通用 - 配置模式 - 选高级
    - 设置 - 下载 BETA - 下载模式 - 选浏览器API

### <font color="#dd0000">* 声明/注意</font>
  - 该脚本及其产生的内容数据仅限用于个人学习，不可用于其他用途，否则后果自负
  - 请合理使用线程
  - 如存在**付费章节**需**登录并提前购买**，部分网站不能正常阅读，下载也可能会失败
  - 文件后缀名为 **.xx** 表示 *下载该图片失败*
  - 网站可能会更换域名而导致脚本失效
  - **刷新页面** 任务会终止
  - 如更新脚本后脚本运行出错(新版本存储数据格式可能有不同)，请尝试脚本中初始化设置数据
  - 如压缩下载有较多油猴弹窗提示跨域,建议直接下载

### 自定义添加规则（适用于部分静态网页）
- JOSN 字段说明 (未加入搜索字段)

```js
[
  {
    domain，String,  域名,
    homepage，String, 网站主页,
    webName，String, 网站名,
    comicNameCss，String, 漫画名的CSS选择器,
    chapterCss，String, 含有所有章节链接的dom的CSS选择器,
    readtype， Number, 值:1 -卷轴阅读或SPA网页, 值:0 -翻页阅读 (指不能一次性获取到某章节所有图片地址)
    iswork， Boolean,  网站是否正常运行
    getImgs，String,  字符内容为获取章节图片的函数,
      * 1
      * @param {String} (context)  
        * context 某一章节链接的请求正文
      * @return {Array} imgArray
          * readtype == 1 时，要求返回imgArray 数组 含章节所有图片地址
          * 例如 return ['http://xx.xx.xx/1.jpg','http://xx.xx.xx/2.jpg']
          
      * 2
      * @param {String, Object} (context, processData)
        * context 章节某一页链接的请求正文
        * processData 进程反馈数据及保存数据,首次不存在
      * @return {Object} 
          * readtype == 0 （翻页） 时，要求返回 { *imgUrlArr, *nextPageUrl, *imgCount, otherData }
          * imgUrlArr -当前页的图片地址, imgUrlArr.length == 0 结束下载, 否则请求下一页地址
          * nextPageUrl -下一页地址, 为 '' 则结束下载, 
          * imgCount -图片总数量
          * otherData -(可选值)结束当前页请求后自定义保存需要的数据，下次在参数processData中可获取到
          * 参考 
            * return  { 
              imgUrlArr: ['http://xx.xx.xx/3.jpg','http://xx.xx.xx/4.jpg']
              nextPageUrl: 'http://xx.xx.xx/xx.html'
              imgCount: 12,
              otherData: {
                currentPage: 5,
                sign: 'FSFRGGFDBFRHHEYSDGHNTRRSSGS',
                …
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

- 最后脚本添加// @match   域名
  - 如    //@match   \*://xx.xx.com/\*


### v1.3 更新记录
  - 2022/11/30 *v1.3.6* 修复部分网站失效域名
  - 2022/10/31 *v1.3.5* 修复动漫之家个别漫画图片链接出现中文而提取错误地址
  - 2022/10/24 *v1.3.4* 修改“翻页阅读方式”的压缩下载可能出现序号错误
  - 2022/10/21 *v1.3.3* 
    - 增加Mangabz、奇漫屋网站，修改“翻页阅读方式”的下载方法，可设置窗口大小缩放
    - 增加对个别网站的单行本/卷的支持，修改反向排序勾选方法
  - 2022/10/16 *v1.3.2* 关闭调试默认显示界面
  - 2022/10/16 *v1.3.1* 支持对B站、腾讯漫画付费章节下载（需登录并提前购买）
  - 2022/10/9 *v1.3.0*  包子漫画换源


### 感谢
  - [Tampermonkey-Vue](https://github.com/huangxubo23/tampermonkey-vue)
  - [用JS实现多个任务并行执行的队列](https://juejin.cn/post/6844903961728647181)

