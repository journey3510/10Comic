# Tampermonkey-Vue
使用 Vue + Element-UI 开发油猴插件（Tampermonkey）。

## 安装Tampermonkey插件
请在浏览器安装[Tampermonkey](https://tampermonkey.net/)插件。



## 配置项

### 本地开发
- 建议用于页面样式编写
```
npm run dev
```

可以在`.env.dev`进行开发环境的配置
``` js
// 插件运行环境
TAMPERMONKEY_APP_ENVIRONMENT=development
// 插件名称
TAMPERMONKEY_APP_NAME=TamperMonkey-Vue-Dev
// 插件打包生成的文件，Tampermonkey插件的入口文件，注意格式应该为：*.user.js
TAMPERMONKEY_ENTRY_FILE=tampermonkey-vue.user.js
```

- 用于脚本调试

在Tampermonkey中，点击插件选择`添加新脚本`，然后复制粘贴当前项目下`testTemplate.js`的模板测试代码，并修改模板中`Ctrl+S`保存后并启用该脚本，就可用于测试刷新浏览器即可预览效果。

```
npm run test
```

可以在`.env.dev`进行开发环境的配置
``` js
// 插件运行环境
TAMPERMONKEY_APP_ENVIRONMENT=development
// 插件名称
TAMPERMONKEY_APP_NAME=TamperMonkey-Vue-Dev
// 插件打包生成的文件，Tampermonkey插件的入口文件，注意格式应该为：*.user.js
TAMPERMONKEY_ENTRY_FILE=tampermonkey-vue.user.js

```

### 打包发布
```
1. npm run build
```

可以在`.env`进行生产环境的配置，插件的版本号使用的是`package.json`的`version`版本号。
```js
// 插件运行环境
TAMPERMONKEY_APP_ENVIRONMENT=production
// 插件名称
TAMPERMONKEY_APP_NAME=TamperMonkey-Vue
// 插件打包生成的文件，Tampermonkey插件的入口文件，注意格式应该为：*.user.js
TAMPERMONKEY_ENTRY_FILE=tampermonkey-vue.user.js
```

打包完成后，在`dist`目录下会生成`tampermonkey-vue.user.js`文件，把该文件添加到Tampermonkey即可运行。

### Tampermonkey配置
可以在`tampermonkey.js`文件，配置Tampermonkey选项。


### 打包发布
```
1. npm run build
```

可以在`.env`进行生产环境的配置，插件的版本号使用的是`package.json`的`version`版本号。
```js
// 插件运行环境
TAMPERMONKEY_APP_ENVIRONMENT=production
// 插件名称
TAMPERMONKEY_APP_NAME=TamperMonkey-Vue
// 插件打包生成的文件，Tampermonkey插件的入口文件，注意格式应该为：*.user.js
TAMPERMONKEY_ENTRY_FILE=tampermonkey-vue.user.js
```

打包完成后，在`dist`目录下会生成`tampermonkey-vue.user.js`文件，把该文件添加到Tampermonkey即可运行。

### Tampermonkey配置
可以在`tampermonkey.js`文件，配置Tampermonkey选项。



### 感谢
  - [Tampermonkey-Vue](https://github.com/huangxubo23/tampermonkey-vue)
  - [用JS实现多个任务并行执行的队列](https://juejin.cn/post/6844903961728647181)