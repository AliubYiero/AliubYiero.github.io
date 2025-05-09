# 基础架构-线段 [Aegisub 图形库开发#1] 

> 在观看本文之前, 请确保你了解 lua 的基础编程知识和 ASS 图形绘制. 

在本系列文章中, 将会讲解如何搭建一个属于自己的图形库, 包括以下内容: 

- 基础图形快速生成. 如生成矩形, 圆形等......
- 基础图形变换. 如平移, 缩放, 旋转. 
- 基础图形晕眩. 如交集, 并集.

## ASS 绘图线段创建辅助库

在上手开发之前, 你需要搭建一个基础的框架出来, 这个框架将会把所有关于 ASS 绘图代码的内容封装起来, 不再手动去操作绘图代码, 而是操作函数去控制绘图代码. 

比如, 使用 `create.origin(x, y)` 函数去创建一个原点字符串: `m <x> <y>`, 使用 `create.line(x, y)` 函数去创建一个线段: `l <x> <y>`. 

这对于一个库的开发来说是简洁且必要的. 

### 创建辅助线段库

首先需要声明一个表, 将所有关于线段创建的内容整合在这个表中. 

内容很简单, 就是通过传入参数 `string.format()` 返回对应的字符串. 

```lua
--- 线段创建函数库
local create = {}
```

### 创建原点

通过 `string.format()` 创建一个原点, 并且将小数位精确到 1 位小数. 

> 我推荐是保留 1 位小数, 如果直接取整的话, 后续有些图形的效果可能会有些问题. 如果保留更多位小数的话没必要, 而且会给渲染带来压力. 

```lua
--- 创建一个原点
--- @param x number 原点的 x 坐标
--- @param y number 原点的 y 坐标
--- @return string 该原点对应的 assdraw 字符串
create.origin = function(x, y) 
	return ('m %.1f %.1f'):format(
    	x, y
    )
end
```

### 创建线段

这里的创建线段函数使用 `_line` 命名, 因为后续不使用该函数创建线段, 会使用一个统一处理的 `create.line()` 函数去创建线段 / 贝塞尔曲线. 

> 使用 `_变量` 命名的函数表示该函数在当前模块中是一个**私有方法**, 尽量**不要**去使用该函数. 

```lua
--- 创建一个线段
--- @param x number 线段的 x 坐标
--- @param y number 线段的 y 坐标
--- @return string 该线段对应的 assdraw 字符串
create._line = function(x, y)
    return ('l %.1f %.1f'):format(
            x, y
    )
end
```

### 创建贝塞尔曲线

**创建三阶贝塞尔曲线**

> 这里的函数参数的定义和 ASS 绘图代码的逻辑是反的, 先传入 `(x, y)` 在传入两个控制点, 这是为了统一处理逻辑, 即所有绘图代码都先定义终点坐标 `(x, y)` 再定义其它内容. 

```lua
--- 创建一个三阶贝塞尔曲线
--- @param x number 三阶贝塞尔曲线的 x 坐标
--- @param y number 三阶贝塞尔曲线的 y 坐标
--- @param p1_x number 控制点 1 的 x 坐标
--- @param p1_y number 控制点 1 的 y 坐标
--- @param p1_x number 控制点 2 的 x 坐标
--- @param p2_y number 控制点 2 的 y 坐标
---
--- @return string 该3阶贝塞尔曲线对应的 assdraw 字符串
create._cubic_bezier_curve = function(
        x, y,
        p1_x, p1_y,
        p1_x, p2_y
)
    return ('b %.1f %.1f %.1f %.1f %.1f %.1f'):format(
            p1_x, p1_y,
            p1_x, p2_y,
            x, y
    )
end
```

**创建二阶贝塞尔曲线**

因为 ASS 绘图代码中没有二阶贝塞尔曲线, 为了有些可能需要使用到的场景, 所以通过三阶贝塞尔曲线拟合了一个二阶贝塞尔曲线, 只需要将两个控制点放在同一个坐标即可. 

> 在最开始 **创建辅助线段库** 的时候单独声明了一个表, 就是为了这种情况可以使用本函数库中的其它函数. 
>
> 如果将所有函数都在声明表的时候定义, 在这个时候就没办法获取到 `create._cubic_bezier_curve()` 函数了. 

```lua
--- 创建一个2阶贝塞尔曲线 (通过3阶贝塞尔曲线拟合)
--- @param x number 贝塞尔曲线终点的 x 坐标
--- @param y number 贝塞尔曲线终点的 y 坐标
--- @param p_x number 控制点的 x 坐标
--- @param p_y number 控制点的 y 坐标
--- @return string 该原点对应的 assdraw 字符串
create._second_order_bezier_curve = function(
        x, y,
        p_x, p_y
)
    return create._cubic_bezier_curve(
            x, y,
            p_x, p_y,
            p_x, p_y
    )
end
```

### 创建线段 (统一)

统一处理逻辑, 除了创建原点以外, 创建线段都使用该逻辑统一返回. 

如果传入两个参数, 就是创建直线线段, 即 `l <x> <y>`; 

如果传入四个参数, 就是创建二阶贝塞尔曲线, 即 `b <p_x> <p_y> <p_x> <p_y> <x> <y>`;

如果传入六个参数, 就是创建三阶贝塞尔曲线, 即 `b <p1_x> <p1_y> <p2_x> <p2_y> <x> <y>`;

```lua
--- 创建一条线段 / 二阶贝塞尔曲线 / 三阶贝塞尔曲线
--- @param x number 线段终点的 x 坐标
--- @param y number 线段终点的 y 坐标
--- @param p1_x number 控制点 1 的 x 坐标
--- @param p1_y number 控制点 1 的 y 坐标
--- @param p2_x number 控制点 2 的 x 坐标
--- @param p2_y number 控制点 2 的 y 坐标
---
--- @return string 该线段对应的 assdraw 字符串
create.line = function(
        x, y,
        p1_x, p1_y,
        p2_x, p2_y
)
    -- 如果传入最后两个参数, 即传入六个参数, 返回三阶贝塞尔曲线
    if p2_x and p2_y then
        return create._cubic_bezier_curve(
                x, y,
                p1_x, p1_y,
                p2_x, p2_y
        )
    end
    -- 如果传入第三/四个参数, 即传入四个参数, 返回二阶贝塞尔曲线
    if p1_x and p1_y then
        return create._second_order_bezier_curve(
                x, y,
                p1_x, p1_y
        )
    end
    -- 传入两个参数, 返回直线线段
    return create._line(x, y)
end
```

## 创建绘图示例

因为我们将所有线段绘制逻辑都进行了统一封装, 所以无论绘制什么图形都是一样的, 构建一个顶点坐标表, 然后传入每个顶点即可. 

### 绘制矩形

```lua
-- 创建一个边长 100 的正方形顶点坐标集
local rect = {
    { 0, 0 }, -- 左上顶点坐标 (0, 0)
    { 0, 100 }, -- 右上顶点坐标 (0, 100)
    { 100, 100 }, -- 右下顶点坐标 (100, 100)
    { 100, 0 }    -- 左下顶点坐标 (100, 0)
}

-- 使用 table.unpack( rect[i] ) 将坐标从 rect 表中解构出来
local rect_draw_code = ('%s %s %s %s %s'):format(
        create.origin(table.unpack(rect[1])),   -- 创建原点 (左上顶点)
        create.line(table.unpack(rect[2])),     -- 连接原点到右上顶点
        create.line(table.unpack(rect[3])),     -- 连接右上顶点到右下顶点
        create.line(table.unpack(rect[4])),     -- 连接右下顶点到左下顶点
        create.line(table.unpack(rect[1]))      -- 连接左下顶点到左上顶点 (闭合图形)
)

print(rect_draw_code)
-- m 0 0 l 0 100 l 100 100 l 100 0 l 0 0
```

### 绘制圆型

```lua
-- 创建一个半径 100 , 圆心为 (0, 0) 的圆顶点坐标集
-- 注意表的顺序是 {x, y, p1_x, p1_y, p2_x, p2_y} 
local circle = {
    { -100.0, 0.0, -55.2, 100.0, -100.0, 55.2 }, -- 左顶点坐标
    { 0.0, -100.0, -100.0, -55.2, -44.8, -100.0 }, -- 上顶点坐标
    { 100.0, 0.0, 55.2, -100.0, 100.0, -55.2 }, -- 右顶点坐标
    { 0.0, 100.0, 100.0, 55.2, 55.2, 100.0 }, -- 下顶点坐标
}

-- 使用 table.unpack( circle[i] ) 将坐标从 circle 表中解构出来
local circle_draw_code = ('%s %s %s %s %s'):format(
        -- 同样解压左顶点坐标, 由于 create.origin(x, y) 只接受 2 个参数, 所以后面的控制点坐标会被忽略
        create.origin(table.unpack(circle[1])),
        create.line(table.unpack(circle[2])),   -- 连接左顶点和上顶点
        create.line(table.unpack(circle[3])),   -- 连接上顶点和右顶点
        create.line(table.unpack(circle[4])),   -- 连接右顶点和下顶点
        create.line(table.unpack(circle[1]))    -- 连接下顶点和左顶点 (闭合图形)
)

print(circle_draw_code)
-- m -100.0 0.0 b -100.0 -55.2 -44.8 -100.0 0.0 -100.0 b 55.2 -100.0 100.0 -55.2 100.0 0.0 b 100.0 55.2 55.2 100.0 0.0 100.0 b -55.2 100.0 -100.0 55.2 -100.0 0.0
```

## 封装绘图逻辑

在前面的 **创建绘图示例** 中, 我们可以看到无论是创建矩形还是创建圆形, 其逻辑都是一样的, 不同的只是顶点坐标表的不同. 

于是可以进一步进行封装, 不再去处理 `create` 表, 通过一个函数 `shape.create(vertices)` 处理, 传入顶点坐标表 `vertices` , 该函数会自动处理该表, 并返回一个 ASS 绘图字符串. 

### `shape.create()`

> 这里直接使用字符串拼接, 因为顶点数是未知的, 使用 `string.format()` 反而会更麻烦. 

```lua
--- 图形生成库
local shape = {}

--- 通用图形创建器, 按照顶点坐标数组创建图形
--- @param vertices table 坐标顶点数组
--- 
--- @return string 一段 ass 绘图字符串
shape.create = function(vertices)
    local shape_string = ''
    -- 创建原点
    shape_string = shape_string .. create.origin(table.unpack(vertices[1])) .. ' '

    -- 连接所有顶点
    for i = 2, #vertices do
        shape_string = shape_string .. create.line(table.unpack(vertices[i])) .. ' '
    end

    -- 闭合图形
    shape_string = shape_string .. create.line(table.unpack(vertices[1]))

    return shape_string
end
```

### 创建绘图示例 (简化)

#### 绘制矩形

```lua
-- 创建一个边长 100 的正方形顶点坐标集
local rect = {
    { 0, 0 }, -- 左上顶点坐标 (0, 0)
    { 0, 100 }, -- 右上顶点坐标 (0, 100)
    { 100, 100 }, -- 右下顶点坐标 (100, 100)
    { 100, 0 }    -- 左下顶点坐标 (100, 0)
}

-- (#change) 使用 shape.create() 解构顶点坐标集并返回字符串
local rect_draw_code = shape.create(rect)

print(rect_draw_code)
-- m 0 0 l 0 100 l 100 100 l 100 0 l 0 0
```

#### 绘制圆形

```lua
-- 创建一个半径 100 , 圆心为 (0, 0) 的圆顶点坐标集
-- 注意表的顺序是 {x, y, p1_x, p1_y, p2_x, p2_y} 
local circle = {
    { -100.0, 0.0, -55.2, 100.0, -100.0, 55.2 }, -- 左顶点坐标
    { 0.0, -100.0, -100.0, -55.2, -44.8, -100.0 }, -- 上顶点坐标
    { 100.0, 0.0, 55.2, -100.0, 100.0, -55.2 }, -- 右顶点坐标
    { 0.0, 100.0, 100.0, 55.2, 55.2, 100.0 }, -- 下顶点坐标
}

-- (#change) 使用 shape.create() 解构顶点坐标集并返回字符串
local circle_draw_code = shape.create(circle)

print(circle_draw_code)
-- m -100.0 0.0 b -100.0 -55.2 -44.8 -100.0 0.0 -100.0 b 55.2 -100.0 100.0 -55.2 100.0 0.0 b 100.0 55.2 55.2 100.0 0.0 100.0 b -55.2 100.0 -100.0 55.2 -100.0 0.0
```

