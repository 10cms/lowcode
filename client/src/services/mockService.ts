import { material, project } from '@alilc/lowcode-engine';
import { filterPackages } from '@alilc/lowcode-plugin-inject'
import { Message, Dialog } from '@alifd/next';
import { IPublicTypeProjectSchema, IPublicEnumTransformStage, IPublicModelPluginContext } from '@alilc/lowcode-types';
import DefaultPageSchema from './defaultPageSchema.json';
import DefaultI18nSchema from './defaultI18nSchema.json';
import { getConfig, setConfig } from './api';

const generateProjectSchema = (pageSchema: any, i18nSchema: any): IPublicTypeProjectSchema => {
  return {
    componentsTree: [pageSchema],
    componentsMap: material.componentsMap as any,
    version: '1.0.0',
    i18n: i18nSchema,
  };
}


export const saveSchema = async (scenarioName: string = 'unknown', id: string, ctx: IPublicModelPluginContext) => {
  await setProjectSchemaToLocalStorage(scenarioName, id, ctx);
  await setPackagesToLocalStorage(scenarioName, id, ctx);
  Message.success('成功保存到本地');
};

export const resetSchema = async (scenarioName: string = 'unknown') => {
  try {
    await new Promise<void>((resolve, reject) => {
      Dialog.confirm({
        content: '确定要重置吗？您所有的修改都将消失！',
        onOk: () => {
          resolve();
        },
        onCancel: () => {
          reject()
        },
      })
    })
  } catch(err) {
    return;
  }
  const defaultSchema = generateProjectSchema(DefaultPageSchema, DefaultI18nSchema);

  project.importSchema(defaultSchema as any);
  project.simulatorHost?.rerender();

  // setProjectSchemaToLocalStorage(scenarioName);
  // await setPackagesToLocalStorage(scenarioName);
  Message.success('成功重置页面');
}

const getLSName = (scenarioName: string, id: string, ns: string = 'projectSchema') => `${scenarioName}:${id}:${ns}`;

const getResourceName = (scenarioName: string, ns: string = 'resourceList') => `${scenarioName}:${ns}`;

export const setResourceListToLocalStorage = async (scenarioName: string, list: any) => {
  if (!scenarioName) {
    console.error('scenarioName is required!');
    return;
  }

  await setConfig('resourceList', list)

  window.localStorage.setItem(
    getResourceName(scenarioName),
    JSON.stringify(list)
  );
}

export const getResourceListFromLocalStorage = async (scenarioName: string) => {
  if (!scenarioName) {
    console.error('scenarioName is required!');
    return;
  }

  const config = await getConfig('resourceList')
  if (config) {
    return config
  }

  return JSON.parse(window.localStorage.getItem(getResourceName(scenarioName)) || 
    `[{"title":"首页","slug":"index","id": "index"}]`);
}

export const getProjectSchemaFromLocalStorage = async (scenarioName: string, id: string) => {
  console.log('getProjectSchemaFromLocalStorage', scenarioName)
  if (!scenarioName) {
    console.error('scenarioName is required!');
    return;
  }

  const schema = await getConfig(`${id}:projectSchema`)
  if (schema) {
    console.log({ projectSchema: schema })
    return schema
  }

  const localValue = window.localStorage.getItem(getLSName(scenarioName, id));
  if (localValue) {
    return JSON.parse(localValue);
  }
  return undefined;
}

const setProjectSchemaToLocalStorage = async (scenarioName: string, id: string, ctx: IPublicModelPluginContext) => {
  if (!scenarioName) {
    console.error('scenarioName is required!');
    return;
  }

  const configValue = ctx.project.exportSchema(IPublicEnumTransformStage.Save)
  await setConfig(`${id}:projectSchema`, configValue)
  
  window.localStorage.setItem(
    getLSName(scenarioName, id),
    JSON.stringify(configValue)
  );
}

const setPackagesToLocalStorage = async (scenarioName: string, id: string, ctx: IPublicModelPluginContext) => {
  if (!scenarioName) {
    console.error('scenarioName is required!');
    return;
  }

  const packages = await filterPackages(ctx.material.getAssets().packages);
  await setConfig(`${id}:packages`, packages)

  window.localStorage.setItem(
    getLSName(scenarioName, id, 'packages'),
    JSON.stringify(packages),
  );
}

export const getPackagesFromLocalStorage = async (scenarioName: string, id: string) => {
  if (!scenarioName) {
    console.error('scenarioName is required!');
    return;
  }

  const schema = await getConfig(`${id}:packages`)
  if (schema) {
    return schema
  }

  return JSON.parse(window.localStorage.getItem(getLSName(scenarioName, id, 'packages')) || '{}');
}

export const getProjectSchema = async (scenarioName: string = 'unknown', id: string) : Promise<IPublicTypeProjectSchema> => {
  const pageSchema = await getPageSchema(scenarioName, id);
  return generateProjectSchema(pageSchema, DefaultI18nSchema);
};

export const getPageSchema = async (scenarioName: string = 'unknown', id: string) => {
  console.log("getPageSchema")
  const pageSchema = (await getProjectSchemaFromLocalStorage(scenarioName, id))?.componentsTree?.[0];
  if (pageSchema) {
    return pageSchema;
  }

  console.log({ pageSchema })
  return DefaultPageSchema;
};

export const getPreviewLocale = (scenarioName: string) => {
  const key = getLSName(scenarioName, 'previewLocale');
  return window.localStorage.getItem(key) || 'zh-CN';
}

export const setPreviewLocale = (scenarioName: string, locale: string) => {
  const key = getLSName(scenarioName, 'previewLocale');
  window.localStorage.setItem(key, locale || 'zh-CN');
  window.location.reload();
}
