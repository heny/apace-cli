# vue3-ts
- stylelint
- eslint
- prettier
- pinia
- vue-router
- 加入自动按需引入
- svg引入组件

## 增加UI组件库
下面以`element-plus`为例，直接配置按需引入即可，其他组件库也是如此
其他支持按需引入的组件库：
https://github.com/antfu/unplugin-vue-components/blob/main/src/core/resolvers/index.ts

1. 安装
```bash
pnpm add element-plus
```

2. 按需引入
修改vite.config.ts文件
```ts
// vite.config.ts
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

export default {
  plugins: [
    // ...
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [ElementPlusResolver()],
    }),
  ],
}
```
3. 之后可以直接在vue文件中使用了

## 增加markdown组件
1. 安装
```bash
pnpm add @vueuse/head
pnpm add -D vite-plugin-md markdown-it-link-attributes markdown-it-prism
```

2. main入口文件加入
```js
import { createHead } from '@vueuse/head'
app.use(createHead())
```

3. vite.config.ts配置
```js
import Markdown from 'vite-plugin-md'
import Prism from 'markdown-it-prism'
import LinkAttributes from 'markdown-it-link-attributes'

export default defineConfig({
  plugins: [
    AutoImport({
      imports: ['@vuevue/head']
    }),
    Markdown({
        wrapperClasses: 'markdown-body',
        headEnabled: true,
        markdownItOptions: {
          html: true,
          linkify: true,
          typographer: true,
        },
        markdownItSetup(md) {
          // https://prismjs.com/
          md.use(Prism)
          md.use(LinkAttributes, {
            matcher: (link: string) => /^https?:\/\//.test(link),
            attrs: {
              target: '_blank',
              rel: 'noopener',
            },
          })
        },
      }),
  ]
})
```

4. 新增views/markdown.vue 文件
```vue
<template>
  <MarkdownPage />
</template>
<script lang="ts" setup>
import MarkdownPage from '@/docs/Test.md'
</script>
```

5. 添加一个新的路由
```json
{
  name: 'Markdown',
  path: '/markdown',
  component: MarkdownPage,
  meta: {
    title: 'markdown',
  },
}
```


6. 下载markdown样式
地址：https://prismjs.com/plugins/file-highlight/#examples
点击DOWNLOAD，选择对应的主题，滚动到最下面，点击下载css
添加src/assets/styles/markdown.scss，并将下载好的css内容复制进去
```scss
.markdown-body {
  // 复制到这里
}
```
之后将该css文件在index.scss文件内导入
