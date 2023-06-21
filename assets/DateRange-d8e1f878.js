import { aE as defineNuxtComponent, aY as VSelect, aZ as index, as as _export_sfc, ax as openBlock, ay as createElementBlock, aB as createVNode, __tla as __tla_0 } from "./vendor-ec6df5a6.js";
let DateRange;
let __tla = Promise.all([
  (() => {
    try {
      return __tla_0;
    } catch {
    }
  })()
]).then(async () => {
  function formatDate(date) {
    return date.getFullYear().toString() + "-" + (date.getMonth() + 1).toString().padStart(2, "0") + "-" + date.getDate().toString().padStart(2, "0");
  }
  const _sfc_main = defineNuxtComponent({
    components: {
      VSelect
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
    data() {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      const saturday = new Date(today);
      saturday.setDate(saturday.getDate() + (6 + (7 - saturday.getDay())) % 7);
      const sunday = new Date(saturday);
      sunday.setDate(saturday.getDate() + 1);
      const in7days = new Date(today);
      in7days.setDate(in7days.getDate() + 7);
      const in1month = new Date(today);
      in1month.setMonth(in1month.getMonth() + 1);
      return {
        dateFilters: [
          {
            title: this.$t("dateFilter.today"),
            value: "today",
            begin: formatDate(today),
            end: formatDate(today)
          },
          {
            title: this.$t("dateFilter.tomorrow"),
            value: "tomorrow",
            begin: formatDate(tomorrow),
            end: formatDate(tomorrow)
          },
          {
            title: this.$t("dateFilter.thisWeekend"),
            value: "thisWeekend",
            begin: formatDate(saturday),
            end: formatDate(sunday)
          },
          {
            title: this.$t("dateFilter.nextWeek"),
            value: "nextWeek",
            begin: formatDate(today),
            end: formatDate(in7days)
          },
          {
            title: this.$t("dateFilter.nextMonth"),
            value: "nextMonth",
            begin: formatDate(today),
            end: formatDate(in1month)
          }
        ]
      };
    },
    computed: {
      currentValue() {
        var _a;
        return (_a = this.dateFilters.find((e) => e.begin === this.filter.filterValueBegin && e.end === this.filter.filterValueEnd)) == null ? void 0 : _a.value;
      }
    },
    methods: {
      onChange(value) {
        const newFilter = index(this.filter);
        if (value) {
          const dateRange = this.dateFilters.find((e) => e.value === value);
          if (dateRange) {
            newFilter.filterValueBegin = dateRange.begin;
            newFilter.filterValueEnd = dateRange.end;
          }
        } else {
          newFilter.filterValueBegin = null;
          newFilter.filterValueEnd = null;
        }
        this.$emit("change", newFilter);
      }
    }
  });
  function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
    return openBlock(), createElementBlock("div", null, [
      createVNode(VSelect, {
        "model-value": _ctx.currentValue,
        outlined: "",
        label: _ctx.filter.def.name && _ctx.filter.def.name.fr,
        items: _ctx.dateFilters,
        clearable: true,
        "hide-details": "auto",
        onInput: _ctx.onChange
      }, null, 8, [
        "model-value",
        "label",
        "items",
        "onInput"
      ])
    ]);
  }
  _sfc_main.__file = "components/Filters/DateRange.vue";
  DateRange = _export_sfc(_sfc_main, [
    [
      "render",
      _sfc_render
    ],
    [
      "__file",
      "/home/runner/work/vido/vido/components/Filters/DateRange.vue"
    ]
  ]);
});
export {
  DateRange as D,
  __tla
};
