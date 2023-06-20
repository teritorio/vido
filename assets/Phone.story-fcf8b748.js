import { as as _export_sfc, at as defineComponent, au as resolveComponent, av as createBlock, aw as withCtx, ax as openBlock, ay as createElementBlock, az as renderList, aA as Fragment, aV as ref, aG as createBaseVNode, aB as createVNode, aC as normalizeProps, aD as guardReactiveProps, __tla as __tla_0 } from "./vendor-bd688624.js";
import { P as Phone, __tla as __tla_1 } from "./Phone-ee9063e2.js";
let Phone_story;
let __tla = Promise.all([
  (() => {
    try {
      return __tla_0;
    } catch {
    }
  })(),
  (() => {
    try {
      return __tla_1;
    } catch {
    }
  })()
]).then(async () => {
  const _sfc_main = defineComponent({
    __name: "Phone.story",
    setup(__props, { expose }) {
      expose();
      const devices = {
        desktop: {
          smallScreen: false,
          touch: false,
          phone: false
        },
        mobile: {
          smallScreen: true,
          touch: true,
          phone: true
        }
      };
      function setupApp(device) {
        return ({ app, story, variant }) => {
          app.config.globalProperties.$device = ref(device);
        };
      }
      const defaultProps = {
        number: "+33676544"
      };
      const props = {
        Default: {
          ...defaultProps
        }
      };
      const __returned__ = {
        devices,
        setupApp,
        defaultProps,
        props,
        Phone
      };
      Object.defineProperty(__returned__, "__isScriptSetup", {
        enumerable: false,
        value: true
      });
      return __returned__;
    }
  });
  function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_Variant = resolveComponent("Variant");
    const _component_Story = resolveComponent("Story");
    return openBlock(), createBlock(_component_Story, {
      title: "Fields/Phone"
    }, {
      default: withCtx(() => [
        (openBlock(), createElementBlock(Fragment, null, renderList($setup.props, (p, name) => {
          return createBaseVNode("div", {
            key: name
          }, [
            (openBlock(), createElementBlock(Fragment, null, renderList($setup.devices, (device, id) => {
              return createBaseVNode("div", {
                key: id
              }, [
                createVNode(_component_Variant, {
                  title: `${name.replace(/([A-Z])/g, " $1").trim()} - ${id}`,
                  "setup-app": $setup.setupApp(device)
                }, {
                  default: withCtx(() => [
                    createVNode($setup["Phone"], normalizeProps(guardReactiveProps(p)), null, 16)
                  ]),
                  _: 2
                }, 1032, [
                  "title",
                  "setup-app"
                ])
              ]);
            }), 64))
          ]);
        }), 64))
      ]),
      _: 1
    });
  }
  _sfc_main.__file = "components/Fields/Phone.story.vue";
  Phone_story = _export_sfc(_sfc_main, [
    [
      "render",
      _sfc_render
    ],
    [
      "__file",
      "/home/runner/work/vido/vido/components/Fields/Phone.story.vue"
    ]
  ]);
});
export {
  __tla,
  Phone_story as default
};
