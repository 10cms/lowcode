import { RuntimeOptionsConfig } from '@alilc/lowcode-types';
import axios, { AxiosRequestConfig } from 'axios';
import { getScenarioName } from './common';
export function createAxiosFetchHandler(config?: Record<string, unknown>) {
  return async function(options: RuntimeOptionsConfig) {
    console.log({ options, config })
    const url = location.port ? 'http://localhost:3000' + options.uri : options.uri;
    // const url = options.uri.replace('http://localhost:3000', '/api');

    const requestConfig: AxiosRequestConfig = {
      ...options,
      url,
      method: options.method as AxiosRequestConfig['method'],
      data: options.params,
      headers: options.headers as AxiosRequestConfig['headers'],
      ...config,
    };

    try {
      return await axios(requestConfig);
    } catch (exception: any) {
      throw exception.response.data;
    }
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
    projectSlug: getScenarioName()
  }
};
export default appHelper;