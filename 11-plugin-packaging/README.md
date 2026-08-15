# 第 11 课：把插件打包成可发布的 npm 包

## 本课目标

把一个插件整理成**可发布的 npm 包**：定义清晰的入口、配置 Schema、对等依赖，供其它项目按名引入。

## 运行（演示宿主使用）

```bash
npm install
npm start
```

预期输出：

```
[客服] 收到消息: 你好，在吗？
```

## 插件包应该长什么样

把本目录的 `src/index.ts` 当作一个独立 npm 包（比如取名 `my-cordis-plugin`），它的 `package.json` 关键字段：

```json
{
  "name": "my-cordis-plugin",
  "version": "1.0.0",
  "type": "module",
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "import": "./dist/index.js",
      "types": "./dist/index.d.ts"
    }
  },
  "files": ["dist"],
  "peerDependencies": {
    "cordis": "^4.0.0-rc.8"
  },
  "devDependencies": {
    "cordis": "4.0.0-rc.8",
    "tsup": "^8.0.0"
  }
}
```

要点：

- **`peerDependencies` 声明 `cordis`**：插件不自己装一份 Cordis，而是复用宿主的那一份，保证所有插件共享同一个 `Context` 体系。
- **`exports` 暴露入口**：宿主 `import echoPlugin from 'my-cordis-plugin'` 拿到的就是本文件的默认导出（函数插件）。
- **导出 `Config` 与类型**：把 `Config` 和 `EchoConfig` 一并导出，宿主写配置时才有提示。

## 宿主侧用法

```ts
import { Context } from 'cordis'
import echoPlugin from 'my-cordis-plugin'

const ctx = new Context()
await ctx.plugin(echoPlugin, { topic: '客服' })
```

## 发布流程

1. `npm run build`（用 `tsup` 等把 TS 编译到 `dist/`，生成 `.d.ts`）。
2. `npm publish`（或发到私有源 / 公司内部 registry）。
3. 宿主 `npm i my-cordis-plugin` 后按名引入。

## 下一步

第 12 课是综合实战：用前面所有知识写一个**定时任务调度器**服务，串起服务、事件、副作用与生命周期。
