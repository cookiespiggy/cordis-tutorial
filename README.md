# Cordis 分步学习教程

基于 [cordis](https://github.com/cordiverse/cordis)（Koishi 生态的「时空可组合性」元框架）源码，从基础到二次开发的一套**分步、独立可运行**学习教程。

每个目录都是一个独立 npm 项目，代码注释全中文，`npm install && npm start` 即可运行。

## 目录结构

### 第一层：基础（01–04）
| 目录 | 主题 |
|------|------|
| `01-hello-context` | 第一个 Context |
| `02-plugin-forms` | 插件的三种形态（函数 / 对象 / 类） |
| `03-event-system` | 事件系统（`on` / `once` / `emit` / `bail` / `parallel` / `serial` / `waterfall`） |
| `04-effects-and-lifecycle` | 副作用与生命周期（`effect` / `dispose`） |

### 第二层：入门（05–08）
| 目录 | 主题 |
|------|------|
| `05-services` | 服务（Service） |
| `06-dependency-injection` | 依赖注入（`inject`） |
| `07-isolate-and-intercept` | 隔离与拦截（`isolate` / `intercept`） |
| `08-mixin-and-accessor` | 混入与访问器（`mixin` / `accessor`） |

### 第三层：二次开发（09–12）
| 目录 | 主题 |
|------|------|
| `09-custom-service` | 自定义服务（配置 Schema） |
| `10-config-driven-loader` | 配置驱动加载（可插拔） |
| `11-plugin-packaging` | 插件打包发布 |
| `12-capstone-scheduler` | 综合实战：定时任务调度器 |

> 完整学习路径、每课要点与进阶方向见 [`00-overview/README.md`](./00-overview/README.md)。

## 快速开始

任选一课：

```bash
cd 01-hello-context
npm install
npm start
```

打开 `src/index.ts` 读中文注释，对照控制台输出理解概念。改一改再运行，是最快的学习方式。

## 环境要求

- Node.js 22+
- 首次 `npm install` 会联网拉取 `cordis@4.0.0-rc.8` 与 `tsx`

## License

[MIT](./LICENSE)
