// Cordis 入门第 08 课：扩展上下文（mixin 与 accessor）
// 目标：理解如何把服务的能力「提升」到 ctx 上，以及如何新增只读计算属性。
//
// 运行步骤：
//   npm install
//   npm start

import { Context, Service } from 'cordis'

declare module 'cordis' {
  interface Context {
    counter: Counter
    inc(): number // 由 mixin 提升到 ctx
    now: number // 由 accessor 提供的只读属性
  }
}

class Counter extends Service {
  private n = 0

  constructor(ctx: Context) {
    super(ctx, 'counter')
    // mixin：把 counter 的指定方法「提升」到 ctx 上，
    // 之后可以直接 ctx.inc() 而不必写 ctx.counter.inc()。
    ctx.mixin('counter', ['inc'])
    // accessor：在 ctx 上新增一个计算属性 now（只读）。
    // 每次访问 ctx.now 都会重新执行 get。
    ctx.accessor('now', {
      get() {
        return Date.now()
      },
    })
  }

  inc(): number {
    return ++this.n
  }
}

const root = new Context()
await root.plugin(Counter)

console.log('通过 mixin 调用 ctx.inc():', root.inc())
console.log('再次 ctx.inc():', root.inc())
console.log('通过服务本体也同步计数:', root.counter.inc())
console.log('通过 accessor 读取 ctx.now:', root.now, '(每次访问重新计算)')
