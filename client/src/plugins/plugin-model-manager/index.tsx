import { IPublicModelPluginContext } from '@alilc/lowcode-types';

function ModelManagerPlugin(ctx: IPublicModelPluginContext) {
  const {
    skeleton,
  } = ctx;
  return {
    init() {
      skeleton.add({
        name: 'modelManager',
        area: 'leftArea',
        type: 'PanelDock',
        props: {
          align: "left",
          icon: "shujuyuan",
          description: "模型管理",
        },
        panelProps: {
          floatable: true, // 是否可浮动
          height: 300,
          hideTitleBar: false,
          maxHeight: 800,
          maxWidth: 1200,
          title: "模型管理",
          width: 600,
        },
        content: <h1>Model Manager</h1>,
        contentProps: {
          ctx,
        },
      });

      // skeleton.add({
      //   type: 'Widget',
      //   name: 'modelManager',
      //   props: {
      //     width: 200,
      //   },
      //   index: -1,
      //   content: <h1>Model Manager</h1>,
      //   contentProps: {
      //     ctx,
      //   },
      // });
    }
  }
}

ModelManagerPlugin.pluginName = 'ModelManagerPlugin';

export default ModelManagerPlugin;