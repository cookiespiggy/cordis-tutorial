// Cordis 入门第 02 课：插件的三种形态与配置
// 目标：掌握 Cordis 支持的三类插件写法，以及通过 config 向插件传参。
//
// 运行步骤：
//   npm install
//   npm start

import { Context } from 'cordis'

const root = new Context()

// 形式一：函数插件（最常用、最轻量）
//   直接把逻辑写在函数体里，config 是第二个参数。
function fnPlugin(ctx: Context, config: { prefix: string }) {
  ctx.on('run', () => console.log(`${config.prefix} 来自函数插件`))
}

// 形式二：类插件（适合有内部状态 / 方法的插件）
//   构造函数即插件体，this 可保存实例状态。
class ClassPlugin {
  private count = 0
  constructor(ctx: Context, config: { prefix: string }) {
    ctx.on('run', () => {
      this.count += 1
      console.log(`${config.prefix} 来自类插件（第 ${this.count} 次）`)
    })
  }
}

// 形式三：对象插件（带 apply 方法的普通对象）
//   当插件需要携带额外静态属性，或想以对象字面量表达时使用。
const objPlugin = {
  apply(ctx: Context, config: { prefix: string }) {
    ctx.on('run', () => console.log(`${config.prefix} 来自对象插件`))
  },
}

// 注册插件时通过第二个参数传入 config
await root.plugin(fnPlugin, { prefix: '【A】' })
await root.plugin(ClassPlugin, { prefix: '【B】' })
await root.plugin(objPlugin, { prefix: '【C】' })

// 触发事件，观察三种形态的表现
root.emit('run')
root.emit('run')
