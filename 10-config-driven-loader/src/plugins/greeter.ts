// 插件一：问候插件
// 演示插件如何接收「来自清单的配置」
import { Context } from 'cordis'

export default function greeter(ctx: Context, config: { prefix: string }) {
  ctx.on('ready', () => {
    console.log(`[greeter] ${config.prefix}，来自配置驱动的插件`)
  })
}
