// Cordis 入门第 07 课：隔离（isolate）与拦截（intercept）
// 目标：理解如何在「子树」中提供互不干扰的同名服务，以及如何覆盖服务配置。
//
// 运行步骤：
//   npm install
//   npm start

import { Context, Service } from 'cordis'

// 一个最小化的 StandardSchema v1 配置对象：用于校验与合并服务配置。
// 真正的项目里通常用 schemastery / zod 等库生成，这里手写以展示结构。
const GreeterConfig = {
  '~standard': {
    version: 1,
    vendor: 'tutorial',
    validate(v: any) {
      return { value: { prefix: v?.prefix ?? '你好，' } }
    },
  },
  // merge 决定多份配置如何合并（这里用浅合并）
  merge(...configs: any[]) {
    return Object.assign({}, ...configs)
  },
}

declare module 'cordis' {
  interface Context {
    greeter: Greeter
  }
}

class Greeter extends Service {
  // 声明本服务的配置 schema（可选，但推荐）
  static Config = GreeterConfig
  private config: { prefix: string }

  constructor(ctx: Context, config: any) {
    super(ctx, 'greeter')
    // 通过 Service 的标准配置解析方法，把「框架校验后的 config」作为 base，
    // 再合并「当前子树中的 intercept 覆盖」，得到最终生效配置。
    this.config = this[Service.resolveConfig](config)
  }

  hello(name: string): string {
    return this.config.prefix + name
  }
}

const root = new Context()
await root.plugin(Greeter)
console.log('root :', root.greeter.hello('世界')) // 你好，世界

// isolate('greeter') 让 dev 子树拥有「独立的 greeter 实例」；
// intercept('greeter', {...}) 在该子树中覆盖 greeter 的配置。
const dev = root.isolate('greeter').intercept('greeter', { prefix: 'Hi ' })
await dev.plugin(Greeter)
console.log('dev  :', dev.greeter.hello('世界')) // Hi 世界
console.log('root 不变:', root.greeter.hello('世界')) // 你好，世界

// 纯隔离：两个互不干扰的同名服务实例
const a = root.isolate('tag').plugin((ctx) => ctx.provide('tag', 'A'))
const b = root.isolate('tag').plugin((ctx) => ctx.provide('tag', 'B'))
await a
await b
// 根上下文看不到被隔离的 'tag'（它只存在于各自子树）
console.log('根上下文看不到被隔离的 tag:', root.get('tag', false)) // undefined
