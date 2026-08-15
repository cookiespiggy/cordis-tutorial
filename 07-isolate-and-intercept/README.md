# 第 07 课：隔离（isolate）与拦截（intercept）

## 本课目标

- `isolate(name)`：为某个服务名创建「独立命名空间」，使同名服务在子树中互不干扰。
- `intercept(name, config)`：在子树中覆盖某个服务的配置（需服务通过 `Service.resolveConfig` 读取配置）。
- 二者常组合使用：既隔离实例、又定制配置。

## 运行

```bash
npm install
npm start
```

预期输出：

```
root : 你好，世界
dev  : Hi 世界
root 不变: 你好，世界
根上下文看不到被隔离的 tag: undefined
```

## 要点

- **isolate 解决「同名冲突」**：多个插件想各自提供一个 `timer` / `greeter` 时，用 `isolate` 把它们放进不同子树即可并存。
- **intercept 需要服务配合**：服务必须在构造函数里调用 `this[Service.resolveConfig](config)` 才会读取并合并拦截配置；框架不会自动把拦截值塞进构造函数参数。
- **配置合并顺序**：base（插件配置）→ 子树 intercept 覆盖（由近及远）。

## 下一步

第 08 课讲 `mixin` 与 `accessor`：如何把服务的能力「提升」到上下文上，或新增计算属性。
