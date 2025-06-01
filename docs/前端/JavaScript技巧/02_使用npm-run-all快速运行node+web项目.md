# 使用npm-run-all快速运行node+web项目

[`npm-run-all`](https://www.npmjs.com/package/npm-run-all) 是一个用于简化并拓展多个 npm 命令同时运行的项目. 

当项目是一个前后端结合的项目时, 开启 `node` 服务端需要一个终端窗口, 开启 `web` 网页预览端服务又需要另外一个终端窗口. 我们想要在一个终端中同时运行 `web` + `node` 时, 就可以利用该库. 

### 项目结构

我们有一个根目录 `project`, 里面存在两个目录 `web` 和 `node` , 分别存放 `web` 项目和 `node` 项目. 

```bat
project
│
│─ web
│  │  package.json
│  │─ dist
│
│─ node
│  │  package.json
│  │─ dist
│
│─ package.json
```

`web` 项目中的 `npm run preview` 命令是开启网页预览服务; `node` 项目中的 `npm run start` 命令是开启服务端服务. 



### 安装

> 在 `project` 根目录下安装: 

```bat
npm install npm-run-all -D
```

> 在 `package.json` 文件中添加以下命令: 

```json
{
  "scripts": {
	"open-web": "start http://localhost:4173/",
    "web": "cd web && npm run preview",
    "node": "cd node && npm run start",
    "start:all": "run-p node web open-web"
  }
}
```

****

### 解释命令

#### 定义命令

我们首先定义了三个命令, 每个命令都是独立的: 

- 开启网页预览服务: `cd web && npm run preview`. (*进入 web 目录并运行预览命令*)
- 开启服务端服务: `cd node && npm run start`. (*进入 node 目录并运行开启服务端命令*)
- 网页预览服务打开后, 自动弹出网页: `start http://localhost:4173/`. (具体端口请按项目修改)

---

#### `run-s`

如果按照正常的终端指令, 想要让这三个命令同时运行, 只能写如下命令: 

```json
{
  "scripts": {
    "start:all": "npm run node && npm run web && npm run open-web"
  }
}
```

如果这么写, 终端运行是串行的, 即按顺序同时只能运行一个命令, 终端运行到 `npm run node` 命令之后就会卡住, 因为服务端常驻在后台, 不往下继续运行命令了. 

对于串行的情况, `npm-run-all` 提供了一个简化的命令 `run-s`, 可以给我们使用: 

```json
{
  "scripts": {
    "start:all": "run-s node web open-web"
  }
}
```

但显然这并不是我们需要的, 这种串行的命令适用于像**代码构建**这类场景: 先进行 `eslint`, 再运行 `build`. 

---

#### `run-p`

所以针对这种需要同时启动多个服务的并行场景, `npm-run-all` 给我们提供了另外一个命令: `run-p`. 使用该命令之后, 后面的 `npm` 命令参数就都会同时启动了: 

```json
{
  "scripts": {
    "start:all": "run-p node web open-web"
  }
}
```

