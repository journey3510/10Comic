# 10图漫
  使用 Vue + Vant 开发的油猴插件脚本（Tampermonkey）

  基于浏览器油猴插件的使用，任意网页提供部分漫画网站搜索；漫画分章节多队列并行下载(可直接下载/压缩下载/拼接下载)，可用于动漫之家、极速漫画、腾讯漫画、哔哩哔哩等30+网站；对个别漫画网站修改阅读样式；可按需编写定义规则JSON导入以支持其他漫画网站

  [![github](https://img.shields.io/badge/journey3510-10Comic_-blue?style=flat&logo=github)](https://github.com/journey3510/10Comic)
[![github](https://img.shields.io/github/commit-activity/y/journey3510/10Comic?logo=github)](https://github.com/journey3510/10Comic)
[![10Comic](https://img.shields.io/badge/GreasyFork-10Comic_-blue?style=flat&logo=data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH3ggEBCQHM3fXsAAAAVdJREFUOMudkz2qwkAUhc/goBaGJBgUtBCZyj0ILkpwAW7Bws4yO3AHLiCtEFD8KVREkoiFxZzX5A2KGfN4F04zMN+ce+5c4LMUgDmANYBnrnV+plBSi+FwyHq9TgA2LQpvCiEiABwMBtzv95RSfoNEHy8DYBzHrNVqVEr9BWKcqNFoxF6vx3a7zc1mYyC73a4MogBg7vs+z+czO50OW60Wt9stK5UKp9Mpj8cjq9WqDTBHnjAdxzGQZrPJw+HA31oulzbAWgLoA0CWZVBKIY5jzGYzdLtdE9DlcrFNrY98zobqOA6TJKHW2jg4nU5sNBpFDp6mhVe5rsvVasUwDHm9Xqm15u12o+/7Hy0gD8KatOd5vN/v1FozTVN6nkchxFuI6hsAAIMg4OPxMJCXdtTbR7JJCMEgCJhlGUlyPB4XfumozInrupxMJpRSRtZlKoNYl+m/6/wDuWAjtPfsQuwAAAAASUVORK5CYII=)](https://greasyfork.org/zh-CN/scripts/447819)
<br /><br />

## 脚本使用
- 安装Tampermonkey插件
  请在浏览器安装[Tampermonkey](https://tampermonkey.net/)插件

- 安装脚本
  安装地址：[10图漫](https://greasyfork.org/zh-CN/scripts/447819)

- 使用时可通过 快捷键 **Alt + V** 唤起界面
- 更多使用说明见 [tampermonkey.md](https://github.com/journey3510/10Comic/blob/master/tampermonkey.md) 或 [greasyfork-10图漫](https://greasyfork.org/zh-CN/scripts/447819) 
<br /><br />


## 脚本开发
```
npm install 
```
安装的模块及依赖

<br />
### 简单运行

```
npm run dev
```
不依赖于油猴使用，可用于脚本页面样式和一些简单的页面交互编写
<br /><br />

### * 脚本调试\/开发
```
npm run test
```
1、安装Tampermonkey插件

2、Tampermonkey插件鼠标右键-管理扩展程序-允许访问文件网址（勾选）

3、在Tampermonkey中，点击插件选择`添加新脚本`，然后复制粘贴当前项目下`testTemplate.js`的模板测试代码，并修改模板中"项目保存目录",`Ctrl+S`保存后并启用该脚本，就可用于测试刷新浏览器即可预览效果。
<br /><br />


### 打包使用
```
npm run build
```
可以在`.env`进行生产环境的配置，插件的版本号使用的是`package.json`的`version`版本号

打包完成后，在`dist`目录下会生成`10comic.js`文件，再油猴新建脚本，把文件内容复制进行替换全部即可
<br /><br />



### Tampermonkey配置
可以在`tampermonkey.js`文件，配置Tampermonkey选项。
<br /><br />


### 漫画网站列表
| **网站** | **网站首页**                      |
|-------------|-----------------------------------|
| 动漫之家        | https://manhua.idmzj.com/        |
| 动漫之家(访客)    | https://comic.idmzj.com/       |
| Mangabz     | https://mangabz.com/       |
| 极速漫画        | https://www.1kkk.com/           |
| 动漫屋         | https://www.dm5.com/            |
| GoDa         | https://cn.godamanga.art/        |
| 咚漫          | https://www.dongmanmanhua.cn/   |
| naver          | https://comic.naver.com/   |
| webtoon          | https://www.webtoons.com/   |
| 腾讯漫画        | https://ac.qq.com/              |
| 哔哩哔哩        | https://manga.bilibili.com/     |
| 哔哩哔哩漫画国际版   | https://www.bilibilicomics.com/ |
| Komiic漫画        | https://komiic.com/     |
| 百漫谷    | https://www.darpou.com/         |
| 七夕漫画        | http://www.qiximh2.com/               |
| 漫画柜       | https://www.manhuagui.com/        | 
| 36漫画网       | https://www.36manga.com/        |
| 古风漫画网       | https://www.gufengmh.com/   |
| 动漫戏说        | https://comic.acgn.cc/          |
| 新新漫画        | https://www.77mh.xyz/           |
| 仙漫网        | https://www.gaonaojin.com/           |
| 漫画星球        | http://www.mhxqiu4.com/         |
| 漫画屋         | https://www.mhua5.com/          |
| 动漫狂         | https://www.cartoonmad.com          |
| 最漫画         | https://www.zuimh.com/          |
| 六漫画         | http://www.6mh1.com/          |
| 漫画芯         | https://www.mhxin.com/          |
| 包子漫画        | https://cn.baozimh.com/         |
| 爱国漫         | https://www.guoman.net/       |
| 最次元         | https://zcymh.com/       |
| 快看漫画        | https://www.kuaikanmanhua.com/  |
| 好漫8         | https://www.haoman8.com/        |

<br /><br />

## 声明
  **本项目及其产生的内容数据仅限用于个人学习使用，不可将其用于任何非法用途，产生后果与作者无关**

<br />

## 感谢
  - [Tampermonkey-Vue](https://github.com/huangxubo23/tampermonkey-vue)
  - [用JS实现多个任务并行执行的队列](https://juejin.cn/post/6844903961728647181)