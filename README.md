# Vue 窗口系统

使用 Vue + Tailwind CSS 制作的一个窗口系统，小练习

## 如何使用

1. 必须确保项目已注册 Pinia，使用 Tailwind CSS。
2. 在 `main.ts` 中引入 `vue-window`，并注册到 Vue 中。

```ts
import { CreatePinia } from 'pinia'
import vue_windows from 'vue-window'
import 'vue-window/dist/index.css'

const app = createApp(App)

app.use(createPinia())
app.use(vue_windows)
```

3. 创建 `tailwind.config.js` 文件，并添加以下内容：

```js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{vue,js,ts}',
    './node_modules/vue-window/dist/**/*.{vue,js,ts}', // 这一行
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

4. 注册 Tailwind CSS，在你的 CSS 文件里面导入配置文件 `tailwind.config.js`：

```css
@config "/path/to/tailwind.config.js";
```

5. 在 App.vue （或任何你希望的地方）加入 `<WindowsPanel :icons="icons" />`，其中 `icons` 是一个 `WindowSystemOptions` 对象，包含的是“应用”（可打开的窗口）的信息。

# 类型定义

```ts
export interface WindowOptions {
  title: string
  content: any
  minimized: boolean
  padding?: string
  minSize?: { width: number; height: number }
  size?: { width: number; height: number }
  allowResize?: boolean
  beforeMinimize?: () => void
  afterMinimize?: () => void
  beforeMaximize?: () => void
  afterMaximize?: () => void
  beforeClose?: () => void
  afterClose?: () => void
}

export interface IconOptions {
  name: string
  windowOptions: WindowOptions
}

export interface WindowSystemOptions {
  [key: string]: IconOptions
}
```
