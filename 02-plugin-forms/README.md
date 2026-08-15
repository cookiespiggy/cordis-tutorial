# 第 02 课：插件的三种形态与配置

## 本课目标

Cordis 的插件（plugin）可以是以下任意一种形态，它们最终都会被统一处理：

1. **函数插件**：`(ctx, config) => void` —— 最常用、最轻量。
2. **类插件**：`class { constructor(ctx, config) {} }` —— 适合需要保存内部状态或方法的插件。
3. **对象插件**：`{ apply(ctx, config) {} }` —— 适合以对象字面量表达、并携带额外属性的场景。

无论哪种形态，`config` 永远是第二个参数，由 `ctx.plugin(plugin, config)` 传入。

## 运行

```bash
npm install
npm start
```

预期输出：

```
【A】 来自函数插件
【B】 来自类插件（第 1 次）
【C】 来自对象插件
【A】 来自函数插件
【B】 来自类插件（第 2 次）
【C】 来自对象插件
```

## 要点

- **类插件的状态是持久的**：每次触发事件，`this.count` 都会累加（见输出中的「第 N 次」）。
- **config 在插件激活时做一次校验**：若插件声明了 `Config` schema（后续课程会讲），Cordis 会在激活前校验 / 合并配置。
- **选择建议**：无状态的逻辑用函数；有状态 / 行为用类；需要组合静态元数据用对象。

## 下一步

第 03 课深入事件系统：除了 `on` / `emit`，还有 `parallel` / `serial` / `bail` / `waterfall` / `once`。
