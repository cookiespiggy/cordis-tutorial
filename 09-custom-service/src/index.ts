// Cordis 入门第 09 课：编写可复用的自定义服务（二次开发样板）
// 目标：从零写一个「生产级」服务，涵盖 配置 Schema、配置合并、命名实例、生命周期。
// 综合运用了前面：05（服务）、06（注入）、07（隔离与拦截）的知识。
//
// 运行：npm install && npm start

import { Context, Service } from 'cordis'

// 对 Context 做类型增强，让 ctx.kv 拥有类型提示。
declare module 'cordis' {
  interface Context {
    kv: KeyValueStore
  }
}

// 1) 配置 Schema（遵循 StandardSchema v1 约定）
//    - '~standard' 是 Cordis 认可的配置校验契约
//    - merge 用于把「插件传入的配置」与「子树 intercept 覆盖」合并
const Config = {
  '~standard': {
    version: 1,
    vendor: 'tutorial',
    validate(v: any) {
      // 校验并提供默认值
      return { value: { namespace: v?.namespace ?? 'default' } }
    },
  },
  merge(...configs: any[]) {
    return Object.assign({}, ...configs)
  },
}

// 2) 自定义服务：一个简单的内存键值存储（可扩展为 Redis / 文件存储等）
class KeyValueStore extends Service {
  // 把配置 Schema 挂到静态字段，Cordis 才会用它做校验与合并
  static Config = Config

  private store = new Map<string, unknown>()
  // 合并后的最终配置（已包含 intercept 覆盖）
  options: { namespace: string }

  constructor(ctx: Context, config: { namespace: string }) {
    // 第二参数 'kv' 是服务名，之后任意插件可通过 ctx.kv / ctx.get('kv') 获取
    super(ctx, 'kv')

    // Service.resolveConfig 是 Cordis 内部方法，负责把「插件传入配置」与
    // 「子树 intercept 覆盖」按作用域合并。它是私有 symbol，类型上需断言。
    // 这一步保证同一个服务在不同隔离上下文里可以拿到不同配置。
    this.options = (this as any)[Service.resolveConfig](config)
  }

  // 业务方法
  set(key: string, value: unknown) {
    this.store.set(`${this.options.namespace}:${key}`, value)
  }

  get(key: string) {
    return this.store.get(`${this.options.namespace}:${key}`)
  }

  has(key: string) {
    return this.store.has(`${this.options.namespace}:${key}`)
  }
}

const root = new Context()

// 3) 默认命名空间的服务
await root.plugin(KeyValueStore)
root.kv.set('token', 'abc123')
console.log('root 默认命名空间 token =', String(root.kv.get('token')))

// 4) 在隔离子树里覆盖配置（不同 namespace）
//    isolate('kv') 让该子树拥有独立的 kv 实例；
//    intercept('kv', {...}) 把覆盖配置合并进服务。
const tenantA = root.isolate('kv').intercept('kv', { namespace: 'tenant-a' })
await tenantA.plugin(KeyValueStore)
tenantA.kv.set('token', 'xyz789')
console.log('tenantA 命名空间 token =', String(tenantA.kv.get('token')))
console.log('root 不受影响，仍是 =', String(root.kv.get('token')))

// 5) 插件显式传入自定义配置（同样 isolate 出独立实例）
//    注意：要先保留 isolate 返回的「隔离上下文」，服务注册在它上面，
//    因此必须通过这个 ctx 访问 ctx.kv（plugin 的返回值是 fiber，不具备服务代理）。
const customCtx = root.isolate('kv')
await customCtx.plugin(KeyValueStore, { namespace: 'custom' })
customCtx.kv.set('token', 'demo-secret')
console.log('custom 命名空间 token =', String(customCtx.kv.get('token')))
