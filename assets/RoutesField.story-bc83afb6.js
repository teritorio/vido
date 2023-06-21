import { as as _export_sfc, at as defineComponent, au as resolveComponent, av as createBlock, aw as withCtx, ax as openBlock, ay as createElementBlock, az as renderList, aA as Fragment, aG as createBaseVNode, aB as createVNode, aX as mergeProps, __tla as __tla_0 } from "./vendor-ec6df5a6.js";
import { R as RoutesField, __tla as __tla_1 } from "./RoutesField-d87c8518.js";
import { P as PropertyTranslationsContextEnum, __tla as __tla_2 } from "./property-translations-fcaee93b.js";
let RoutesField_story;
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
  })(),
  (() => {
    try {
      return __tla_2;
    } catch {
    }
  })()
]).then(async () => {
  const _sfc_main = defineComponent({
    __name: "RoutesField.story",
    setup(__props, { expose }) {
      expose();
      const defaultProps = {
        context: PropertyTranslationsContextEnum.Details,
        properties: {
          metadata: {
            id: 0
          },
          "route:hiking:difficulty": "easy",
          "route:hiking:duration": 285,
          "route:hiking:length": 10.2,
          "route:mtb:difficulty": "easy",
          "route:mtb:duration": 90,
          "route:mtb:length": 10.2
        }
      };
      const props = {
        Default: {
          ...defaultProps
        },
        MissingFields: {
          ...defaultProps,
          field: {
            field: "route:gpx_trace"
          },
          properties: {
            metadata: {
              id: 0
            },
            "route:hiking:difficulty": "easy"
          }
        },
        MissingDifficulty: {
          ...defaultProps,
          field: {
            field: "route:gpx_trace"
          },
          properties: {
            metadata: {
              id: 0
            },
            "route:hiking:duration": 285,
            "route:hiking:length": 10.2
          }
        }
      };
      const __returned__ = {
        defaultProps,
        props,
        RoutesField,
        get PropertyTranslationsContextEnum() {
          return PropertyTranslationsContextEnum;
        }
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
      title: "Fields/Route"
    }, {
      default: withCtx(() => [
        (openBlock(), createElementBlock(Fragment, null, renderList($setup.props, (p, name) => {
          return createBaseVNode("div", {
            key: name
          }, [
            (openBlock(true), createElementBlock(Fragment, null, renderList([
              $setup.PropertyTranslationsContextEnum.Card,
              $setup.PropertyTranslationsContextEnum.Details
            ], (id) => {
              return openBlock(), createElementBlock("div", {
                key: id
              }, [
                createVNode(_component_Variant, {
                  title: `${name.replace(/([A-Z])/g, " $1").trim()} - ${id}`
                }, {
                  default: withCtx(() => [
                    createVNode($setup["RoutesField"], mergeProps(p, {
                      context: id
                    }), null, 16, [
                      "context"
                    ])
                  ]),
                  _: 2
                }, 1032, [
                  "title"
                ])
              ]);
            }), 128))
          ]);
        }), 64))
      ]),
      _: 1
    });
  }
  _sfc_main.__file = "components/Fields/RoutesField.story.vue";
  RoutesField_story = _export_sfc(_sfc_main, [
    [
      "render",
      _sfc_render
    ],
    [
      "__file",
      "/home/runner/work/vido/vido/components/Fields/RoutesField.story.vue"
    ]
  ]);
});
export {
  __tla,
  RoutesField_story as default
};
