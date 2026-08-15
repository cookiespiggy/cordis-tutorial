# 第 04 课：副作用（effect）与插件生命周期

## 本课目标

- 用 `ctx.effect()` 登记「需要清理的资源」（定时器、连接、监听器、文件句柄等）。
- 理解插件 `fiber` 的生命周期：PENDING → LOADING → ACTIVE → DISPOSED。
- 体会 Cordis 的「自动清理」能力：插件卸载时，所有 effect 的清理函数会逆序执行。

## 生命周期状态

| 状态 | 值 | 含义 |
| --- | --- | --- |
| `PENDING` | 0 | 已注册，但依赖未满足，尚未加载 |
| `LOADING` | 1 | 正在执行插件体 |
| `ACTIVE` | 2 | 已激活，effect 已运行 |
| `FAILED` | 3 | 插件体抛错 |
| `DISPOSED` | 4 | 已卸载 |
| `UNLOADING` | 5 | 正在清理 |

## 运行

```bash
npm install
npm start
```

预期输出：

```
插件体执行：此时 fiber 即将进入 ACTIVE
  [effect A] 建立资源
  [effect B] 建立资源 B1
  [effect B] 释放资源 B1
  [effect B] 建立资源 B2
  [effect B] 释放资源 B2
激活后状态: ACTIVE (2)
  [effect B] 释放资源 B2
  [effect B] 释放资源 B1
  [effect A] 释放资源
卸载后状态: DISPOSED (4)
```

## 要点

- **effect 在 ACTIVE 后才执行**：插件注册是异步的，必须 `await fiber` 后资源才建立。
- **清理顺序与建立顺序相反**：后建立的先释放（B2 → B1 → A），符合「后开先关」的资源管理常识。
- **无需手动清理**：相比到处写 `clearInterval` / `removeListener`，把资源交给 `ctx.effect` 后，插件卸载会自动处理——这是构建可组合应用的关键。

## 下一步

第 05 课进入「服务（Service）」：把可复用的能力（如计数器、定时器）以服务形式提供给其它插件。
