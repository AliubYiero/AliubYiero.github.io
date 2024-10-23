# 优化 NTQQ 的使用体验

## 安装插件 `LiteLoaderQQNT`

进入网站 [liteloaderqqnt.github.io](https://liteloaderqqnt.github.io/) , 该网站挂载在 **github** 上, 包括之后下载的所有插件都挂载在 github 上, 所以请确保你的网络情况可以访问 [github](https://github.com/) . 

> 使用 [steamcommunity302](https://www.dogfight360.com/blog/686/) 在配置里打开 github 反代服务 或者 **科学上网**. 

1. 访问地址 [LiteLoaderQQNT](https://github.com/LiteLoaderQQNT/LiteLoaderQQNT/releases/), 下载最新版的 [LiteLoaderQQNT.zip](https://github.com/LiteLoaderQQNT/LiteLoaderQQNT/releases/download/1.2.2/LiteLoaderQQNT.zip) 文件. 

2. 下载插件 [dbghelp.dll](https://github.com/LiteLoaderQQNT/QQNTFileVerifyPatch/releases), 参阅下面的安装方法: 

> #### dbghelp.dll 食用方式
>
> 前往Releases下载dll劫持版本,按照你安装的QQ是x86还是x64选择dbghelp_x86/x64.dll
> 将下载下来的dll重命名为dbghelp.dll 丢到QQ.exe同目录下重启NTQQ即可食用

3. 修改 QQ 文件: 

> #### 修改文件手动安装
>
> 先找到 **app** 文件夹的路径，修改里面的两个文件: 
>
> - 查看 QQNT 根目录，是否存在 `versions`文件夹
>   - 是，则路径为 `QQNT\versions\版本号\resources\app`
>   - 否，则路径为 `QQNT\resources\app`
>
> 
>
> - 创建 `app/app_launcher/hook.js` 文件, 并写入以下内容, `*` 的内容为 *LiteLoaderQQNT* 的路径: 
>   (在 `app` 目录下的 `app_launcher`目录新建一个文件, 命名为 `hook.js`). 
>
>   ```js
>   require(String.raw`*`)
>   ```
>
>   比如 *LiteLoaderQQNT* 的路径是, `E:\LiteLoaderQQNT` , 写入以下内容: 
>
>   ```js
>   require(String.raw`E:\LiteLoaderQQNT`)
>   ```
>
>   
>
> - 修改 `app/package.json` 文件，将 `main` 后面的路径改为 `./app_launcher/hook.js`. 
>
>   > 内容可能因为 NTQQ 版本的有所不同, 只需要关注 `main` 一行即可 (下文的 16 行), 修改 `main` 行后面的内容为 `./app_launcher/hook.js` . 注意不要将双引号删了. 
>
>   ```js
>   {
>     "name": "qq-chat",
>     "version": "9.9.15-28131",
>     "private": true,
>     "description": "QQ",
>     "productName": "QQ",
>     "author": {
>       "name": "Tencent",
>       "email": "QQ-Team@tencent.com"
>     },
>     "homepage": "https://im.qq.com",
>     "sideEffects": true,
>     "bin": {
>       "qd": "externals/devtools/cli/index.js"
>     },
>     "main": "./app_launcher/hook.js",
>     "buildVersion": "28131",
>     "isPureShell": true,
>     "isByteCodeShell": true,
>     "platform": "win32",
>     "eleArch": "x64"
>   }
>   ```

4. 如果安装成功(需先重启一次 NTQQ), 打开设置页在左边会出现选项 **LiteLoaderQQNT **. 

### 安装插件管理工具

安装 **插件下载** 工具 [插件列表查看](https://github.com/ltxhhz/LL-plugin-list-viewer). 

> 1. 进入 [releases](https://github.com/ltxhhz/LL-plugin-list-viewer/releases) 页面, 下载 [list-viewer.zip](https://github.com/ltxhhz/LL-plugin-list-viewer/releases/download/v1.4.2/list-viewer.zip) 文件. 
>
> 2. 打开 NTQQ 的设置页, 打开 LiteLoaderQQNT 选项, 右边有一个**安装新插件**的按钮, 点击并选择刚才下载的 **list-viewer.zip** 文件. 
> 3. 重启 NTQQ .

![image-20241003213920659](./iamges_01_%E4%BC%98%E5%8C%96%20NTQQ%20%E7%9A%84%E4%BD%BF%E7%94%A8%E4%BD%93%E9%AA%8C/image-20241003213920659.png)

### 通过插件管理工具安装其他插件

安装完插件管理工具后, 可以在设置页查看以下内容, 选择需要的功能安装即可. 

![image-20241003214039492](./iamges_01_%E4%BC%98%E5%8C%96%20NTQQ%20%E7%9A%84%E4%BD%BF%E7%94%A8%E4%BD%93%E9%AA%8C/image-20241003214039492.png)

## 推荐插件

- **轻量工具箱**: 防撤回, 清除无用状态栏, 简化消息, 自定义背景......
- **本地查看图片和视频**
- **彻底禁用更新**
- **使用自定义浏览器打开链接并跳过拦截页**
- **快速移除会话**
- **快速切换聊天窗口**
- **插件检测更新API**: 某些脚本的依赖, 普通用户没用. 
- **QQNT怀旧模式**: 用惯旧版QQ的可以试试. 