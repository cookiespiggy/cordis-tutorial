# 第 10 课：配置驱动的插件加载器（可插拔架构）

## 本课目标

把「用哪些插件、各自什么配置」从源码里抽出来放进外部清单，主程序读清单 → 动态 `import` → 逐个注册。这是 Cordis 生态里 **可插拔架构** 的核心思想。

## 运行

```bash
npm install
npm start
```

预期输出：

```
[loader] 已加载插件: greeter
[loader] 已加载插件: logger
[greeter] 你好，来自配置驱动的插件
[logger] 应用启动完成，记录一条启动日志
```

## 要点

- **清单即配置**：`src/config.json` 描述插件名、文件路径、配置、是否启用。增删插件只改 JSON，不动代码。
- **动态 `import`**：用 `pathToFileURL(resolve(...)).href` 把相对路径转成绝对 `file://` URL，再 `await import(url)`。配合 `tsx`，`.ts` 插件也会被即时编译。
- **`enabled` 开关**：`enabled === false` 的条目被跳过，实现「运行时启停插件」。
- **官方方案**：Cordis 官方提供 `@cordisjs/plugin-loader` + `@cordisjs/plugin-include`，支持 YAML/JS、热重载、依赖排序、按目录自动发现等。本课手动实现是为了讲清原理；真实项目直接用官方 loader 即可（`npm i @cordisjs/plugin-loader @cordisjs/plugin-include`）。

## 下一步

第 11 课讲「插件打包发布」：如何把一个插件整理成可发布的 npm 包（入口、`exports`、对等依赖），供其它项目按名引入。
