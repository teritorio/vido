import { aE as defineNuxtComponent, a_ as VAutocomplete, as as _export_sfc, ax as openBlock, ay as createElementBlock, aB as createVNode, __tla as __tla_0 } from "./vendor-bd688624.js";
let SelectFilter;
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
      VAutocomplete
    },
    props: {
      filter: {
        type: Object,
        required: true
      }
    },
    emits: {
      click: () => true,
      blur: () => true,
      change: (value) => true
    },
    data() {
      return {
        currentValue: this.filter.filterValues
      };
    },
    computed: {
      items() {
        return this.filter.def.values.map((value) => ({
          title: value.name && value.name.fr || value.value,
          value: value.value
        }));
      }
    },
    watch: {
      filter() {
        this.currentValue = this.filter.filterValues;
      }
    },
    methods: {
      onChange(value) {
        this.$emit("change", value);
      }
    }
  });
  function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
    return openBlock(), createElementBlock("div", null, [
      createVNode(VAutocomplete, {
        modelValue: _ctx.currentValue,
        "onUpdate:modelValue": [
          _cache[0] || (_cache[0] = ($event) => _ctx.currentValue = $event),
          _ctx.onChange
        ],
        outlined: "",
        multiple: "",
        chips: "",
        "deletable-chips": "",
        items: _ctx.items,
        label: _ctx.$t("listFilter.label"),
        clearable: true,
        "hide-details": "auto",
        density: "compact",
        onClick: _cache[1] || (_cache[1] = ($event) => _ctx.$emit("click")),
        onBlur: _cache[2] || (_cache[2] = ($event) => _ctx.$emit("blur"))
      }, null, 8, [
        "modelValue",
        "items",
        "label",
        "onUpdate:modelValue"
      ])
    ]);
  }
  _sfc_main.__file = "components/Filters/Select.vue";
  SelectFilter = _export_sfc(_sfc_main, [
    [
      "render",
      _sfc_render
    ],
    [
      "__file",
      "/home/runner/work/vido/vido/components/Filters/Select.vue"
    ]
  ]);
});
export {
  SelectFilter as S,
  __tla
};
