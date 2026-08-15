// Cordis 入门第 12 课：综合实战 —— 定时任务调度器
// 把前面所有知识串起来：服务(09)、注入(06)、事件(03)、副作用与生命周期(04)。
// 我们要写一个「调度器服务」，插件可以向它注册定时任务；
// 服务卸载时，所有定时器自动清理（生命周期闭环）。
//
// 运行：npm install && npm start

import { Context, Service } from 'cordis'

declare module 'cordis' {
  interface Context {
    scheduler: SchedulerService
  }
}

// 1) 调度器服务：注册 / 取消定时任务，并在卸载时自动清理
class SchedulerService extends Service {
  private timers = new Map<string, ReturnType<typeof setInterval>>()
  private tasks = new Map<string, () => void>()

  constructor(ctx: Context) {
    super(ctx, 'scheduler')

    // 生命周期：服务所在的 fiber 被卸载时，effect 的清理函数自动执行，
    // 把所有还在跑的定时器停掉——这就是「副作用的自动回收」。
    ctx.effect(() => {
      return () => this.stopAll()
    })
  }

  // 注册一个任务：每 intervalMs 毫秒执行一次 task
  schedule(name: string, intervalMs: number, task: () => void) {
    this.cancel(name)
    this.tasks.set(name, task)
    const timer = setInterval(() => {
      task()
      this.ctx.emit('tick', name) // 通过事件广播，方便其它插件监听
    }, intervalMs)
    this.timers.set(name, timer)
    console.log(`[scheduler] 已注册任务 "${name}"，间隔 ${intervalMs}ms`)
  }

  cancel(name: string) {
    const t = this.timers.get(name)
    if (t) {
      clearInterval(t)
      this.timers.delete(name)
      this.tasks.delete(name)
    }
  }

  stopAll() {
    for (const t of this.timers.values()) clearInterval(t)
    this.timers.clear()
    this.tasks.clear()
    console.log('[scheduler] 所有任务已停止（定时器已清理）')
  }
}

// 2) 插件 A：注册一个心跳任务（声明注入 scheduler 服务）
function heartbeat(ctx: Context) {
  ctx.scheduler.schedule('heartbeat', 500, () => {
    console.log(`[${new Date().toISOString()}] 心跳正常`)
  })
}
heartbeat.inject = ['scheduler']

// 3) 插件 B：监听 tick 事件，做统一日志（无需注入，纯事件消费者）
function tickLogger(ctx: Context) {
  ctx.on('tick', (name: string) => {
    console.log(`[tick-logger] 任务 "${name}" 触发了一次`)
  })
}

// 4) 宿主：组装并运行，最后演示生命周期清理
async function main() {
  const root = new Context()

  // 保存服务的 fiber，便于之后卸载它
  const svc = await root.plugin(SchedulerService)
  await root.plugin(heartbeat)
  await root.plugin(tickLogger)

  // 跑约 1.6 秒，期间会看到多次心跳与 tick 日志
  await new Promise((r) => setTimeout(r, 1600))

  console.log('--- 即将卸载 scheduler 服务，验证定时器被自动清理 ---')
  await svc.dispose() // 触发 effect 清理 → stopAll()

  // 再等一会儿：如果不再出现「心跳」，说明清理成功
  await new Promise((r) => setTimeout(r, 700))
  console.log('程序结束')
}

main()
