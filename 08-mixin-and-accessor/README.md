# 第 08 课：扩展上下文（mixin 与 accessor）

## 本课目标

- `ctx.mixin(service, ['methodA', 'methodB'])`：把服务的方法「提升」到上下文，调用更顺手。
- `ctx.accessor(name, { get, set? })`：在上下文上新增一个计算属性（常作只读）。
- 二者都通过 `effect` 注册，会随提供方服务的卸载而自动撤销。

## 运行

```bash
npm install
npm start
```

预期输出（时间不同）：

```
通过 mixin 调用 ctx.inc(): 1
再次 ctx.inc(): 2
通过服务本体也同步计数: 3
通过 accessor 读取 ctx.now: 1750000000000 (每次访问重新计算)
```

## 要点

- **mixin 不改变归属**：`ctx.inc()` 内部仍作用于 `counter` 服务实例，计数与 `ctx.counter.inc()` 共享状态。
- **accessor 是惰性计算**：`get` 在每次访问时执行，适合 `now`、`config`、`version` 这类随访问而定的值。
- **自动清理**：mixin / accessor 都是 effect，提供方服务卸载时它们一并消失，不会污染其它上下文。

## 下一步

第 09 课进入「二次开发」：从零编写一个可复用服务（类似官方 timer 插件），把前面学到的 Service / effect / inject 串起来。
