# Console控制台输出

> 本文只作为一个引入(因为写的确实不好), 具体可以查看 [总览] 一节中的MDN参考文档.

## 0\. 总览

| 信息输出函数             | 说明                                                         |
| ------------------------ | ------------------------------------------------------------ |
| console.log()            | 输出简单信息                                                 |
| console.info()           | 输出简单信息 (同 `console.log()` )                           |
| console.warn()           | 输出黄色警告信息                                             |
| console.error()          | 输出红色错误信息                                             |
| console.dir()            | 输出层级关系 (常用于输出Node节点)                            |
| console.table()          | 以表格形式输出信息                                           |
| console.debug()          | 输出debug信息 (默认不显示)                                   |
| **信息清除函数**         | **说明**                                                     |
| console.clear()          | 清除控制台中的所有信息                                       |
| **分组函数**             | **说明**                                                     |
| conosle.group()          | 新建一个信息输出分组, 后面的所有内容都会被归在当前分组中     |
| console.groupCollapsed() | 新建一个信息输出分组, 后面的所有内容都会被归在当前分组中<br>同 `conosle.group()`, 区别在于 `.groupCollapsed()` 方法输出的消息会默认被折叠 |
| console.groupEnd()       | 结束一个信息输出分组                                         |
| **计数函数**             | **说明**                                                     |
| console.count()          | 输出一个计数, 计数次数是已调用当前计数多少次.                |
| console.countReset()     | 重置一个计数                                                 |
| **计时函数**             | **说明**                                                     |
| console.time()           | 开启一个计时器.                                              |
| console.timeLog()        | 输出计时 (不停止计时)                                        |
| conosle.timeEnd()        | 输出计时 (停止计时)                                          |
| **断言函数**             | **说明**                                                     |
| console.assert()         | 如果第一个参数为false, 则输出一个报错信息 (不会中断函数运行) |
| **堆栈跟踪函数**         | **说明**                                                     |
| console.trace()          | 输出 `console.trace()` 被调用时, 函数的调用路径              |

> 参考文档:
>
> * [MDN - Console](https://developer.mozilla.org/zh-CN/docs/Web/API/console)
> * [MDN - 输出文本到控制台](https://developer.mozilla.org/zh-CN/docs/Web/API/console#%E8%BE%93%E5%87%BA%E6%96%87%E6%9C%AC%E5%88%B0%E6%8E%A7%E5%88%B6%E5%8F%B0)

## 1\. 信息输出

### `console.log()`

> 输出简单的信息.
>
> `console.log()` 还有另外一种信息输出方式\, 使用格式化字符输出参数\, 具体可以查看\[第八小节\-格式化字符输出\]\(\#\#8\. 格式化字符输出\)

```js
// @parma { any } content 输出的信息, 为动态参数, 可以是任意类型.
console.log( ...content );
```

**示例**

```js
// 输出一个文本信息
console.log('Hello World.');
// -> Hello World.

// 输出多个文本信息
console.log('Hello ', 'World.');
// -> Hello World.

// 输出对象信息
const array示例 = [1, 2, 3];
console.log('输出的数组: ', array示例);
// -> 输出的数组:  [1,2,3]

// 输出布尔值
console.log(false, 'false');
// -> false 'false'
```

***

### `console.info()`

> 输出简单的信息, 在chromium内核的浏览器和`console.log()`的表现形式一样, 在safari中会前缀图标区别.
>
> 示例见`console.log()#示例`.

```js
// @parma { any } content 输出的信息
console.info( ...content );
```

***

### `console.dir()`

> 输出传入参数的对象信息层级.

```js
// @parma { object } object 需要输出层级关系的对象
console.dir( object );
```

**示例**

```js
const body = document.body;

// 直接使用console.log(document.body)输出, 输出document.body元素
console.log(body);

// 使用console.dir(document.body)输出, 输出document.body的对象结构
console.dir(body);
```

![image-20230906203521083.png](./iamges_02_Console%20%E6%8E%A7%E5%88%B6%E5%8F%B0%E8%BE%93%E5%87%BA/151717cxxzppis4x9hihii-1748700221573-1.png)

***

### `console.table()`

> 将参数以表格形式输出.

```js
// @parma { object | Array<any> } content 需要输出表格的对象或者数组
console.table( content );
```

**示例**

```js
// 输出数组示例
console.table( ['pen', 'pencil'] );

// 输出表格示例
console.table( { a: 'first', b: 'second' } );
```

![image-20230917140906627.png](./iamges_02_Console%20%E6%8E%A7%E5%88%B6%E5%8F%B0%E8%BE%93%E5%87%BA/151707rg8cczkd58u2td83-1748700230086-4.png)

![image-20230917140842342.png](./iamges_02_Console%20%E6%8E%A7%E5%88%B6%E5%8F%B0%E8%BE%93%E5%87%BA/151700rxbqko2hu8hoewhc-1748700232904-7.png)

***

### `console.debug()`

> 输出简单的文本信息, 在chromium内核的浏览器默认不显示, 需要将控制台的日志级别中的**详细**打开.
>
> `console.debug()`和`console.log()`的表现形式一样.
>
> 示例见`console.log()#示例`.

```js
// @parma { any } content 输出的信息
console.debug( ...content );
```

***

### `console.warn()`

> 输出警告信息, 会输出一个警告图标作为前缀, 浅黄色背景的黄色文本.
>
> 用于输出对程序运行没有较大影响的警告消息.
>
> 示例见`console.log()#示例`.

```js
// @parma { any } content 输出的信息
console.warn( ...content );
```

***

### `console.error()`

> 输出报错信息, 会输出一个x图标作为前缀, 浅红色背景的红色文本.
>
> 用于输出对阻碍了程序运行的报错消息.

```js
// @parma { string } content 输出的信息
console.error( content );
```

***

## 2\. 信息清除

### `console.clear()`

> 清空所有的控制台信息.

```js
console.clear();
```

## 3\. 分组输出信息

### `console.group()`

> 将以下的所有信息输出归类当分组中, 直到遇到`console.groupEnd()`, 在当前分组下面的所有信息输出都会以可折叠的形式输出.

```js
// @parma { string } title 分组的标题信息
// console.group() 方法不是开启一个<title>分组, 而是将下面的所有信息输出都归类到以<title>命名的分组下
console.group( title );
```

***

### `console.groupCollapsed()`

> 使用方法和功能和 `console.group()` 一样, 不同之处在于 `console.groupCollapsed()` 输出的分组消息默认是折叠的, `console.group()` 输出的分组信息默认是展开的.

***

### `console.groupEnd()`

> 结束分组信息输出.

```js
// 没有参数, 结束分组输出
// console.groupEnd() 后面的所有信息输出都将正常输出. 
console.groupEnd();
```

***

**示例**

```js
(() => {
    // 开启一个 functionInfo 分组
    console.group('functionInfo');

    console.log('Info1');
    console.log('Info2');
    console.log('Info3');

    // 结束分组输出
    console.groupEnd();
})();
```

![image-20230906205736081.png](./iamges_02_Console%20%E6%8E%A7%E5%88%B6%E5%8F%B0%E8%BE%93%E5%87%BA/151639wjoi3pj1jjv1tp6o-1748700240233-10.png)

## 4\. 计数

### `console.count()`

> 每次调用会输出 `lebel` 的当前计数并输出.
>
> 可以相当于 `console.log(lebel++);` .

```js
// @parma { string } label 计数标识
console.count( label );
```

***

### `console.countReset()`

> 重置 `lebel` 的计数.
>
> 可以相当于 `label = 0;`

```js
// @parma { string } label 计数标识
console.countReset( label );
```

***

**示例**

```js
// 循环十次, 输出十次计数
for (let i = 0; i < 10; i++) {
    console.count('counter');
}
// 重置counter的计数
console.countReset('counter');
// 再次计数counter
console.count('counter');
/* 
--> counter: 1
--> counter: 2
--> counter: 3
--> counter: 4
--> counter: 5
--> counter: 6
--> counter: 7
--> counter: 8
--> counter: 9
--> counter: 10
--> counter: 1
*/
```

## 5\. 记时

### `console.time()`

```js
// 开启一个计数器, 通过<label>作为标识, 可同时打开多个计数器
// @parma { string } label 计时标识
console.time( label );
```

***

### `console.timeLog()`

```js
// 输出一个以<label>作为标识的计数器的实时计数(ms)
// @parma { string } label 计时标识
console.timeLog( label );
```

***

### `console.timeEnd()`

```js
// 结束一个以<label>作为标识的计数器, 并输出从计时开始到计时结束的时间(ms)
// @parma { string } label 计时标识
console.timeEnd( label );
```

***

**示例**

```js
console.time('loop');

let sum = 0;
let once = false;
for (let i = 1; i <= 100000; i++) {
    sum += i;
    if (sum >= 100000000 && !once) {
      once = true;
      console.log('迭代器加到总数是100000000以上所需的时间: ');
      console.timeLog('loop');
    }
}
console.log('从1加到100000的总数是: ',sum);
console.timeEnd('loop');

// --> 迭代器加到总数是100000000以上所需的时间: 
// --> loop: 1.197998046875 ms

// --> 从1加到100000的总数是:  5000050000
// --> loop: 5.9208984375 ms
```

## 6\. 断言

### `console.assert()`

> 可作为简单的测试, 当然复杂测试还是需要使用具体框架, 如`Jest`, `vitest`等.

```js
// @parma { boolean | function:boolean } boolean 判断, 传入布尔值
// @parma { string } failMsg 断言失败后触发的消息, 即`boolean === false`时输出的文本. 
console.assert( boolean, failMsg );
```

***

**示例**

```js
const isUndefined = ( content ) => content === void 0;

console.assert(isUndefined('1'), '传入参数不是空');
console.assert(isUndefined(), '传入参数不是空');
```

## 7\. 堆栈跟踪

### `console.trace()`

> 输出调用时, 当前函数的调用路径.
>
> 适用于项目中具有多个模块, 且多个模块之间互相引用关系错综复杂的情况下, 查看可能出现错误的函数的调用路径.

```js
console.trace();
```

***

**示例**

```js
function fn1(a) {
    fn2(a*2);
}
function fn2(a) {
    fn3(a*3);
}
function fn3(a) {
    console.trace();
    return a * 4;
}
fn1(3);
```

![image-20230906210237713.png](./iamges_02_Console%20%E6%8E%A7%E5%88%B6%E5%8F%B0%E8%BE%93%E5%87%BA/151611ytqm02yzdtpyd5do-1748700247847-13.png)

## 8\. 格式化字符输出

针对信息输出类的 `console` 函数, 除了直接输出以外, 还支持格式化字符输出:

> 格式化字符必须在第一个参数, 之后参数会被替换到格式化字符中, 如果参数类型和格式化字符不一致, 会进行类型转换.

| 格式化字符  | 说明                                      |
| ----------- | ----------------------------------------- |
| `%o`        | 输出对象                                  |
| `%O`        | 以层级结构输出对象<br>相当于console.dir() |
| `%s`        | 输出字符串                                |
| `%d` / `%i` | 输出整数                                  |
| `%f`        | 输出浮点数                                |
| `%c`        | 定义一个样式, 相当于内联样式              |
| `%%`        | 输出 `%` 字符                             |

***

**示例**

```js
console.log( '%d %s %d = %d', 2, '+' , 3, 5 );
// -> 2 + 3 = 5

// 可以替换模板字符串
console.log( `${2} ${+} ${3} = ${5}` );
```

***

**示例 - 使用自定义样式输出**

```js
console.log( 'pi = %c3.1415926', 'color: red' );
// -> pi = 3.1415926
// 3.1415926的颜色是红色的
```