# 第 06 课：依赖注入（inject）

## 本课目标

- 用 `static inject = ['serviceName']`（或 `@Inject('serviceName')` 装饰器）声明插件依赖。
- 理解 **依赖驱动的生命周期**：消费者插件只在依赖可用时激活，依赖消失时自动暂停。
- 区分 `ctx.get(name)`（严格，默认）与 `ctx.get(name, false)`（非严格，缺失返回 `undefined`）。

## 运行

```bash
npm install
npm start
```

预期输出：

```
查询结果: SELECT 1
非严格获取 db: 查询结果: SELECT 2
严格获取未提供的属性报错: cannot get property "neverProvided" without provide
```

## 要点

- **为什么用 inject 而不是随手 get**：`inject` 让 Cordis 知道依赖关系，从而在依赖不可用时自动暂停消费者、恢复时重新激活——这是「可组合应用」的核心。
- **装饰器写法**：类插件也可以用 `@Inject('db')` 代替 `static inject = ['db']`（本项目统一用 `static inject` 以兼容更多运行环境）。
- **严格 vs 非严格**：默认严格模式要求属性必须「已提供」；非严格（`false`）适合「可选能力」的探测。

## 下一步

第 07 课讲 `isolate`（隔离）与 `intercept`（拦截配置）：在子树中提供互不干扰的同名服务、或覆盖服务配置。
