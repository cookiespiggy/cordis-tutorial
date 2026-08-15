// Cordis 入门第 06 课：依赖注入（inject）
// 目标：理解插件如何声明「我依赖某个服务」，以及 Cordis 如何据此管理激活与生命周期。
//
// 运行步骤：
//   npm install
//   npm start

import { Context, Service } from 'cordis'

declare module 'cordis' {
  interface Context {
    db: Database
  }
}

// 一个简单的数据库服务
class Database extends Service {
  constructor(ctx: Context) {
    super(ctx, 'db')
  }
  query(sql: string): string {
    return `查询结果: ${sql}`
  }
}

// 消费者插件：通过 static inject 声明「我依赖 db 服务」
// 效果：本插件只会在 db 处于 ACTIVE 时才激活；
//       若 db 被卸载，本插件也会随之暂停（依赖驱动的生命周期）。
class Reporter {
  static inject = ['db']
  constructor(ctx: Context) {
    ctx.on('report', () => console.log(ctx.db.query('SELECT 1')))
  }
}

const root = new Context()

await root.plugin(Database)
await root.plugin(Reporter)

// db 可用，因此 Reporter 已激活，事件正常响应
root.emit('report')

// 在任意上下文里获取服务：非严格（第二个参数 false）拿不到就返回 undefined，不抛错
console.log('非严格获取 db:', root.get('db', false)?.query('SELECT 2'))

// 严格获取（默认 true）一个「从未提供」的属性会抛错
try {
  root.get('neverProvided')
} catch (e) {
  console.log('严格获取未提供的属性报错:', (e as Error).message)
}
