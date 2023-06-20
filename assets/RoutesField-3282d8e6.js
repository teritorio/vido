import { aE as defineNuxtComponent, as as _export_sfc, ax as openBlock, ay as createElementBlock, aF as renderSlot, aH as createTextVNode, aI as toDisplayString, au as resolveComponent, aA as Fragment, az as renderList, aJ as createCommentVNode, aB as createVNode, aw as withCtx, aS as normalizeClass, aG as createBaseVNode, __tla as __tla_0 } from "./vendor-c1ea6bed.js";
import { P as PropertyTranslationsContextEnum, __tla as __tla_1 } from "./property-translations-98d98cd7.js";
let FieldsHeader, RoutesField, isRoutesFieldEmpty;
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
  const _sfc_main$1 = defineNuxtComponent({
    props: {
      recursionStack: {
        type: Array,
        default: () => []
      }
    }
  });
  const _hoisted_1$1 = {
    key: 0
  };
  const _hoisted_2$1 = {
    key: 1
  };
  const _hoisted_3$1 = {
    key: 2
  };
  function _sfc_render$1(_ctx, _cache, $props, $setup, $data, $options) {
    return _ctx.recursionStack && _ctx.recursionStack.length === 0 ? (openBlock(), createElementBlock("h2", _hoisted_1$1, [
      renderSlot(_ctx.$slots, "default")
    ])) : _ctx.recursionStack && _ctx.recursionStack.length === 1 ? (openBlock(), createElementBlock("h3", _hoisted_2$1, [
      renderSlot(_ctx.$slots, "default")
    ])) : (openBlock(), createElementBlock("span", _hoisted_3$1, [
      renderSlot(_ctx.$slots, "default"),
      createTextVNode(toDisplayString(_ctx.$t("ponctuation.colon")), 1)
    ]));
  }
  _sfc_main$1.__file = "components/UI/FieldsHeader.vue";
  FieldsHeader = _export_sfc(_sfc_main$1, [
    [
      "render",
      _sfc_render$1
    ],
    [
      "__file",
      "/home/runner/work/vido/vido/components/UI/FieldsHeader.vue"
    ]
  ]);
  isRoutesFieldEmpty = function(properties) {
    return Object.entries(properties || {}).map(([key, value]) => [
      key.split(":"),
      value
    ]).filter(([keys, _value]) => keys[0] === "route" && keys.length === 3).length > 0;
  };
  const _sfc_main = defineNuxtComponent({
    components: {
      FieldsHeader
    },
    props: {
      context: {
        type: String,
        required: true
      },
      recursionStack: {
        type: Array,
        default: () => []
      },
      properties: {
        type: Object,
        required: true
      }
    },
    computed: {
      propertyTranslations() {
        return this.$propertyTranslations;
      },
      isCompact() {
        return this.context === PropertyTranslationsContextEnum.Card;
      },
      routes() {
        const activitiesStruct = {};
        Object.entries(this.properties || {}).map(([key, value]) => [
          key.split(":"),
          value
        ]).filter(([keys, _value]) => keys[0] === "route" && keys.length === 3).forEach(([[_, activity, property], value]) => {
          if (activitiesStruct[activity]) {
            activitiesStruct[activity][property] = value;
          } else {
            activitiesStruct[activity] = {};
            activitiesStruct[activity][property] = value;
          }
        });
        const ret = {};
        Object.entries(activitiesStruct).forEach(([acivity, properties]) => {
          ret[acivity] = properties;
        });
        return ret;
      },
      length() {
        const route = Object.values(this.routes)[0];
        return (route == null ? void 0 : route.length) ? `${route.length} ${this.$t("units.km")}` : void 0;
      }
    },
    methods: {
      duration(route) {
        if (route.duration) {
          const hours = Math.floor(route.duration / 60);
          const minutes = route.duration % 60;
          let string = "";
          if (hours > 0) {
            string += `${hours} ${this.$t("units.hours")}`;
          }
          if (minutes > 0) {
            string += `${hours > 0 ? " " : ""}${minutes} ${this.$t("units.min")}`;
          }
          return string;
        } else {
          return void 0;
        }
      },
      difficulty(activity, route) {
        return route.difficulty ? this.$propertyTranslations.pv(`route:${activity}:difficulty`, route.difficulty, this.context) : void 0;
      },
      formatNoDetails(activity, route) {
        return [
          this.duration(route),
          this.difficulty(activity, route)
        ].join(", ");
      }
    }
  });
  const _hoisted_1 = {
    key: 0
  };
  const _hoisted_2 = {
    key: 0
  };
  const _hoisted_3 = {
    key: 1
  };
  const _hoisted_4 = {
    key: 0,
    class: "field"
  };
  const _hoisted_5 = {
    class: "tw-list-disc tw-ml-6"
  };
  const _hoisted_6 = {
    key: 0
  };
  function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_FieldsHeader = resolveComponent("FieldsHeader");
    return openBlock(), createElementBlock("div", null, [
      renderSlot(_ctx.$slots, "default"),
      _ctx.isCompact ? (openBlock(), createElementBlock("div", _hoisted_1, [
        (openBlock(true), createElementBlock(Fragment, null, renderList(_ctx.routes, (route, activity) => {
          return openBlock(), createElementBlock("p", {
            key: activity
          }, toDisplayString(_ctx.propertyTranslations.pv("route", `${activity}`, _ctx.context)) + " : " + toDisplayString(_ctx.formatNoDetails(activity, route)) + ". ", 1);
        }), 128)),
        _ctx.length ? (openBlock(), createElementBlock("p", _hoisted_2, toDisplayString(_ctx.length), 1)) : createCommentVNode("v-if", true)
      ])) : (openBlock(), createElementBlock("div", _hoisted_3, [
        _ctx.length ? (openBlock(), createElementBlock("div", _hoisted_4, toDisplayString(_ctx.$t("fields.route.length")) + " " + toDisplayString(_ctx.length), 1)) : createCommentVNode("v-if", true),
        (openBlock(true), createElementBlock(Fragment, null, renderList(_ctx.routes, (route, activity) => {
          return openBlock(), createElementBlock("div", {
            key: activity,
            class: "field"
          }, [
            createVNode(_component_FieldsHeader, {
              "recursion-stack": [
                ..._ctx.recursionStack,
                `${activity}`
              ],
              class: normalizeClass(`field_header_level_${[
                ..._ctx.recursionStack,
                activity
              ].length}`)
            }, {
              default: withCtx(() => [
                createTextVNode(toDisplayString(_ctx.propertyTranslations.pv("route", `${activity}`, _ctx.context)), 1)
              ]),
              _: 2
            }, 1032, [
              "recursion-stack",
              "class"
            ]),
            createBaseVNode("ul", _hoisted_5, [
              createBaseVNode("li", null, toDisplayString(_ctx.$t("fields.route.difficulty")) + " " + toDisplayString(_ctx.difficulty(activity, route)), 1),
              _ctx.duration(route) ? (openBlock(), createElementBlock("li", _hoisted_6, toDisplayString(_ctx.$t("fields.route.duration")) + " " + toDisplayString(_ctx.duration(route)), 1)) : createCommentVNode("v-if", true)
            ])
          ]);
        }), 128))
      ]))
    ]);
  }
  _sfc_main.__file = "components/Fields/RoutesField.vue";
  RoutesField = _export_sfc(_sfc_main, [
    [
      "render",
      _sfc_render
    ],
    [
      "__file",
      "/home/runner/work/vido/vido/components/Fields/RoutesField.vue"
    ]
  ]);
});
export {
  FieldsHeader as F,
  RoutesField as R,
  __tla,
  isRoutesFieldEmpty as i
};
