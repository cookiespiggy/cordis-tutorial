// Cordis 入门第 05 课：服务（Service）的提供与获取
// 目标：理解「服务」——把可复用的能力（如计数器、数据库连接）以命名实例提供给其他插件。
//
// 运行步骤：
//   npm install
//   npm start

import { Context, Service } from 'cordis'

// 对 Context 做类型增强：声明 ctx.counter 的类型，之后用 TS 时才会有提示。
declare module 'cordis' {
  interface Context {
    counter: Counter
  }
}

// 服务：继承 Service，在构造函数里调用 super(ctx, '服务名') 完成「提供」。
class Counter extends Service {
  private n = 0

  constructor(ctx: Context) {
    // super 的第二参数 'counter' 会成为服务名，
    // 之后任意插件都能通过 ctx.get('counter') 或 ctx.counter 获取本实例。
    super(ctx, 'counter')
  }

  inc(): number {
    return ++this.n
  }

  get value(): number {
    return this.n
  }
}

const root = new Context()

// 1) 把 Counter 作为服务提供出去
await root.plugin(Counter)

// 2) 另一个插件使用 Counter 服务
//    关键点：消费方必须声明 inject，否则 Cordis 不允许通过 ctx.counter 访问服务。
//    inject 的作用：① 声明「我依赖 counter 服务」；② 决定插件的激活顺序（依赖先就绪）；
//    ③ 若服务缺失或尚未就绪，严格模式下会直接报错，避免隐蔽的运行时问题。
function consumeCounter(ctx: Context) {
  // 方式一：通过 ctx.get 显式获取（内部也是走代理解析）
  const c1 = ctx.get('counter') as Counter
  console.log('方式一 ctx.get:', c1.value)

  // 方式二：通过类型增强后的属性直接访问（更顺手，前提是已声明 inject）
  console.log('方式二 ctx.counter:', ctx.counter.value)

  ctx.on('count', () => console.log('当前计数:', ctx.counter.inc()))
}
consumeCounter.inject = ['counter']

await root.plugin(consumeCounter)

root.emit('count')
root.emit('count')
