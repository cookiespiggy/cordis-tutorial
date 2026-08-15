// Cordis 入门第 01 课：Context 与第一个插件
// 目标：理解「根上下文（root Context）+ 插件（plugin）」的最小运行模型。
//
// 运行步骤：
//   npm install
//   npm start

import { Context } from 'cordis'

// 1) 创建一个根上下文（Context）。
//    Context 是 Cordis 的核心：所有插件、服务、事件都挂载在它（及其派生上下文）之上。
//    它本质上是一个带代理（Proxy）的对象，访问未注入的属性会按需失败或回溯。
const root = new Context()

// 2) 编写一个插件。
//    插件的本质是一个函数 (ctx, config) => void。
//    这里的 ctx 是「该插件所在的子上下文」，事件、服务、副作用都注册在它上面。
function helloPlugin(ctx: Context) {
  // 在插件上下文上监听名为 'hello' 的事件
  ctx.on('hello', (name: string) => {
    console.log(`你好，${name}！`)
  })
}

// 3) 注册插件。
//    ctx.plugin() 会为插件创建一个 fiber（生命周期单元），并在其变为 ACTIVE 后才真正执行插件体。
//    它返回的类型同时是 PromiseLike<Fiber>，因此可以用 await 等待它就绪。
//    （重要：因为插件是异步激活的，若不等它就绪，下面的 emit 可能早于监听器注册。）
await root.plugin(helloPlugin)

// 4) 触发事件。此时监听器已经注册，控制台会打印「你好，世界！」
root.emit('hello', '世界')
