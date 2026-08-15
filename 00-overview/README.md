# Cordis 分层学习教程（总览）

这是一套基于你本地 `cordis` 源码、从基础到二次开发的**分步学习目录**。
每个目录都是**独立可运行**的小项目，放在 `/Users/jimmy/codes` 下，与 `cordis` 平级。

> 代码注释全部为中文；目录名、文件名用英文。

## 学习方法

1. 按顺序从 `01` 学到 `12`，每课只依赖前面学过的概念。
2. 每个目录都是一个独立 npm 项目，进到目录里：
   ```bash
   npm install   # 联网装 cordis + tsx
   npm start     # 用 tsx 直接运行 TS 源码
   ```
3. 打开 `src/index.ts` 读中文注释，对照控制台输出理解概念。
4. 改一改代码、再 `npm start`，是最快的理解方式。

## 三层结构

### 第一层：基础（01–04）
| 目录 | 主题 | 关键概念 |
|------|------|----------|
| `01-hello-context` | 第一个 Context | `new Context()`、事件、`ctx.emit` |
| `02-plugin-forms` | 插件的三种形态 | 函数插件、对象插件（`apply`/`name`/`Config`）、类插件 |
| `03-event-system` | 事件系统 | `on` / `once` / `off`、`emit` / `bail` / `parallel` / `sequential` / 生命周期事件 |
| `04-effects-and-lifecycle` | 副作用与生命周期 | `ctx.effect`、`fiber.dispose()`、副作用自动回收 |

### 第二层：入门（05–08）
| 目录 | 主题 | 关键概念 |
|------|------|----------|
| `05-services` | 服务（Service） | `extends Service`、`super(ctx,'name')`、类型增强、`inject` 声明 |
| `06-dependency-injection` | 依赖注入 | `fn.inject`、`static inject`、按依赖排序激活、严格/非严格获取 |
| `07-isolate-and-intercept` | 隔离与拦截 | `isolate(name)`、`intercept(name, config)`、配置作用域 |
| `08-mixin-and-accessor` | 混入与访问器 | `ctx.mixin`、`ctx.accessor`、把服务方法/属性投射到上下文 |

### 第三层：二次开发（09–12）
| 目录 | 主题 | 关键概念 |
|------|------|----------|
| `09-custom-service` | 自定义服务（样板） | `static Config` 配置 Schema、`Service.resolveConfig` 合并配置、多实例/多租户 |
| `10-config-driven-loader` | 配置驱动加载 | 外部清单 + 动态 `import`、可插拔插件管理（附官方 loader 说明） |
| `11-plugin-packaging` | 插件打包发布 | `exports` / `peerDependencies`、把插件做成 npm 包 |
| `12-capstone-scheduler` | 综合实战 | 调度器服务 + 事件解耦 + 副作用回收（串起全部知识） |

## 环境要求

- Node.js 22+（教程用到了顶层 `await`、ESM、`import.meta.url`）。
- 首次 `npm install` 需要联网拉取 `cordis@4.0.0-rc.8` 与 `tsx`。
- 无需本地构建 `cordis` 源码——教程直接依赖已发布的 `cordis` 包，其 API 与本项目 `packages/core` 一致。

## 进阶方向

学完 12 课后，建议直接读 `cordis/packages/` 源码加深理解：
- `packages/core/src/`：`context.ts`、`service.ts`、`events.ts`、`registry.ts`、`fiber.ts` —— 本套教程所有 API 的源头。
- `packages/loader`、`packages/include`、`packages/hmr`：官方插件加载 / 配置包含 / 热重载。
- `packages/timer`、`packages/group`：真实世界里的服务与插件范例。

祝学习顺利 🚀
