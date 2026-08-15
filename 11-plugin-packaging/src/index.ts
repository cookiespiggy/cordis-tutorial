// Cordis 入门第 11 课：把插件打包成可发布的 npm 包
// 本文件就是一个「插件单元」的完整示例，可直接作为 npm 包的入口。
//
// 运行（演示宿主如何使用本插件）：npm install && npm start

import { Context } from 'cordis'

// ============ 插件定义（发布后，这就是包的导出入口）============

// 插件可携带自己的配置 Schema（可选，但推荐——便于校验与合并）
export const Config = {
  '~standard': {
    version: 1,
    vendor: 'tutorial',
    validate(v: any) {
      return { value: { topic: v?.topic ?? '默认频道' } }
    },
  },
  merge(...configs: any[]) {
    return Object.assign({}, ...configs)
  },
}

export interface EchoConfig {
  topic: string
}

// 写法一：函数插件（最常见、最灵活）
export default function echoPlugin(ctx: Context, config: EchoConfig) {
  ctx.on('message', (text: string) => {
    console.log(`[${config.topic}] 收到消息: ${text}`)
  })
}
// 把配置 Schema 挂到插件上，Cordis 会在注册时用它校验 config
;(echoPlugin as any).Config = Config

// ============ 模拟「宿主应用」如何使用本插件 ============
// 真实场景：宿主项目 `import echoPlugin from 'my-cordis-plugin'`
async function main() {
  const root = new Context()
  await root.plugin(echoPlugin, { topic: '客服' })
  root.emit('message', '你好，在吗？')
}

main()
