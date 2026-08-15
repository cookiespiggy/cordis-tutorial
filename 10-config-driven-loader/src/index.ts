// Cordis 入门第 10 课：配置驱动的插件加载器（可插拔架构）
// 目标：把「用哪些插件、各自什么配置」从代码里抽出来，放进外部清单文件，
//       主程序读清单 → 动态 import 插件 → 逐个注册。实现运行时可插拔。
//
// 运行：npm install && npm start

import { Context } from 'cordis'
import { readFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

// 当前文件所在目录（ESM 下没有 __dirname，需这样取）
const here = dirname(fileURLToPath(import.meta.url))

// 1) 读取插件清单（一份普通的 JSON 配置）
interface PluginEntry {
  name: string
  plugin: string          // 插件文件路径（相对本文件）
  config?: Record<string, any>
  enabled?: boolean       // 缺省视为启用
}
const manifest: PluginEntry[] = JSON.parse(
  readFileSync(resolve(here, 'config.json'), 'utf-8')
)

const root = new Context()

// 2) 遍历清单，动态加载并注册每个插件
for (const entry of manifest) {
  if (entry.enabled === false) {
    console.log(`[loader] 跳过未启用的插件: ${entry.name}`)
    continue
  }
  // 把相对路径转成绝对 file:// URL，tsx 会在运行时编译 .ts 文件
  const url = pathToFileURL(resolve(here, entry.plugin)).href
  const mod = await import(url)
  const plugin = mod.default
  await root.plugin(plugin, entry.config ?? {})
  console.log(`[loader] 已加载插件: ${entry.name}`)
}

// 3) 触发一个事件，验证插件确实生效了
root.emit('ready')

// 给插件一点输出时间
await new Promise((r) => setTimeout(r, 100))

// 说明：Cordis 官方也提供了 @cordisjs/plugin-loader + @cordisjs/plugin-include，
// 支持 YAML/JS 配置、热重载、依赖排序等。本课的手动加载器更轻、更透明，
// 适合理解「配置驱动」的本质；生产项目可直接用官方 loader。
