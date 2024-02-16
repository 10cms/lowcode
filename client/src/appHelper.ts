import { RuntimeOptionsConfig } from '@alilc/lowcode-types';
import axios, { AxiosRequestConfig } from 'axios';
export function createAxiosFetchHandler(config?: Record<string, unknown>) {
  return async function(options: RuntimeOptionsConfig) {
    console.log({ options, config })
    const url = location.port ? 'http://localhost:3000' + options.uri : options.uri;

    const requestConfig: AxiosRequestConfig = {
      ...options,
      url,
      method: options.method as AxiosRequestConfig['method'],
      data: options.params,
      headers: options.headers as AxiosRequestConfig['headers'],
      ...config,
    };
    const response = await axios(requestConfig);
    return response;
  };
}

const appHelper = {
  requestHandlersMap: {
    fetch: createAxiosFetchHandler()
  },
  utils: {
    demoUtil: (...params: any[]) => { console.log(`this is a demoUtil with params ${params}`)}
  },
  constants: {
    ConstantA: 'ConstantA',
    ConstantB: 'ConstantB'
  }
};
export default appHelper;