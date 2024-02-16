import ReactDOM from 'react-dom';
import React, { useEffect, useState } from 'react';
import { Loading, Shell, Search, Nav } from '@alifd/next';
import mergeWith from 'lodash/mergeWith';
import isArray from 'lodash/isArray';
import { buildComponents, assetBundle, AssetLevel, AssetLoader } from '@alilc/lowcode-utils';
import ReactRenderer from '@alilc/lowcode-react-renderer';
import { injectComponents } from '@alilc/lowcode-plugin-inject';
import appHelper from './appHelper';
import { getProjectSchemaFromLocalStorage, getPackagesFromLocalStorage, getPreviewLocale, setPreviewLocale, getResourceListFromLocalStorage } from './services/mockService';
import { getScenarioName } from './common';

let isInit = false;

function customizer(objValue: [], srcValue: []) {
  if (isArray(objValue)) {
    return objValue.concat(srcValue || []);
  }
}

const SamplePreview = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({});
  const [page, setPage] = useState<any>({});
  const scenarioName = getScenarioName();

  const loadPage = async (id: string) => {
    setLoading(true);
    const packages: any[] = await getPackagesFromLocalStorage(scenarioName, id);
    const projectSchema = await getProjectSchemaFromLocalStorage(scenarioName, id);

    const {
      componentsMap: componentsMapArray,
      componentsTree,
      i18n,
      dataSource: projectDataSource,
    } = projectSchema;

    const componentsMap: any = {};
    componentsMapArray.forEach((component: any) => {
      componentsMap[component.componentName] = component;
    });

    const schema = componentsTree[0];
    const libraryMap: any = {};
    const libraryAsset: any[] = [];
    packages.forEach(({ package: _package, library, urls, renderUrls }) => {
      libraryMap[_package] = library;
      if (renderUrls) {
        libraryAsset.push(renderUrls);
      } else if (urls) {
        libraryAsset.push(urls);
      }
    });

    // const vendors = [assetBundle(libraryAsset, AssetLevel.Library)];

    // TODO asset may cause pollution
    const assetLoader = new AssetLoader();
    await assetLoader.load(libraryAsset);
    const components = await injectComponents(buildComponents(libraryMap, componentsMap));
    const dataSource = mergeWith(schema.dataSource, projectDataSource, customizer)

    setPage({
      id,
      schema,
      components,
      dataSource,
      i18n
    });

    setLoading(false);
  }

  async function init() {
    if (isInit) {
      return;
    }
    
    isInit = true;
    const resourceList = await getResourceListFromLocalStorage(scenarioName);    
    const id = resourceList?.[0].id;
    
    setData({
      activeNav: id,
      resourceList
    });

    await loadPage(id);
  }

  if (! page.id) {
    init();
    return <Loading fullScreen />;
  }

  const currentLocale = getPreviewLocale(getScenarioName());

  if (!(window as any).setPreviewLocale) {
    // for demo use only, can use this in console to switch language for i18n test
    // 在控制台 window.setPreviewLocale('en-US') 或 window.setPreviewLocale('zh-CN') 查看切换效果
    (window as any).setPreviewLocale = (locale:string) => setPreviewLocale(getScenarioName(), locale);
  }

  // @ts-ignore
  appHelper.utils.loadPage = loadPage;

  if (page.id === 'index') {
    return <>
      <ReactRenderer
        key={page.id}
        className="lowcode-plugin-sample-preview-content"
        schema={{
          ...page.schema
        }}
        components={page.components}
        locale={currentLocale}
        messages={page.i18n}
        appHelper={appHelper}
      />
    </>
  }

  return (
    <div className="lowcode-plugin-sample-preview">
      <Shell
        className={"iframe-hack"}
        device="desktop"
        style={{ border: "1px solid #eee" }}
      >
        <Shell.Branding>
          <div className="rectangular"></div>
          <span style={{ marginLeft: 10 }}>CMS 低代码平台</span>
        </Shell.Branding>
        <Shell.Navigation direction="hoz">
          <Search
            key="2"
            shape="simple"
            type="dark"
            palceholder="Search"
            style={{ width: "200px" }}
          />
        </Shell.Navigation>

        <Shell.Navigation>
          <Nav
            embeddable
            aria-label="global navigation"
            defaultSelectedKeys={[data.activeNav]}
          >
            {
              data?.resourceList?.filter(d => d.id !== 'index' ).map((d) => (
                <Nav.Item
                  key={d.id}
                  onClick={async () => {
                    await loadPage(d.id);
                  }}
                  icon="account"
                >{d.title}</Nav.Item>
              ))
            }
          </Nav>
        </Shell.Navigation>
        <Shell.Content>
          <div style={{ minHeight: '100vh', background: "#fff" }}>
            {
              loading ? <div style={{ padding: "100px" }}><Loading /></div> : 
              <ReactRenderer
                key={page.id}
                className="lowcode-plugin-sample-preview-content"
                schema={{
                  ...page.schema,
                  // dataSource: mergeWith(schema.dataSource, projectDataSource, customizer),
                }}
                components={page.components}
                locale={currentLocale}
                messages={page.i18n}
                appHelper={appHelper}
              />
            }
          </div>
        </Shell.Content>
      </Shell>
    </div>
  );
};

ReactDOM.render(<SamplePreview />, document.getElementById('ice-container'));
