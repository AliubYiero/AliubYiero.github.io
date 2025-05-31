# 全局CSS导入

## 描述

向页面中储存 CSS 规则, 打开对应网站的时候会自动添加自定义的 CSS 规则到页面上. 



> 当前的 CSS 规则只能写入无法删除, 因为本质上就不是一个完善的脚本. 
>
> 如果想删除可以去翻 `localStorage` 下的 `ExtraCSSConfig` 找对应的规则, 所有的规则都是明文储存的.  

## 菜单按键说明

- `添加CSS`: CSS规则. 
  示例: `.hide {display: none;}`
- `隐藏元素`: 元素选择器. 
  示例: `.hide` 所有 `hide` 类就会被隐藏. 

  > 实际上是自动添加变成了 `.hide {display: none !important;}` 



## 示例

### 屏蔽元素

> 这里以屏蔽B站的UP主发的淘宝广告为例. 

![04](http://qiniu-pic.yiero.top/photos/blog/default04.jpg)

通过开发者工具找到B站动态的每一个动态都是一个 `.bili-dyn-list__item` 容器, 有广告的动态就有淘宝的链接图标, 再往下找就能找到淘宝图标用的是一个 `.goods.icon--taobao` 元素. 

所以点击 **隐藏元素** 选项, 在弹出的 Prompt 框中, 写入规则 `.bili-dyn-list__item:has(.goods.icon--taobao)` , B站的Up主发的淘宝广告就会被CSS规则屏蔽掉了, 并且每次打开B站动态页当前CSS规则都会存在.



### 改变页面CSS布局

由于本质上就是往页面中写入 CSS  , 所以改页面布局也是可以的, 这里简单说明一下. 

> 还是以B站动态为例. 在某个版本之后进入UP主主页之后的动态下的按钮会是一个两端对齐的状态, 不如之前的都是居左按钮的方便, 所以将其该回居左的状态. 

![02](http://qiniu-pic.yiero.top/photos/blog/default02.png)

首先找到底部按钮对应的 `div` 容器 `.bili-dyn-item__footer` , 然后看到原有的属性是: 

```css
.bili-dyn-item__footer {
    display: -ms-flexbox;
    display: flex;
    height: 50px;
    -ms-flex-pack: justify;
    justify-content: space-between;
    padding-right: 20px;
}
```

这里需要将 `justify-content: space-between;` 属性覆盖掉变成 `justify-content: left;`, 所以我们写入的CSS规则优先级稍微比原来高一些即可. 

所以点击 **添加CSS **按钮, 在弹出的 Prompt 框中输入 `div.bili-dyn-item__footer {justify-content: left;}`. 所有的动态按钮就都会居左了. 

![03](http://qiniu-pic.yiero.top/photos/blog/default03.png)

同理, 只要是页面布局, 只要优先级能够覆盖掉原来的样式所有的页面都可以改. 

~~(全部使用 `!important` 强制覆盖也不是不行)~~



## 碎碎念

> 好久之前花了几分钟写的脚本, 但是蛮好用, 想着重构完了再发布还是把这个版本发了吧, ~~在重构中了好久也不知道什么时候才有动力写完~~ .



## 更新计划

- 更好的CSS规则写入页面的方式
- 更好的UI
- 更好的存储
- 完整的CSS规则的增删改查
- CSS高亮
- 右键菜单选择快速屏蔽元素
- 新增 CSS 伪规则 `:text()` 如果使用该规则, 那么会自动添加 MutationObserver 监听对应元素出现以及其文本