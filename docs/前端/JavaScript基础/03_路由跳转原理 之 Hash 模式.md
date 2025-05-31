# 路由跳转原理 之 Hash

## 一. 路由跳转的原理

首先讲讲路由跳转的原理, 其实没有什么神秘的, 以变量类比: 

```js
// 首先定义一个变量名为 container , 赋予初始值 'index'
let container = 'index';

// 监听一个点击事件
window.addEventListener('click', (e) => {
  // 当点击事件的触发元素的 id 为 'index' 的时候
	if (e.target.id === 'index') {
    // 改变变量的值为 'index'
  	container = 'index';
  }
  // 当点击事件的触发元素的 id 为 'news' 的时候
  else if (e.target.id === 'news') {
		// 改变变量的值为 'news'
		container = 'news';
  }
});
```

在上文的代码中, 在监听到点击事件的时候, 会改变变量的值. 那么, 如果不再监听点击事件, 而是 **监听页面路径改变** ; `container` 也不是一个变量而是一个HTML元素, 当监听回调触发时, 修改的是这个 `container` 元素内部的HTML片段, 那么其实就是路由跳转了:

```js
// 定义一套路由
const ComponentIndex = `<div>Index Page</div>`;
const ComponentNews = `<div>News Page</div>`;

// 获取 `container` 容器
let container = document.querySelector('#container');
// 赋予 `container` 容器初始值
container.innerHTML = ComponentIndex;

// 监听一个页面跳转事件 (不存在 pageURLChange 事件, 仅作为一个示例)
window.addEventListener('pageURLChange', (e) => {
  // 假设传入的回调参数就是跳转的页面
  
  // 当跳转的页面是 'index' 时
	if (e === 'index') {
    // 将 container 容器的内部HTML片段修改为Index路由的内容
  	container.innerHTML = ComponentIndex;
  }
  // 当跳转的页面是 'news' 时
  else if (e === 'news') {
		// 将 container 容器的内部HTML片段修改为News路由的内容
		container.innerHTML = ComponentNews;
  }
});
```



## 二. Hash跳转的实现原理

路由跳转目前主要有两种, `hash` 模式和 `history` 模式, 这其实是对应了 JavaScript 中两种无刷新改变网页URL的方式: `location.hash` 和 `history.pushState` . 本文主要讲的就是第一种: **Hash模式** .

> Hash 模式和 History 模式原理都是一样的, 不过是监听页面路径跳转的方式不同而已.
>
> History模式等有空了会写的...(咕

### 2.1 Hash是什么

URL 路径中可以存在 **锚点** , 通过一个符号 `#` 表示. 当 URL 中存在锚点的时候, 锚点后面的字符串将不会被请求上服务器, 仅作为本地浏览器数据访问, 这个值被称为 **Hash 值**.

比如, 下面这两串网址访问百度服务器的时候, 百度都只会接收到 `https://www.baidu.com/` 这一串地址请求, Hash 值并不会通过网络请求发送给服务器.

```js
https://www.baidu.com
https://www.baidu.com#12345
```

![image-20231106165129752.png](./iamges_03_%E8%B7%AF%E7%94%B1%E8%B7%B3%E8%BD%AC%E5%8E%9F%E7%90%86%20%E4%B9%8B%20Hash%20%E6%A8%A1%E5%BC%8F/224144l92ibqigygw2g1gv-1748700537581-7.png)

> 关于锚点的概念, 其实在初学 HTML 的时候就接触到了: 在学习锚元素 `<a>` 的时候其实就已经了解过了, 当时讲的是 `a` 元素可以通过 `#id` 跳转至页面的某一个 `id` 的位置, 这本质上就是利用到了锚点.
>
> 参考文档: [[MDN - 文本片段]](https://developer.mozilla.org/zh-CN/docs/Web/Text_fragments)

### 2.2 改变 hash 的原理

通过 `location.hash` 属性, 可以更改页面的 Hash , 并且不会刷新页面只改变 URL 路径; 当 Hash 改变的时候, 会触发一个 `hashchange` 事件, 以此我们就可以通过监听 `hashchange` 事件事件去改变页面的内容了.

同时, 当页面 Hash 改变的时候, 也会向浏览器的访问历史添加一个记录, 所以也可能通过 `history.go()` 去控制页面访问历史.



> 因为这两个API都比较简单所以就不单独列出来说明了, 可以自行参照文档阅读. 直接看下文代码也是可以的, 都是一些很基础的应用并且我会作出一定的说明.
>
> 参考文档:
>
> - [[MDN - Location: Hash]](https://developer.mozilla.org/zh-CN/docs/Web/API/Location/hash)
> - [[MDN - HashChangeEvent]](https://developer.mozilla.org/zh-CN/docs/Web/API/HashChangeEvent)

### 2.3 通过 `hashchange` 事件监听页面路径改变

#### 2.3.1 `location.hash`

当 URL 中没有锚点的时候, 直接输出会输出空字符串:

```js
/* URL: www.baidu.com */

console.log(location.hash);
// -> ''
```

---

当向没有锚点的 URL 改变 hash 时, 会自动添加锚点:

> 输入时不用添加锚点, 但是输出时会输出锚点(见下例).

```js
/* URL: www.baidu.com */

location.hash = 'index';
/* URL: www.baidu.com#index */

console.log(location.hash);
// -> '#index'
```

---

通常为了让路由跳转后的 URL 更像一个地址, 我们会在 Hash 前添加一个斜杠 `/` :

```js
/* URL: www.baidu.com */

location.hash = '/index';
/* URL: www.baidu.com#/index */
```

#### 2.3.2 `hashchange` 事件

当页面中的 Hash 发生改变的时候, 会触发事件 `hashchange` , 在事件的回调参数 `e` 中有两个可以利用到的属性: `e.newURL` 和 `e.oldURL` . 见名思意, 分别是改变后的 URL 和改变前的 URL .

```js
// 监听 hash 改变事件
window.addEventListener('hashchange', (e) => {
  // 防止重复跳转
  if (e.newURL === e.oldURL) {
      return;
  }
  
  /*
   * 判断完重复跳转的情况之后, 直接使用页面的 `location.hash` 就可以了
   * e.newURL 是一个字符串, 获取 hash 还需要额外处理
   * 之前说过输出 hash 的时候会输出锚点 所以通过 `.slice()` 方法将第一个锚点符号删除.
   */
  console.log(location.hash.slice(1))
}

/* URL: www.baidu.com */

location.hash = '/index';
/* URL: www.baidu.com#/index */
// -> /index
```

> 其实这个回调参数是可以不使用的, 因为如果 `e.newURL === e.oldURL` , Hash 根本不会发生改变, `hashchange` 事件也不会触发, 这里仅仅只是作为一个 **示例** .

### 2.4 通过 `history.go()` 控制页面访问历史

每一次调用 `location.hash` 都会往浏览器中写入一条历史记录, 理所应当 `history.go()` 也能控制 Hash 改变产生的历史记录:

```js
/* URL: www.baidu.com */

location.hash = '/index';
/* URL: www.baidu.com#/index */

location.hash = '/news';
/* URL: www.baidu.com#/news */

history.go(-1);
/* URL: www.baidu.com#/index */

history.go(-1);
/* URL: www.baidu.com */
```

## 三. 实现一个 HashRouter 库

 在前文我们已经对 Hash 模式的路由跳转进行了简单的剖析, 现在可以试着做一个简易的 Router 路由跳转库了.



### 3.1 规范

首先, 我们需要对一些格式进行一定的规范, 这样我们就可以基于这些规范写一个标准库: 



#### 3.1.1 HTML 规范

对于 HTML , 我们使用 dataset 进行标记:

- `data-router-link-container`: 表示一个路由跳转容器.
	- `data-router-link`: 表示一个路由跳转链接, 该属性的值就是跳转的路由地址.
- `data-router-view`: 表示一个路由内容显示容器, 路由跳转后显示的内容会在该元素内显示.

#### 3.1.2 JavaScript 规范

编写一个 `HashRouter` 类, 构造函数的参数 `options` 的类型为: 

```js
options = {
	routes: Array<{
    path: string, 
    component: {
    	template: string,
    }
  }>
}
```

- `routes`: 路由数组
	- `path`: 路由的路径
	- `component`: 路由组件的内容
		- `template`: 路由组件的 HTML 片段

> 参考文档:
>
> - [[HTMLElement.dataset]](https://developer.mozilla.org/zh-CN/docs/Web/API/HTMLElement/dataset)

### 3.2 编写库

> 这部分内容就简单讲了, 内容都在代码块中, 主要就是一个元素获取以及 `dataset` 的值获取.

下面的方法都是类 `HashRouter` 中的方法: 

#### 3.2.1 跳转路由

```js
/**
 * 监听路由跳转容器点击, 跳转路由
 *  绑定一个具有 [data-router-link-container] 属性的容器, 监听这个容器内冒泡出来的 `click` 事件
 *  当 `click` 事件触发时, 判断触发的元素是否有 `data-router-link` 属性
 *  如果存在, 则改变当前页面的 Hash 为 `data-router-link` 属性的值
 */
bindRouterLinkEvent() {
    // 找到具有 [data-router-link-container] 属性的容器
    document.querySelector('[data-router-link-container]')
        // 监听容器内冒泡出来的 click 事件
        ?.addEventListener('click', (e) => {
            // 排除非 [data-router-link] 属性的容器
            if (!e.target.dataset['routerLink']) {
                return;
            }

            // 阻止标签跳转
            e.preventDefault();

            // 更改页面 Hash
            window.location.hash = `${e.target.dataset['routerLink']}`
        });
}
```

#### 3.2.2 监听路由跳转

```js
/**
 * 监听 URL hash 的改变, 并且更新 [data-router-view] 容器内的 HTML 片段.
 */
listenHashChange() {
    window.addEventListener('hashchange', () => {
        // 寻找跳转路径
        const route = this.routes.find(
            route => route.path === window.location.hash.slice(1)
        );

        // 如果找不到跳转路径, 报错
        if (!route) {
            console.error('找不到跳转路径');
            return;
        }

        // 改变 [data-router-view] 容器内的 HTML 片段
        const viewContainer = document.querySelector('[data-router-view]');
        if (viewContainer) {
            viewContainer.innerHTML = route.component.template;
        }
    })
}
```

#### 3.2.3 浏览历史操作

```js
/**
 * 历史记录跳转
 *
 * @param {number} step - 跳转的步数
 *
 * @example HashRouter.go(1) 前进一步历史
 * @example HashRouter.go(-1) 后退一步历史
 */
go(step) {
    history.go(step);
}

/**
 * 历史记录跳转 - 后退一步
 */
back(){
    this.go(-1);
}

/**
 * 历史记录跳转 - 前进一步
 */
forward(){
    this.go(1);
}
```

### 3.3 HashRouter.js

```js
/* HashRouter.js */
class HashRouter {
    /**
     * @constructor
     * @param {{routes: [{path: string, component: {template: string}}]}} options
     * */
    constructor(options) {
        this.routes = options.routes;
        this.bindRouterLinkEvent();
        this.listenHashChange();
    }

    /**
     * 匹配路由
     *  绑定一个具有 [data-router-link-container] 属性的容器, 监听这个容器内冒泡出来的 `click` 事件
     *  当 `click` 事件触发时, 判断触发的元素是否有 `data-router-link` 属性
     *  如果存在, 则改变当前页面的 Hash 为 `data-router-link` 属性的值
     */
    bindRouterLinkEvent() {
        // 找到具有 [data-router-link-container] 属性的容器
        document.querySelector('[data-router-link-container]')
            // 监听容器内冒泡出来的 click 事件
            ?.addEventListener('click', (e) => {
                // 排除非 [data-router-link] 属性的容器
                if (!e.target.dataset['routerLink']) {
                    return;
                }

                // 阻止标签跳转
                e.preventDefault();

                // 更改页面 Hash
                window.location.hash = `${e.target.dataset['routerLink']}`
            });
    }

    /**
     * 监听 URL hash 的改变, 并且更新 [data-router-view] 容器内的 HTML 片段.
     */
    listenHashChange() {
        window.addEventListener('hashchange', () => {
            // 寻找跳转路径
            const route = this.routes.find(
                route => route.path === window.location.hash.slice(1)
            );

            // 如果找不到跳转路径, 报错
            if (!route) {
                console.error('找不到跳转路径');
                return;
            }

            // 改变 [data-router-view] 容器内的 HTML 片段
            const viewContainer = document.querySelector('[data-router-view]');
            if (viewContainer) {
                viewContainer.innerHTML = route.component.template;
            }
        })
    }

    /**
     * 历史记录跳转
     *
     * @param {number} step - 跳转的步数
     *
     * @example HashRouter.go(1) 前进一步历史
     * @example HashRouter.go(-1) 后退一步历史
     */
    go(step) {
        history.go(step);
    }

    /**
     * 历史记录跳转 - 后退一步
     */
    back(){
        this.go(-1);
    }

    /**
     * 历史记录跳转 - 前进一步
     */
    forward(){
        this.go(1);
    }
}

export default HashRouter;
```



### 3.4 示例

目录结构:

> |	HashRouter.js
>
> |	index.html

```html
<!-- index.html -->
<nav class="route-nav" data-router-link-container>
    <a class="toPageIndex" data-router-link="/index">Index</a>
    <a class="toPageNews" data-router-link="/news">News</a>
</nav>
<hr>
<div data-router-view></div>
<script type="module">
  	// 引入 HashRouter.js
    import HashRouter from './HashRouter.js';

    // 声明路由模板
    const IndexPage = {
        template: '<div>IndexPage</div>'
    }
    const NewsPage = {
        template: '<div>NewsPage</div>'
    }

    // 注册路由
    new HashRouter({
        routes: [
            {
                path: '/',
                component: IndexPage
            },
            {
                path: '/index',
                component: IndexPage
            },
            {
                path: '/news',
                component: NewsPage
            }
        ]

    })
</script>
```

![image-20231106223622192.png](./iamges_03_%E8%B7%AF%E7%94%B1%E8%B7%B3%E8%BD%AC%E5%8E%9F%E7%90%86%20%E4%B9%8B%20Hash%20%E6%A8%A1%E5%BC%8F/224216hvli7g7n3gnd5ii7-1748700512316-1.png)

![image-20231106223624830.png](./iamges_03_%E8%B7%AF%E7%94%B1%E8%B7%B3%E8%BD%AC%E5%8E%9F%E7%90%86%20%E4%B9%8B%20Hash%20%E6%A8%A1%E5%BC%8F/224223cyyylgo52syoy1gq-1748700513745-4.png)



### 3.5 一些问题

> `HashRouter.js` 存在的一些问题, 提供思考, 感兴趣的也可以想一想如何改造 `HashRouter.js` 使其功能更加强大:

- 无法传参
- 无法实现子路由
- 无法通过函数跳转路由
- ...