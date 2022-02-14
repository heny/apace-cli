import { ProxyList } from './proxy'

interface IConfig {
  proxy: ProxyList
}

export default {
  proxy: [
    ['/api', 'https://api.gugudata.com'],
    // ...[]
  ],
} as IConfig
