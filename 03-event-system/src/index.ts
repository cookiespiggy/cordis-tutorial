// Cordis 入门第 03 课：事件系统
// 目标：掌握 Cordis 的事件分发模式——on/emit、once、parallel、serial、bail、waterfall。
//
// 运行步骤：
//   npm install
//   npm start

import { Context } from 'cordis'

const root = new Context()

// 把所有监听器登记在同一个插件里（便于集中观察）
await root.plugin((ctx: Context) => {
  // 1) on / emit：最常用的「发布-订阅」，emit 时同步依次执行所有监听器
  ctx.on('broadcast', (msg: string) => console.log('[broadcast]', msg))

  // 2) once：只生效一次，第二次触发会被自动移除
  ctx.once('tick', () => console.log('[tick] once 监听器只执行这一次'))

  // 3) parallel：并发执行（监听器返回 Promise），用 await 等待全部完成
  ctx.on('parallel', async (n: number) => {
    await new Promise(r => setTimeout(r, 10))
    console.log('[parallel] 任务', n, '完成')
  })

  // 4) serial：串行执行；某个监听器返回「非空且非 false」的值会短路，后续不再执行
  ctx.on('serial', (n: number) => {
    console.log('[serial] 处理', n)
    if (n === 2) return '在 n=2 处短路' // 返回有效值 -> 短路
  })
  ctx.on('serial', (n: number) => {
    console.log('[serial] 处理', n, '（这一条在短路后不会执行）')
  })

  // 5) bail：取「第一个有效返回值」，其余监听器被忽略
  ctx.on('bail', () => undefined) // 返回空，不算
  ctx.on('bail', () => '第一个有效结果') // 命中，bail 直接返回它
  ctx.on('bail', () => '这个结果不会被采用')

  // 6) waterfall：洋葱 / 中间件模型。
  //    监听器形如 (payload, next) => { 修改 payload; next() }，
  //    通过「共享的可变对象」在监听器之间传递数据（必须调用 next() 才会继续下一个）。
  ctx.on('waterfall', (box: { value: number }, next: () => void) => {
    box.value += 1
    next()
  })
  ctx.on('waterfall', (box: { value: number }, next: () => void) => {
    box.value *= 2
    next()
  })
})

// --- 触发各类事件 ---

root.emit('broadcast', 'hello')

root.emit('tick')
root.emit('tick') // 第二次：once 已失效，无输出

await root.parallel('parallel', 1)
await root.parallel('parallel', 2)

console.log('[serial] n=1 结果 =', await root.serial('serial', 1))
console.log('[serial] n=2 结果 =', await root.serial('serial', 2))

console.log('[bail] 结果 =', root.bail('bail'))
// waterfall 通过共享对象 box 传递数据：(5 + 1) * 2 = 12
const box = { value: 5 }
root.waterfall('waterfall', box, () => {})
console.log('[waterfall] 5 ->', box.value, '(即 (5+1)*2 = 12)')
