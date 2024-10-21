# 什么是Promise (含如何判断一个值是Promise)

> 本文旨在对 Promise 的规范进行解释, 便于读者在学习 Promise 的过程中梳理 Promise 之间的操作关系,
> 不对具体的代码实现和Promise用法进行解释.
>
> 比如, 为什么 [[MDN-await]](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/await) 中要提及一个
**thenable** 对象, 而且这个 **thenable 对象**还可以和 **Promise 实例**一样使用 `await` 等待处理, 这就涉及到了下面的内容.

> 由于笔者编程水平的限制, 不可避免存在错漏或者语意不清的地方.

## Promise A+ 规范

> 参考资料: [[Promises/A+]](https://promisesaplus.com/)

在 ES6 之前，社区已经有了 Promise A+ 规范, 该规范定义了 **Promise** 的行为和接口. 根据规范, 任何具有 `.then()`
方法的函数或对象都可以被认为是一个 **Promise** ，并且可以进行 **Promise** 之间的操作。

这个具有 `.then()` 方法的函数/对象被称为 **thenable 对象**,
你可以在 [[MDN-Promise#thenable]](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise#thenable)
和 [[Promises/A+]](https://promisesaplus.com/) 查阅到相关资料.

如果读者您熟悉 ES6 中的 **Promise** , 那么对 Promise A+ 规范一定不陌生, 因为 ES6 中的 **Promise** 就是基于 **Promise A+
** 规范的官方实现和拓展. 我们可以将 ES6 的 **Promise** 称为 **Promise 对象**, 在 ES6 之前, 第三方库实现的 **Promise A+**
规范对象称为 **thenable 对象**.

该规范旨在于**统一 JS 中的异步实现**, 进而**让回调变得可控**, 避免出现回调地狱. 早在 ES6 之前, 就有很多第三方库遵守和支持这个规范.
比如 jQuery 中的 `$.ajax() / $.get()` 等方法返回的就是一个 JQuery 实现的 **thenable** 对象.

> 因为在 Promise A+ 规范在社区中被大范围认可之前, 各种第三方库(包括 JavaScript 官方) 对于异步的实现都是不统一的.
>
> 这就导致了不同的库之间如果存在异步, 就很难互相操作.
>
> 比如一个 三方库A 使用异步在 A库 内部某个函数执行的时候返回了数据 DataA, 现在我需要调用另一个 第三方库B 在获取到
> DataA的时候, 执行另外一个异步操作. 这是很难操作的, 因为没有一个统一的规范告诉 B库, 我该什么时候执行, 每个开发者的实现是不同的,
> 为了实现这一点可能就需要建立各种各样的回调函数来相互通讯.
>
> 如果时间放眼到现在, 当然很容易实现, 只需要一行代码: `A.then(dataA => { B(dataA).then() });`, 这便是 Promise A+ 规范的作用.

## ES6 Promise

基于 Promise A+ 规范, 在 ES6 中新增了一个构造函数 `Promise`, 通过实例化 **Promise**  (`new Promise()`) 可以新建一个 *
*Promise 对象**, 这个对象是一个符合 Promise A+ 规范的对象 .

> 如果为了便于理解, 我们可以将 **Promise 对象** 简单理解为一个继承了 **thenable 对象** 的对象.

不过在 Promise A+ 的基础上, ES6还拓展了更多的功能, 比如 `.catch()` 方法, `.finally()` 方法 , 静态方法 `Promise.all()`
等等,
具体可以查阅 [MDN-Promise](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise) .

需要另外了解的一点是, `.catch( (error) => {} )`方法本质上就是第一个参数传入了空参数的`.then( undefined, (error) => {} )`
方法.

## 最小实现的 Promise 和最大实现的 Promise

综上所述, 我们可以将 Promise A+ 规范规定的 **Promise** 称为最小实现的 **Promise**, 也就是 **`thenable` 对象**; 将 ES6 的
**Promise** 成为最大实现的 **Promise**, 即 **`Promise` 对象**.

如果要检测一个值是否为最小实现的 **Promise** , 只需要检测是否函数/对象, 并且存在 `.then()` 方法即可.

如果要检测一个值是否为最大实现的 **Promise**, 则只需要在上面的检测的基础上, 添加一个 `.finally()` 方法的检测.



---

**兼容性**

由于 ES6 中的 Promise 是吸取 Promise A+ 规范制定的, 所以也沿用了 Promise A+ 规范中的内容,
比如很少被注意的一点 [Promise A+ Point-46](https://promisesaplus.com/#point-46): 只要有暴露了兼容 Promise A+
规范 `.then()` 方法的 thenable 对象, 那么这个 thenable 对象就能够和其它兼容的 thenable 对象互相操作.

> This treatment of thenables allows promise implementations to interoperate, as long as they expose a
> Promises/A+-compliant `then` method. It also allows Promises/A+ implementations to “assimilate” nonconformant
> implementations with reasonable `then` methods.

所以像是 ES6 的 `Promise.all()`, ES7 的 `asnyc / await`, 都是使用的最小实现 Promise 判断, 也就是如果传入的对象 /
函数存在 `.then()` 方法, 那么就会被当做一个 Promise 去等待兑现 / 拒绝.



---

**示例 - async / await**

```js
( async () => {
	/* await 一个Promise */
	console.log( await new Promise( ( resolve ) => {
		resolve( 'resole a Promise.' );
	} ) );
	// -> 'resole a Promise.'
	
	/* await 一个自定义的thenable对象 */
	console.log( await {
		then( resolve ) {
			resolve( 'resole a thenable object.' )
		}
	} );
	// -> 'resole a thenable object.'
	
	/* await 非Promise非thenable对象, 比如一个空对象 */
	console.log( await {} );
	console.log( await 1 );
	// -> {}
	// -> 1
	// 返回表达式原先的值
	
	/* await 一个空的thenable对象 */
	console.log( await { then() {} } );
	// 无输出
	// 因为这是一个 thenable 对象, 所以 await 会暂停当前执行进程而不是像上面的表达式一样直接返回表达式的值
	// 因为没有 resolve 或者 reject, 当前执行进程被 await 暂停之后永远不会恢复进程, 等同于当前执行进程(当前async函数)被阻塞了
	
	console.log( 'Test' );
	// 不会有输出了
} )();
```

## 什么是Promise

在 Promise A+ 规范中, **Promise** 就是一个具有 `.then()` 方法的函数或者对象.

在 ES6(ES2015) 中, **Promise** 是一个构造函数, 通过这个构造函数可以实例化一个符合 Promise A+ 规范的对象.

在 ES7(ES2016) 及其之后的版本, 还可以使用 **await / async** 去调用所有符合 Promise A+ 规范的对象, 包括一些第三方库自己实现的符合
Promise A+ 规范的对象.

只要是符合 Promise A+ 规范的 **Promise** , 那么它们之间就可以互相操作.

## 工具函数, 检测一个对象是否为Promise

> 通常不会直接使用类似`value instanceof Promise`的判断, 而是给予 **Promise A+** / **ES6 Promise** 规范判断.

最小限定的检测, 检测是否为 `thenable` 对象.

```js
/**
 * 判断传入参数是否为 Promise (最小实现)
 * @param { any } value
 * @return { boolean } 是否为 Promise
 * @description 代码源于第三方库 is-promise
 * @tutorial https://www.npmjs.com/package/is-promise
 * */
function isPromise( value ) {
	return !!value
		&& ( typeof value === 'object' || typeof value === 'function' )
		&& typeof value.then === 'function';
}
```

---

取消了 `typeof value === 'function'` 的判断, 因为通过 `new Promise()` 实例化的值一定是一个对象.

如果想更严格一下, 还可以将 `.catch()` 方法也加进判断, 也有些工具函数只判断 `.then()` 方法和 `.catch()` 方法是否存在,
这只看使用者是想如何限定 Promise 的范围.

```js
/**
 * 判断传入参数是否为 Promise (最大实现)
 * @param { any } value
 * @return { boolean } 是否为 Promise
 * */
function isStrictPromise( value ) {
	return !!value
		&& typeof value === 'object'
		&& typeof value.then === 'function'
		&& typeof value.finally === 'function';
}
```

---

## 参考资料

> 参考资料:
>
> - [[Promises/A+]](https://promisesaplus.com/)
> - [[MDN-Promise]](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise)
> - [[MDN-await]](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/await)
> - [前端常见基础笔面试题【渡一教育】-Promise解决了什么问题](https://www.bilibili.com/video/BV1MN4y1R7rd?t=208)
> - [什么是Promise【渡一教育】](https://www.bilibili.com/video/av830339517/)

> 更新日志:
> 2023.9.7 初版
> 2023.9.8 第二版 新增了 \[最小实现的 Promise 和最大实现的 Promise\] 一节中兼容性的部分, 可供读者更好地理解 thenable 对象 
