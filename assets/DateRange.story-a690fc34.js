import { as as _export_sfc, at as defineComponent, au as resolveComponent, av as createBlock, aw as withCtx, ax as openBlock, ay as createElementBlock, az as renderList, aA as Fragment, aB as createVNode, aC as normalizeProps, aD as guardReactiveProps, __tla as __tla_0 } from "./vendor-ec6df5a6.js";
import { D as DateRange, __tla as __tla_1 } from "./DateRange-d8e1f878.js";
import { F as FilterValueDate } from "./types-filters-1e0221da.js";
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
      const def = {
        type: "date_range",
        property_begin: "begin",
        property_end: "end",
        name: {
          fr: "plop"
        }
      };
      const filter = new FilterValueDate(def);
      filter.filterValueBegin = "01/01/01";
      filter.filterValueEnd = "02/02/02";
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
      title: "Filters/DateRange"
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
  _sfc_main.__file = "components/Filters/DateRange.story.vue";
  DateRange_story = _export_sfc(_sfc_main, [
    [
      "render",
      _sfc_render
    ],
    [
      "__file",
      "/home/runner/work/vido/vido/components/Filters/DateRange.story.vue"
    ]
  ]);
});
export {
  __tla,
  DateRange_story as default
};
