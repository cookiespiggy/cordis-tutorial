# 第 05 课：服务（Service）的提供与获取

## 本课目标

- 用 `class X extends Service` 编写服务，`super(ctx, 'name')` 完成注册。
- 在其它插件里通过 `ctx.get('name')` 或类型增强后的 `ctx.name` 获取服务实例。
- 体会「服务」与「普通插件」的区别：服务是可被其它插件依赖的**命名能力**。

## 运行

```bash
npm install
npm start
```

预期输出：

```
方式一 ctx.get: 0
方式二 ctx.counter: 0
当前计数: 1
当前计数: 2
```

## 要点

- **服务名即上下文属性名**：`super(ctx, 'counter')` 之后，`ctx.counter` 与 `ctx.get('counter')` 等价。
- **类型增强**：`declare module 'cordis' { interface Context { counter: Counter } }` 让 `ctx.counter` 拥有类型提示（纯运行可省略，但强烈推荐）。
- **访问服务必须声明 `inject`**：通过 `ctx.counter` 这类属性访问服务时，消费方插件**必须**声明 `inject: ['counter']`（函数插件用 `fn.inject = ['counter']`，类插件用 `static inject`）。未声明就访问会直接抛 `cannot get property "counter" without inject`。`inject` 同时决定了插件的激活顺序——依赖的服务会先就绪，且在服务缺失时消费方会被自动暂停，而不是静默出错。

## 下一步

第 06 课讲「依赖注入（inject）」：如何声明「我依赖某个服务」，以及 Cordis 如何据此管理插件的激活顺序与生命周期。
