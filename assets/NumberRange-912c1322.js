import { aE as defineNuxtComponent, a_ as VRangeSlider, aZ as index, as as _export_sfc, ax as openBlock, ay as createElementBlock, aB as createVNode, aS as normalizeClass, __tla as __tla_0 } from "./vendor-ec6df5a6.js";
let NumberRange;
let __tla = Promise.all([
  (() => {
    try {
      return __tla_0;
    } catch {
    }
  })()
]).then(async () => {
  const _sfc_main = defineNuxtComponent({
    components: {
      VRangeSlider
    },
    props: {
      filter: {
        type: Object,
        required: true
      }
    },
    emits: {
      change: (newFilter) => true
    },
    computed: {
      min() {
        return this.filter.def.min;
      },
      max() {
        return this.filter.def.max;
      },
      value() {
        return [
          this.filter.filterValueMin != null ? this.filter.filterValueMin : this.filter.def.min,
          this.filter.filterValueMax != null ? this.filter.filterValueMax : this.filter.def.max
        ];
      }
    },
    methods: {
      onChange(value) {
        const newFilter = index(this.filter);
        newFilter.filterValueMin = value[0];
        newFilter.filterValueMax = value[1];
        this.$emit("change", newFilter);
      }
    }
  });
  const _hoisted_1 = {
    class: normalizeClass([
      "tw-mt-7",
      "filters-number-range"
    ])
  };
  function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
    return openBlock(), createElementBlock("div", _hoisted_1, [
      createVNode(VRangeSlider, {
        "model-value": _ctx.value,
        strict: "",
        min: _ctx.min,
        max: _ctx.max,
        "thumb-label": "always",
        "hide-details": "auto",
        step: Math.max(Math.round((_ctx.max - _ctx.min) / 50), 1),
        "onUpdate:modelValue": _ctx.onChange
      }, null, 8, [
        "model-value",
        "min",
        "max",
        "step",
        "onUpdate:modelValue"
      ])
    ]);
  }
  _sfc_main.__file = "components/Filters/NumberRange.vue";
  NumberRange = _export_sfc(_sfc_main, [
    [
      "render",
      _sfc_render
    ],
    [
      "__file",
      "/home/runner/work/vido/vido/components/Filters/NumberRange.vue"
    ]
  ]);
});
export {
  NumberRange as N,
  __tla
};
