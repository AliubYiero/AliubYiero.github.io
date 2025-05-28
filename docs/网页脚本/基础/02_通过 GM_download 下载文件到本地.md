# 通过 GM_download 下载文件到本地

在上一篇我们讲到了通过原生 JavaScript 下载文件, 但功能有限:

-  无法监听下载中事件/下载完成事件
- 无法实现文件另存为
- 无法主动取消下载事件

**网页脚本** 中给我们提供了一个 API - `GM_download()` 可以帮助我们拓展下载的功能. 

> 文件另存为功能可以通过 [`window.showSaveFilePicker()`](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/showSaveFilePicker) 方法实现, 但是实现起来相对麻烦, 并且不兼容 Firefox, 不在本文的讲述范围内. 

## 参数

### 基础形式参数

首先我们介绍基础的使用方法: 

```js
// 基础形式
GM_download( url, name )
```

`GM_download( url, name )` 接受两个参数: 

- `url`: 文本链接. 可以是图片链接, 视频链接或者 blob 临时链接. 
- `name`: 带扩展名的文件名. 

> 通过 `GM_download()` 下载文件, 就不需要考虑跨域导致的无法下载的问题了, 所以下载二进制文件直接将链接传进参数中即可. 

**示例**

```js
GM_download("https://baidu.com", "baidu.html");
```



### 配置对象参数

除了基础形式, `GM_download` 还支持传入一个配置对象参数, 该配置对象参数提供了更丰富的功能: 

```js
// 配置对象
GM_download(details)
```

`details` 对象可包含以下属性：

| 属性             | 类型       | 描述                                                         |
| :--------------- | :--------- | :----------------------------------------------------------- |
| `url`            | `String`   | **必需**。下载目标资源（URL 或二进制对象）                   |
| `name`           | `String`   | **必需**。带扩展名的文件名（需在 Tampermonkey 白名单中）     |
| `headers`        | `Object`   | 包含 HTTP 请求头的对象（参考 `GM_xmlhttpRequest`）           |
| `saveAs`         | `Boolean`  | 是否显示"另存为"对话框（仅 browser API 模式有效）            |
| `conflictAction` | `String`   | 文件名冲突时的处理策略（仅 browser API 模式有效） <br />可选值：`uniquify`（自动重命名）、`overwrite`（覆盖）、`prompt`（询问用户） |
| `onload`         | `Function` | 下载成功时触发的回调函数                                     |
| `onerror`        | `Function` | 下载失败时触发的回调函数，参数为包含以下属性的对象： <br />- `error`：错误原因（`not_enabled`，`not_whitelisted`，`not_permitted`，`not_supported`，`not_succeeded`）<br /> - `details`：错误详细信息 |
| `onprogress`     | `Function` | 下载进度变化的回调函数                                       |
| `ontimeout`      | `Function` | 下载超时时触发的回调函数                                     |

**示例**

```js
// 使用配置对象下载（显示另存为对话框）
const download = GM_download({
  url: "https://baidu.com",
  name: "baidu.html",
  saveAs: true,
  onload: () => console.log("下载完成"),
  onerror: (err) => console.error("下载失败:", err.error)
});

// 5秒后取消下载
setTimeout(() => download.abort(), 5000);
```



## 返回值

返回包含以下属性的对象：

- `abort()`：取消下载的方法



## 运行模式

通过 `GM_info.downloadMode` 可获取当前下载模式：

- `native`：浏览器原生下载
- `browser`：浏览器 API 模式
- `disabled`：下载功能被禁用



## 示例

### 下载二进制文件(链接)

```js
// @grant        GM_download
```

```js
/**
 * 通过链接下载文件到本地
 *
 * @param {string} url 文件链接
 * @param {string} filename 文件名
 */
const downloadLink = ( url, filename ) => {
   GM_download({
        url: url,
        name: filename,
   })
};
```



### 下载文本文件

```js
// @grant        GM_download
```

```js
/**
 * 下载文本到本地
 * 
 * @param {text} text 文本内容
 * @param {string} filename 文件名
 * @param {string} mimeType 文件类型
 */
const downloadText = (
    text,
    filename,
    mimeType = 'text/plain',
) => {
    // 创建 blob
    const blob = new Blob( [ text ], { type: mimeType } );
    // 创建 blob url
    const blobUrl = URL.createObjectURL( blob );
    // 通过 blob url 下载文件到本地
    GM_download( {
        url: blobUrl,
        name: filename,
        onload() {
            // 释放 blob
            URL.revokeObjectURL( blobUrl )
        }
    } );
};
```



### 文件另存为

> 即将配置对象参数中的 `saveAs` 属性设置为 `true`, 就会主动打开文件保存选择框让用户选择文件保存的地址. 

```js
// @grant        GM_download
```

```js
/**
 * 通过链接下载文件到本地指定路径
 *
 * @param {string} url 文件链接
 * @param {string} filename 文件名
 */
const downloadLinkSaveAs = ( url, filename ) => {
    GM_download({
        url: url,
        name: filename,
        saveAs: true
    })
};
```

```js
/**
 * 下载文本到本地指定路径
 *
 * @param {text} text 文本内容
 * @param {string} filename 文件名
 * @param {string} mimeType 文件类型
 */
const downloadTextSaveAs = (
    text,
    filename,
    mimeType = 'text/plain',
) => {
    // 创建 blob
    const blob = new Blob( [ text ], { type: mimeType } );
    // 创建 blob url
    const blobUrl = URL.createObjectURL( blob );
    // 通过 blob url 下载文件到本地
    GM_download( {
        url: blobUrl,
        name: filename,
        saveAs: true,
        onload() {
            // 释放 blob
            URL.revokeObjectURL( blobUrl )
        }
    } );
};
```



### 文件下载完成后发送通知

> 在 `onload` 属性中设置回调, 以下载链接举例

```js
// @grant        GM_download
// @grant        GM_notification
```

```js
/**
 * 通过链接下载文件到本地
 *
 * @param {string} url 文件链接
 * @param {string} filename 文件名
 */
const downloadLink = ( url, filename ) => {
    GM_download({
        url: url,
        name: filename,
        onload() {
            GM_notification({
                title: '下载完成', 
                text: `${filename} 下载完成`
            })
        }
    })
};
```



### 使用 Promise 封装

```js
/**
 * 下载文件
 *
 * @param {string} url 下载地址
 * @param {string} filename 文件名
 * @param {object} details GM_download details 配置对象参数
 */
const gmDownload = (
    url,
    filename,
    details = {},
) => {
    return new Promise( ( resolve, reject ) => {
        const abortHandle = GM_download( {
            url: url,
            name: filename,
            ...details,
            onload() {
                details.onload && details.onload();
                resolve( true );
            },
            onerror( err ) {
                details.onerror && details.onerror( err );
                reject( err.error );
            },
            ontimeout() {
                details.ontimeout && details.ontimeout();
                reject( '下载超时' );
            },
            onprogress( response ) {
                details.onprogress && details.onprogress( response, abortHandle );
            },
        } );
    } );
};
```





## 一些注意事项

### TamperMonkey 下载白名单

如果用户使用的网页脚本管理器是 `TamperMonkey` , `GM_download()` 默认是无法下载所有文件的. 因为 `TamperMonkey` 中存在一个下载白名单, 只有在该白名单中的文件格式, 才允许下载到用户的电脑中. 该下载白名单中仅包含常见的一些文件格式. 

如果用户使用的网页脚本管理器是 `ScriptCat / 脚本猫` , 则无该限制. 

### **修改 TamperMonkey 下载白名单**

1. *[点击 **TamperMonkey** 图标 -> **控制面板** -> **设置**]*
2. 在 **通用** 分组中, 将 **配置模式** 修改为 **"初学者"** / **"高级"**
3. 滚动到页面底部, 找到 **下载 BETA** 分组, 修改 **文件扩展名白名单** 即可. 
4. 每一行是单独的规则, 可以使用**普通匹配**和**正则匹配**. 

![image-20250528181015737](./iamges_02_%E9%80%9A%E8%BF%87%20GM_download%20%E4%B8%8B%E8%BD%BD%E6%96%87%E4%BB%B6%E5%88%B0%E6%9C%AC%E5%9C%B0/image-20250528181015737.png)

