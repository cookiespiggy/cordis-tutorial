// 插件二：日志插件（不接收配置）
// 演示「无配置插件」也能被清单统一管理
import { Context } from 'cordis'

export default function logger(ctx: Context) {
  ctx.on('ready', () => {
    console.log('[logger] 应用启动完成，记录一条启动日志')
  })
}
