# console importer - 通过控制台引入js库

> 下载: [Chrome插件商店 - Console Importer](https://chrome.google.com/webstore/detail/console-importer/hgajpakhafplebkdljleajgbpdmplhie)
>
> 源码和使用文档: [GitHub - Console Importer](https://github.com/pd4d10/console-importer)

## 介绍

介绍一个Chrome插件, **Console Importer**. 

作用: 通过控制台引入各种第三方Js库 / CSS库, 方便对一些简单操作进行调试. 

比如您刚接触一个库, 想要根据文档先试一试这个库中的一些函数的使用, 这时候就可以直接通过这个插件, 打开控制台安装对应库, 直接对应网页文档进行调试. 



> Edge 商店没有对应脚本, Edge 也只能通过 Chrome 商店下载. 

## 使用

```js
/**
 * @param { string } lib cdn链接 或者 库的名称
 * @example $i( 'lodash' )
 * @example $i( 'https://cdn.bootcdn.net/ajax/libs/lodash.js/4.17.21/lodash.min.js' )
 */
$i( lib )
```

打开 Chrome devtools 控制台, 可以使用一个 `$i()` 函数导入 JavaScript 库或者 CSS 库. 



### 导入js库 (通过cdnjs)

```js
// 安装lodash
$i( 'lodash' );

// 安装JQuery
$i( 'jquery' );
```

> 默认在 [cdnjs](https://cdnjs.com/) 上搜索对应库并进行下载, 如果想要更换 cdn 可以直接使用链接进行下载. 



**示例**

```js
$i('lodash');

> [$i]: Searching for lodash, please be patient...
> [$i]: lodash not found, import lodash.js instead.
> [$i]: lodash.js is loading, please be patient...
> [$i]: lodash.js(https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.21/lodash.min.js) is loaded.
```



### 导入js库 (通过URL)

还是一样调用 `$i()` 函数, 不过现在将参数直接换成链接. 



**示例**

```js
$i( 'https://cdn.bootcdn.net/ajax/libs/lodash.js/4.17.21/lodash.min.js' )

> [$i]: https://cdn.bootcdn.net/ajax/libs/lodash.js/4.17.21/lodash.min.js is loading, please be patient...
> [$i]: https://cdn.bootcdn.net/ajax/libs/lodash.js/4.17.21/lodash.min.js is loaded.
```



### 图片示例

![console importer动态示例](./iamges_01_Console%20Importer%20-%20通过控制台引入js库/01.gif)

## 示例 - 以lodash为例

![image-20230916222709367](./iamges_01_Console%20Importer%20-%20通过控制台引入js库/02.png)
