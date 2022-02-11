import axios, { AxiosRequestConfig, Method, AxiosResponse } from 'axios'
// import { Loading, Message } from 'element-ui'; // 请求loading可以自已更换

// 新建一个实例, 避免全局axios被污染;
// 如果这里不是create创建的axios, 当axios被添加一次路由拦截器之后, 项目任意地方再次引入axios, 会同样使用该拦截器;
const service = axios.create({
  timeout: 10000, // 超时
  withCredentials: true, // 允许cookie跨域
  baseURL: '', // 配置请求host
})

// let loading = null;
// 配置请求
service.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    // loading = Loading.service({ text: '正在加载中....' });
    // config.headers.Authorization = localStorage['token']; // 给请求添加token
    return config
  },
  (error) => Promise.reject(error)
)

// 配置响应
service.interceptors.response.use(
  (response: AxiosResponse) => {
    // if (loading) loading.close();
    // ... 在这里处理统一code问题
    return response.data
  },
  (error) => {
    // if (loading) loading.close();
    // if (!error.response) {
    //   if (error.message.includes('timeout')) {
    //     Message.error('请求超时, 请检查网络是否连接正常');
    //   } else {
    //     Message.error('请求失败,请检查网络是否已连接');
    //   }
    //   return;
    // }
    return Promise.reject(error)
  }
)

export const getData = (
  url,
  data: Record<string, any> = {},
  method: Method = 'get',
  headers?
) => {
  let config: AxiosRequestConfig = {
    url,
    method,
    headers,
  }
  if (method.toLowerCase() === 'get' || method.toLowerCase() === 'delete') {
    // 处理get请求防止IE缓存
    if (!!window.ActiveXObject || 'ActiveXObject' in window) {
      data.t = new Date().getTime()
    }
    // 处理get请求的传参方式, get参数需要放在params下
    config.params = data
  } else {
    config.data = data
  }
  return service(config)
}

export default service
