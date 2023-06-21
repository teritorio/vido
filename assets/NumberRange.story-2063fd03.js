import { as as _export_sfc, at as defineComponent, au as resolveComponent, av as createBlock, aw as withCtx, ax as openBlock, ay as createElementBlock, az as renderList, aA as Fragment, aB as createVNode, aX as mergeProps, __tla as __tla_0 } from "./vendor-ec6df5a6.js";
import { N as NumberRange, __tla as __tla_1 } from "./NumberRange-912c1322.js";
import { a as FilterValueNumberRange } from "./types-filters-1e0221da.js";
let NumberRange_story;
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
    __name: "NumberRange.story",
    setup(__props, { expose }) {
      expose();
      const def = {
        type: "number_range",
        property: "string",
        name: {
          fr: "plop"
        },
        min: 20,
        max: 120
      };
      const filter = new FilterValueNumberRange(def);
      filter.filterValueMin = 50;
      filter.filterValueMax = 70;
      const defaultProps = {
        filter
      };
      const props = {
        Default: {
          ...defaultProps
        }
      };
      const __returned__ = {
        def,
        filter,
        defaultProps,
        props,
        NumberRange
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
      title: "Filters/NumberRange"
    }, {
      default: withCtx(() => [
        (openBlock(), createElementBlock(Fragment, null, renderList($setup.props, (p, name) => {
          return createVNode(_component_Variant, {
            key: name,
            title: name.replace(/([A-Z])/g, " $1").trim()
          }, {
            default: withCtx(() => [
              createVNode($setup["NumberRange"], mergeProps(p, {
                class: "v-locale--is-ltr"
              }), null, 16)
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
  _sfc_main.__file = "components/Filters/NumberRange.story.vue";
  NumberRange_story = _export_sfc(_sfc_main, [
    [
      "render",
      _sfc_render
    ],
    [
      "__file",
      "/home/runner/work/vido/vido/components/Filters/NumberRange.story.vue"
    ]
  ]);
});
export {
  __tla,
  NumberRange_story as default
};
