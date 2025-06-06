# [radash 源码解析#1] `radash.try()` 的使用和源码实现

## 0. 前言

内容先行预览: 

- `radash.try()` 函数的**说明**和**使用方法**
- `TypeScript` 类型体操之**泛型**, **泛型约束**, **三元运算符**, **三元运算符在函数中返回值的运用**, **类型工具的使用**
- 操作 Promise 将**异常输出流程扁平化**

## 1. 说明

### 函数说明

`radash.try` 函数简化了 `await Promise` 下的错误处理. 正常情况下如果需要处理 `await` 情况下抛出的异常, 需要使用到 `try/catch` 操作.

`radash.try` 函数将 `try/catch` 操作扁平化, 通过一个数组形式输出兑现信息, 可以达到将异常处理转化成正常函数操作流的效果. 

### 名称说明

- **正常函数**: 返回值不是 `Promise` 的函数.
- **正常类型**: 除了 `Promise` 以外的类型. 
- **Promise 函数**: 返回值是 `Promise` 的函数.

## 2. 使用

### 用法

> 引入 `_try` 函数: 

```ts
// 直接引入函数, 需要通过类型别名将输出的 `try` 函数更名为 `_try` 或者其他名称
import { try as _try } from 'radash';  

// 直接引入函数, `tryit` 函数和 `try` 函数是同一个函数, 如果引入 tryit 函数则不需要进行类型别名
import { tryit } from 'radash';  
```

```ts
// 全部引入 radash
import * as _ from 'radash';

// 通过 `_.try` 使用 try 函数
console.log( _.try );
```



> 使用 `_try` 函数: 

```ts
// 通过 `_try` 函数将 `api.gods.create()` 这个函数转化成一个新函数
// 这个新函数就会输出扁平化的兑现信息
const flatApiGodsCreate = _try( api.gods.create );
const [ err, response ] = await flatApiGodsCreate( {name: 'Jesus'} );
```



> 返回值(元组): `[err, response] = [兑现失败错误信息, 兑现成功信息]`

一共存在两种输出: 正确兑现 `Promise` 和 错误兑现 `Promise`.

- 正确兑现 `Promise` 时: `[err: undefined, response: any]`
- 错误兑现 `Promise` 时: `[err: any, response: undefined]`

所以可以通过判断 `err` 是否是 `undefined` , 来判断当前的 `Promise` 是否兑现成功, 具体请看下面的示例. 



### 示例

> 本文使用到的模拟函数 `api.gods.create()` 将在文章后的附页-依赖函数中获取. 

> 报错分支: 

```ts
import { try as _try } from 'radash';

( async () => {
	// test 1
	const [ err, response ] = await _try( api.gods.create )( { name: 'Ra' } );
    
    // 错误处理
	if ( err ) {
		throw new Error( 'Your god is weak and could not be created' );
	}
    
    // 成功处理
	console.log( ' test 2-1', response );
} )();
```

> 正确兑现分支

```ts
import { try as _try } from 'radash';

( async () => {
	// test 2
	const [ err, response ] = await _try( api.gods.create )( { name: 'Jesus' } );
	if ( err ) {
		throw new Error( 'Your god is weak and could not be created' );
	}
	console.log( 'test 2-2', response );
} )();
```


### 不使用 `_try` 的原始使用

> 错误兑现分支

```ts
( async () => {
	// test 1
	let response: string = '';
	try {
		response = await api.gods.create( { name: 'Ra' } );
	}
	catch ( e ) {
		throw new Error( 'Your god is weak and could not be created' );
	}
	console.log( 'test 3-1', response );
} )();
```

> 正确兑现分支

```ts
( async () => {
	// test 2
	let response: string = '';
	try {
		response = await api.gods.create( { name: 'Jesus' } );
	}
	catch ( e ) {
		throw new Error( 'Your god is weak and could not be created' );
	}
	console.log( 'test 3-2', response );
} )();
```




## 3. 源码实现 - TypeScript

> 这里的源码实现主要注重源码中的ts类型体操实现, 因为代码比较简单所以不会再另附一个章节讲述 `JavaScript` 的实现. 
>
> 如果想要查看 `JavaScript` 的源码实现, 建议直接查看下面的章节 ***[4. radash 源码 - JavaScript]*** , 里面有具体的注释说明. 

> 如果对某些 TypeScript 概念不清楚, 比如**泛型**, **类型工具**等, 可以查看 ***[附页 - 阅读文档]*** 中给出的链接结合阅读. 



### Step - 1: 返回一个新函数

> 先声明两个泛型 `<Args, Return>`, 泛型`Args` 是原函数的参数类型数组, 泛型 `Return` 是原函数的返回值类型. 

```ts
const _try = <Args, Return>( func: ( ...arg: Args ) => Return ) => {
	return () => {};
};
```

> 这里的 `...arg: Args` 出现了一个报错: 
> `TS2370: A rest parameter must be of an array type.`
>
> 意思是因为 `...arg` 是一个**剩余参数**, 所以它的类型必须是一个**数组类型** , 但是这里的泛型 `Args` 可能是任意的值, 所以这里需要给泛型 `Args` 添加上一个**类型约束**. 



### Step - 2: 给泛型 `Args` 添加类型约束

> 使用 `extends` 关键词给泛型 `Args` 添加约束条件, 说明泛型 `Args` 只能是一个数组 (`any[]`). 

```ts
const _try = <Args extends any[], Return>( func: ( ...arg: Args ) => Return ) => {
	return () => {};
};
```



### Step - 3: 规定返回的新函数的参数类型

```ts
const _try = <Args extends any[], Return>( func: ( ...arg: Args ) => Return ) => {
	return (
        // 参数类型是原来的类型, 使用泛型 Args 声明
		...args: Args
	) => {};
};
```



### Step - 4: 规定返回的新函数的返回值类型

> > 此处的类型映射声明是我自己加的, 源代码中全部使用的都是原始类型. 
> > 我嫌太麻烦并且可读性太差所以写了这些类型映射. 
>
> 首先声明了三个**类型映射**: `Resolve<T>` 和 `Reject` . 
>
> - `Resolve<T>`: 成功返回的类型 (元组) . 使用泛型规定成功的返回类型. 
> - `Reject`: 错误返回的类型 (元组) .
> - `ReturnValue<T>`: 整合了上面两个类型映射的新类型映射. 

```ts
// 成功返回类型映射
type Resolve<T> = [ undefined, T ];
// 错误返回类型映射
type Reject = [ Error, undefined ];
// 总返回值类型映射
type ReturnValue<T> = Resolve<T> | Reject;
```

---

> 因为返回值因为 `Promise` 的存在可能有两种情况, 所以需要使用三元运算符 `extends` 进行判断: 
>
> 如果判断返回值是一个 `Promise`, 那么新的返回元组也应该是一个 `Promise`: `Promise<ReturnValue<T>>` ; 
>
> 否则如果返回值是一个正常类型, 那么返回一个正常的元组: `ReturnValue<T>`. 

> 这里就要涉及到为什么声明类型映射的时候, `Resolve<T>` 要声明一个泛型 `T` , 因为如果当返回值是一个 `Promise` 的时候, 泛型 `Return` 的类型其实是 `Promise<Return>` , 无法直接获取到 `Return` 的值. 通过泛型可以让我们提取出 `Return` 的值之后, 再返回回去, 这样类型就不会因为是固定的导致错误的类型声明了. 
>
> 可以通过**类型工具 `Awaited<Type>`** 从一个类型 `Promise<T>` 中提取出类型 `T` 出来. 

```ts
const _try = <Args extends any[], Return>( func: ( ...arg: Args ) => Return ) => {
	// 参数类型是原来的类型 (泛型 Args)
	return ( ...args: Args ):
		Return extends Promise<any>
			? Promise<ReturnValue<Awaited<Return>>>
			: ReturnValue<Return> => {
	};
};
```



### Step - 5: 实现普通函数的异常捕获

> 普通函数使用 `try/catch` 进行错误捕获: 

```ts
const _try = <Args extends any[], Return>( func: ( ...arg: Args ) => Return ) => {
	// 参数类型是原来的类型 (泛型 Args)
	return ( ...args: Args ):
		Return extends Promise<any>
			? Promise<ReturnValue<Awaited<Return>>>
			: ReturnValue<Return> => {
		try {
			const result: Return = func( ...args );
			
			return [ void 0, result ];
		}
		catch ( err: any ) {
			return [ err, void 0 ];
		}
	};
};
```

> \[Warning\]: 这里的两个 `return` 是会出现报错的, 第一个 `return [ void 0, result ];` 报错信息是 (第二个也是类似的就不写出来了): 
> `TS2322: Type [ undefined, Return ] is not assignable to type
> Return extends Promise<any> ? Promise<ReturnValue<Awaited<Return>>> : ReturnValue<Return>`
>
> 这个报错信息的意思是: 因为我们声明的函数返回值是一个三元运算符 (有两种情况) , 所以我们返回值的类型也应该声明两种情况. 



### Step - 6: 解决普通函数的返回值类型错误问题

> 所以我们给返回值也添加上使用了三元运算符的类型声明, 虽然我们返回的类型是确定的一种情况, 但是还是需要进行声明: 

```ts
const _try = <Args extends any[], Return>( func: ( ...arg: Args ) => Return ) => {
	// 参数类型是原来的类型 (泛型 Args)
	return ( ...args: Args ):
		Return extends Promise<any>
			? Promise<ReturnValue<Awaited<Return>>>
			: ReturnValue<Return> => {
		try {
			const result: Return = func( ...args );
			
			return [ void 0, result ] as Return extends Promise<any>
				? Promise<Resolve<Awaited<Return>>>
				: Resolve<Return>;
		}
		catch ( err: any ) {
			return [ err, void 0 ] as Return extends Promise<any>
				? Promise<Reject>
				: Reject;
		}
	};
};
```



### Step - 7:  实现 Promise 函数的异常捕获

> 这里使用了 `radash` 库中的 `isPromise()` 函数来判断某个变量是否为 `Promise` 类型. 

> 因为 Promise 的异常捕获是通过 `.then().catch()` 进行的, 所以通过判断对应变量是否为 Promise 之后, 就能进行对应的异常捕获操作. 

```ts
const _try = <Args extends any[], Return>( func: ( ...arg: Args ) => Return ) => {
	// 参数类型是原来的类型 (泛型 Args)
	return ( ...args: Args ):
		Return extends Promise<any>
			? Promise<ReturnValue<Awaited<Return>>>
			: ReturnValue<Return> => {
		try {
			const result: Return = func( ...args );
			
			// 实现 Promise 函数的异常捕获
			if ( isPromise( result ) ) {
				return result
					.then( ( value: Return ): Resolve<Return> => [ void 0, value ] )
					.catch( ( err: any ): Reject => [ err, void 0 ] ) as Return extends Promise<any>
					? Promise<ReturnValue<Awaited<Return>>>
					: ReturnValue<Return>;
			}
			
			return [ void 0, result ] as Return extends Promise<any>
				? Promise<Resolve<Awaited<Return>>>
				: Resolve<Return>;
		}
		catch ( err: any ) {
			return [ err, void 0 ] as Return extends Promise<any>
				? Promise<Reject>
				: Reject;
		}
	};
};
```



## 4. radash 源码

> 使用到额外函数 `isPromise()` 是 radash 内置的检测一个变量是否非 Promise 的方法. 

> `_try` 函数其实并不复杂, 只是里面包含了比较复杂的ts类型体操, 查看下方的 `JavaScript` 源码就能够比较直观地看清楚里面的代码结构. 

### `TypeScript`

```ts
import { isPromise } from 'radash';

/**
 * A helper to try an async function without forking
 * the control flow. Returns an error first callback _like_
 * array response as [Error, result]
 */
export const tryit = <Args extends any[], Return>(
	func: ( ...args: Args ) => Return,
) => {
	return (
		...args: Args
	): Return extends Promise<any>
		? Promise<[ Error, undefined ] | [ undefined, Awaited<Return> ]>
		: [ Error, undefined ] | [ undefined, Return ] => {
		try {
			const result = func( ...args );
			if ( isPromise( result ) ) {
				return result
					.then( value => [ undefined, value ] )
					.catch( err => [ err, undefined ] ) as Return extends Promise<any>
					? Promise<[ Error, undefined ] | [ undefined, Awaited<Return> ]>
					: [ Error, undefined ] | [ undefined, Return ];
			}
			
			return [ undefined, result ] as Return extends Promise<any>
				? Promise<[ Error, undefined ] | [ undefined, Awaited<Return> ]>
				: [ Error, undefined ] | [ undefined, Return ];
		}
		
		catch ( err ) {
			return [ err as any, undefined ] as Return extends Promise<any>
				? Promise<[ Error, undefined ] | [ undefined, Awaited<Return> ]>
				: [ Error, undefined ] | [ undefined, Return ];
		}
	};
};
```

### `JavaScript`

```js
import { isPromise } from 'radash';

/**
 * @param {function} func
 *
 * @Return {function}
 * */
export const tryit = ( func ) => {
	/**
	 * 返回一个新函数
	 *
	 * @return {[Error | undefined, any | undefined]}
	 * */
	return ( ...args ) => {
		try {
			// 调用原函数, 获取输出结果
			const result = func( ...args );
			
			// 如果输出结果是一个 Promise,
			// 则进入 Promise 内部获取其兑现信息
			if ( isPromise( result ) ) {
				return result
					// 这里处理 Promise 正确兑现的逻辑
					.then( ( value ) => [ void 0, value ] )
					// 这里处理 Promise 抛出异常的逻辑
					.catch( ( err ) => [ err, void 0 ] );
			}
			
			// 如果输出结果是一个正常结果, 直接返回结果因为不会出现错误.
			// 一个正常函数如果抛出异常会直接进入到下面的 catch 流程,
			// 不会进入到这里的, 所以一定是正确的.
			return [ void 0, result ];
		}
		catch ( err ) {
			// 这里处理正常函数如果抛出异常的逻辑
			return [ err, void 0 ];
		}
	};
};
```

> PS: 
> `void 0` 是 `undefined` 的另一种写法, 因为 `void 0` 一定会输出 `undefined` , 但是因为 `undefined` 不是一个关键词, 在局部作用域中的 `undefined` 变量可能被篡改, 所以在比较严谨的情况下会使用 `void 0` 作为 `undefined` .

## 附页

### 依赖函数

```ts
/**
 * 模拟请求
 * */
export const api = {
	gods: {
		create: ( options: { name: string } ): Promise<string> => {
			return new Promise( ( res, rej ) => {
				if ( options.name !== 'Jesus' ) {
					rej( 'Your god is weak and could not be created' );
					return;
				}
				res( 'create god successfully' );
			} );
		},
	},
};
```

### 阅读文档

> - [npm - radash](https://www.npmjs.com/package/radash)
> - [github - radash](https://github.com/rayepps/radash)
> - [radash - tryit 源码](https://github.com/rayepps/radash/blob/master/src/async.ts#L265)
> - [radash - tryit 文档](https://github.com/rayepps/radash/blob/master/docs/async/tryit.mdx)
> - [radash - isPromise 文档](https://github.com/rayepps/radash/blob/master/docs/typed/is-promise.mdx)

> - [TypeScript 泛型](https://typescript.p6p.net/typescript-tutorial/generics.html)
> - [TypeScript 泛型 - 类型参数的约束条件](https://typescript.p6p.net/typescript-tutorial/generics.html#%E7%B1%BB%E5%9E%8B%E5%8F%82%E6%95%B0%E7%9A%84%E7%BA%A6%E6%9D%9F%E6%9D%A1%E4%BB%B6)
> - [TypeScript 的类型映射](https://typescript.p6p.net/typescript-tutorial/mapping.html#typescript-%E7%9A%84%E7%B1%BB%E5%9E%8B%E6%98%A0%E5%B0%84)
> - [TypeScript 的元组类型](https://typescript.p6p.net/typescript-tutorial/tuple.html#typescript-%E7%9A%84%E5%85%83%E7%BB%84%E7%B1%BB%E5%9E%8B)
> - [TypeScript 运算符 - extends...?: 条件运算符](https://typescript.p6p.net/typescript-tutorial/operator.html#extends-%E6%9D%A1%E4%BB%B6%E8%BF%90%E7%AE%97%E7%AC%A6)
> - [TypeScript 类型工具 - ``Awaited<Type>``](https://typescript.p6p.net/typescript-tutorial/utility.html#awaited-type)