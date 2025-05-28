# 快速搭建使用 element-plus 组件库的 vue3 应用

> 本文仅为并非框架学习, 仅仅作为框架搭建快速入门. 

## 使用 vite 初始化 vue3 

**新建项目架构**

> 新建一个目录初始化环境

```bat
npm create vite
```

> 在当前目录下初始化环境

```bat
npm create vite .
```

- *Select a framework*: » `Vue`

> 选择使用的框架, 选择 `Vue` 默认是 Vue3 . 

- *Select a variant*: » `TypeScript`

> 选择使用的语言, `Ts` 或者 `Js`

**安装默认库**

> 进入到对应目录

```js
npm install
// or 
pnpm install
// or 
yarn install
```



## 安装 ElementPlus

> 我习惯使用 pnpm 安装, 如果使用其它包管理器也是一样的. 

### 按需(自动)安装

**安装库**

> 安装 Element Plus

```bat
pnpm install element-plus
```

> 安装自动按需导入插件

```bat
pnpm install -D unplugin-vue-components unplugin-auto-import
```

**导入插件**

> 打开 `vite.config.ts`, 直接将以下内容到替换掉原来的文件内容(仅限新项目). 

```ts
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';

// https://vitejs.dev/config/
export default defineConfig( {
	plugins: [
		vue(),
        
        // (#add) add plugin
		AutoImport( {
			resolvers: [ ElementPlusResolver() ],
		} ),
        // (#add) add plugin
		Components( {
			resolvers: [ ElementPlusResolver() ],
		} ),
	],
} );
```

**导入 ElMessage 样式**

> 如果使用按需导入, 在 `Script` 作用域中使用 `ElMessage` 提示消息时, 是没有样式的, 所以需要将 `ElMessage` 的样式全局导入进项目中. 

> 打开 `src/main.ts`, 新增以下一行导入语句. 

```ts
import 'element-plus/theme-chalk/el-message.css';
```

> 在任意的 Vue 文件中, 使用 `ElMessage` 即可. 

```vue
<script lang="ts" setup>
import { ElMessage } from 'element-plus';
    
ElMessage.success( '信息提示成功' );
</script>
```



### 全局安装

> 打开 `src/main.ts` 文件

```ts
import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from './App.vue'

createApp( App )
    .use( ElementPlus )		// (#add) 新增一行 .use(), 直接链式调用即可
    .mount( '#app' )
```
