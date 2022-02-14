/// <reference types="vite/client" />

declare module '*.vue' {
  import { DefineComponent } from 'vue'
  // eslint-disable-next-line
  const component: DefineComponent<{}, {}, any>
  export default component
}

// 声明 md 文件
declare module '*.md' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

// 声明 vite 环境变量
declare interface ImportMetaEnv {
  readonly VITE_PORT: number
  readonly VITE_APP_TITLE: string
  // 更多环境变量...
}

declare interface Window {
  // extend the window
}
