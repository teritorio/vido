import { aE as defineNuxtComponent, as as _export_sfc, ax as openBlock, ay as createElementBlock, aF as renderSlot, aG as createBaseVNode, aA as Fragment, aH as createTextVNode, aI as toDisplayString, aJ as createCommentVNode, __tla as __tla_0 } from "./vendor-ec6df5a6.js";
let DateRange, isDateRangeEmpty;
let __tla = Promise.all([
  (() => {
    try {
      return __tla_0;
    } catch {
    }
  })()
]).then(async () => {
  isDateRangeEmpty = function(properties) {
    return !("start" in properties) && !("end" in properties);
  };
  const _sfc_main = defineNuxtComponent({
    props: {
      start: {
        type: String,
        default: null
      },
      end: {
        type: String,
        default: null
      }
    }
  });
  function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
    return openBlock(), createElementBlock("div", null, [
      renderSlot(_ctx.$slots, "default"),
      createBaseVNode("span", null, [
        _ctx.start && _ctx.end && _ctx.start == _ctx.end ? (openBlock(), createElementBlock(Fragment, {
          key: 0
        }, [
          createTextVNode(toDisplayString(_ctx.$t("dateRange.on", {
            on: _ctx.$d(new Date(_ctx.start))
          })), 1)
        ], 64)) : _ctx.start && _ctx.end ? (openBlock(), createElementBlock(Fragment, {
          key: 1
        }, [
          createTextVNode(toDisplayString(_ctx.$t("dateRange.from_to", {
            from: _ctx.$d(new Date(_ctx.start)),
            to: _ctx.$d(new Date(_ctx.end)),
            duration: _ctx.$n((new Date(_ctx.end).getTime() - new Date(_ctx.start).getTime()) / 1e3 / 60 / 60 / 24)
          })), 1)
        ], 64)) : _ctx.start ? (openBlock(), createElementBlock(Fragment, {
          key: 2
        }, [
          createTextVNode(toDisplayString(_ctx.$t("dateRange.from", {
            from: _ctx.$d(new Date(_ctx.start))
          })), 1)
        ], 64)) : _ctx.end ? (openBlock(), createElementBlock(Fragment, {
          key: 3
        }, [
          createTextVNode(toDisplayString(_ctx.$t("dateRange.to", {
            to: _ctx.$d(new Date(_ctx.end))
          })), 1)
        ], 64)) : createCommentVNode("v-if", true)
      ])
    ]);
  }
  _sfc_main.__file = "components/Fields/DateRange.vue";
  DateRange = _export_sfc(_sfc_main, [
    [
      "render",
      _sfc_render
    ],
    [
      "__file",
      "/home/runner/work/vido/vido/components/Fields/DateRange.vue"
    ]
  ]);
});
export {
  DateRange as D,
  __tla,
  isDateRangeEmpty as i
};
