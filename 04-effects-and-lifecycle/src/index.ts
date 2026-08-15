// Cordis 入门第 04 课：副作用（effect）与插件生命周期
// 目标：理解 effect 如何登记「需要清理的资源」，以及插件 fiber 的激活 / 卸载过程。
//
// 运行步骤：
//   npm install
//   npm start

import { Context } from 'cordis'

// FiberState 是一个 const enum（运行时被擦除），这里用同序数组把数值还原成可读状态。
const STATE_LABEL = ['PENDING', 'LOADING', 'ACTIVE', 'FAILED', 'DISPOSED', 'UNLOADING']

const root = new Context()

// 注册一个插件，返回它对应的 fiber（生命周期单元）
const fiber = root.plugin((ctx: Context) => {
  console.log('插件体执行：此时 fiber 即将进入 ACTIVE')

  // effect：登记一个副作用及其清理逻辑。
  // 返回的「清理函数」会在插件卸载 / 上下文销毁时被自动调用，且按「逆序」释放。
  ctx.effect(() => {
    console.log('  [effect A] 建立资源')
    return () => console.log('  [effect A] 释放资源')
  })

  // effect 也支持「生成器」写法：可以多次 yield 清理函数，逐个逆序释放。
  ctx.effect(function* () {
    console.log('  [effect B] 建立资源 B1')
    yield () => console.log('  [effect B] 释放资源 B1')
    console.log('  [effect B] 建立资源 B2')
    yield () => console.log('  [effect B] 释放资源 B2')
  })
})

// 等待插件激活（effect 在这里才会真正执行）
await fiber
console.log('激活后状态:', STATE_LABEL[fiber.state], `(${fiber.state})`)

// 卸载插件：所有 effect 的清理函数被逆序调用（B2 -> B1 -> A）
await fiber.dispose()
console.log('卸载后状态:', STATE_LABEL[fiber.state], `(${fiber.state})`)
