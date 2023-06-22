import { as as _export_sfc, at as defineComponent, au as resolveComponent, av as createBlock, aw as withCtx, ax as openBlock, ay as createElementBlock, az as renderList, aA as Fragment, aB as createVNode, aC as normalizeProps, aD as guardReactiveProps, __tla as __tla_0 } from "./vendor-cc850437.js";
import { D as DateRange, __tla as __tla_1 } from "./DateRange-b424399d.js";
let DateRange_story;
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
    __name: "DateRange.story",
    setup(__props, { expose }) {
      expose();
      const defaultProps = {
        start: "01/01/01",
        end: "02/02/02"
      };
      const props = {
        Default: {
          ...defaultProps
        },
        DefaultStart: {
          ...defaultProps,
          end: void 0
        },
        DefaultEnd: {
          ...defaultProps,
          start: void 0
        },
        DefaultSame: {
          ...defaultProps,
          end: defaultProps.start
        }
      };
      const __returned__ = {
        defaultProps,
        props,
        DateRange
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
      title: "Fields/DateRange"
    }, {
      default: withCtx(() => [
        (openBlock(), createElementBlock(Fragment, null, renderList($setup.props, (p, name) => {
          return createVNode(_component_Variant, {
            key: name,
            title: name.replace(/([A-Z])/g, " $1").trim()
          }, {
            default: withCtx(() => [
              createVNode($setup["DateRange"], normalizeProps(guardReactiveProps(p)), null, 16)
            ]),
            _: 2
          }, 1032, [
            "title"
          ]);
        }), 64))
      ]),
      _: 1
    });
  }
  _sfc_main.__file = "components/Fields/DateRange.story.vue";
  DateRange_story = _export_sfc(_sfc_main, [
    [
      "render",
      _sfc_render
    ],
    [
      "__file",
      "/home/runner/work/vido/vido/components/Fields/DateRange.story.vue"
    ]
  ]);
});
export {
  __tla,
  DateRange_story as default
};
