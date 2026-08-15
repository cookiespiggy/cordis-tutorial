# 第 09 课：编写可复用的自定义服务（二次开发样板）

## 本课目标

把前面 05（服务）、06（注入）、07（隔离与拦截）串起来，从零写一个**生产级服务**：

- 用 `static Config` 定义配置 Schema（StandardSchema v1 约定：`~standard.validate` + `merge`）。
- 在构造函数里用 `Service.resolveConfig` 合并「插件传入配置」与「子树 intercept 覆盖」。
- 让同一个服务在不同隔离上下文拿到不同配置（多租户 / 多环境经典场景）。

## 运行

```bash
npm install
npm start
```

预期输出：

```
root 默认命名空间 token = abc123
tenantA 命名空间 token = xyz789
root 不受影响，仍是 = abc123
custom 命名空间 token = demo-secret
```

## 要点

- **配置 Schema 的两条约定**：
  - `~standard.validate` 负责校验并提供默认值；
  - `merge(...configs)` 负责把多层配置合并成一个。
- **`Service.resolveConfig` 是合并核心**：它是 Cordis 的私有 symbol 方法，会把「插件配置（`base`）」与「从当前上下文向上回溯的 intercept 覆盖」依次合并。用它而非直接拿构造参数，才能享受隔离/拦截带来的配置覆盖能力。
- **访问服务要通过「注册所在的 ctx」**：`isolate('kv')` 返回隔离上下文，服务注册在它上面，所以必须用这个 ctx 访问 `ctx.kv`；`ctx.plugin(...)` 的返回值是 `Fiber`（纤程），它不具备服务代理，不能直接 `.kv`。
- **类型增强**：`declare module 'cordis' { interface Context { kv: KeyValueStore } }` 让 `ctx.kv` 有类型提示。

## 下一步

第 10 课讲「配置驱动加载」：把插件清单放到外部配置文件（JSON），主程序动态 `import` 并注册，实现可插拔的插件管理。
