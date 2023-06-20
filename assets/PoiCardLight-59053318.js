import { aE as defineNuxtComponent, aM as mapState, as as _export_sfc, au as resolveComponent, ax as openBlock, ay as createElementBlock, aG as createBaseVNode, b4 as normalizeStyle, av as createBlock, aJ as createCommentVNode, aH as createTextVNode, aI as toDisplayString, aB as createVNode, __tla as __tla_0 } from "./vendor-c1ea6bed.js";
import { F as Fields, __tla as __tla_1 } from "./Fields-d1e8f5a6.js";
import { T as TeritorioIconBadge, __tla as __tla_2 } from "./TeritorioIconBadge-a9ef080f.js";
import { U as UIPicture, f as favoritesStore, __tla as __tla_3 } from "./UIPicture-f40f3c38.js";
let PoiCardLight;
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
  })(),
  (() => {
    try {
      return __tla_3;
    } catch {
    }
  })()
]).then(async () => {
  const PoiCardLight_vue_vue_type_style_index_0_scoped_ca356998_lang = "";
  const _sfc_main = defineNuxtComponent({
    components: {
      TeritorioIconBadge,
      Fields,
      UIPicture
    },
    props: {
      notebook: {
        type: Boolean,
        default: false
      },
      poi: {
        type: Object,
        required: true
      }
    },
    data() {
      return {
        textLimit: 160
      };
    },
    computed: {
      ...mapState(favoritesStore, [
        "favoritesIds"
      ]),
      id() {
        return this.poi.properties.metadata.id;
      },
      name() {
        var _a, _b, _c, _d;
        return this.poi.properties.name || ((_b = (_a = this.poi.properties.editorial) == null ? void 0 : _a.class_label_popup) == null ? void 0 : _b.fr) || ((_d = (_c = this.poi.properties.editorial) == null ? void 0 : _c.class_label) == null ? void 0 : _d.fr);
      },
      colorFill() {
        var _a;
        return ((_a = this.poi.properties.display) == null ? void 0 : _a.color_fill) || "black";
      },
      colorLine() {
        var _a;
        return ((_a = this.poi.properties.display) == null ? void 0 : _a.color_line) || "black";
      },
      icon() {
        var _a;
        return (_a = this.poi.properties.display) == null ? void 0 : _a.icon;
      },
      description() {
        return this.poi.properties.description;
      },
      websiteDetails() {
        return this.poi.properties.editorial && this.poi.properties.editorial["website:details"];
      }
    }
  });
  const _hoisted_1 = [
    "id"
  ];
  const _hoisted_2 = {
    class: "tw-flex tw-items-center tw-shrink-0 tw-mb-2"
  };
  const _hoisted_3 = [
    "href"
  ];
  function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_TeritorioIconBadge = resolveComponent("TeritorioIconBadge");
    const _component_Fields = resolveComponent("Fields");
    const _component_UIPicture = resolveComponent("UIPicture");
    return openBlock(), createElementBlock("div", {
      id: `PoiCardLight-${_ctx.id}`,
      class: "tw-flex-col md:tw-flex-row tw-h-auto tw-shrink-0 tw-flex tw-items-start tw-gap-4 tw-justify-between tw-box-border tw-w-full tw-border-gray-300 tw-border-t tw-pt-4 first-of-type:tw-border-t-0"
    }, [
      createBaseVNode("div", null, [
        createBaseVNode("div", _hoisted_2, [
          createBaseVNode("h3", {
            class: "tw-block tw-text-xl tw-font-semibold tw-leading-tight tw-flex tw-items-center tw-gap-2",
            style: normalizeStyle("color:" + _ctx.colorLine)
          }, [
            _ctx.icon ? (openBlock(), createBlock(_component_TeritorioIconBadge, {
              key: 0,
              "color-fill": _ctx.colorFill,
              picto: _ctx.icon,
              size: "lg",
              image: void 0
            }, null, 8, [
              "color-fill",
              "picto"
            ])) : createCommentVNode("v-if", true),
            createTextVNode(" " + toDisplayString(_ctx.name), 1)
          ], 4),
          Boolean(_ctx.websiteDetails) ? (openBlock(), createElementBlock("a", {
            key: 0,
            class: "tw-ml-6 md:tw-ml-8 tw-px-3 tw-py-1.5 tw-text-xs tw-text-zinc-800 tw-bg-zinc-100 hover:tw-bg-zinc-200 focus:tw-bg-zinc-200 tw-transition tw-transition-colors tw-rounded-md",
            href: _ctx.websiteDetails,
            rel: "noopener noreferrer",
            target: "_blank"
          }, toDisplayString(_ctx.$t("poiCard.details")), 9, _hoisted_3)) : createCommentVNode("v-if", true)
        ]),
        createVNode(_component_Fields, {
          fields: _ctx.poi.properties.editorial && _ctx.poi.properties.editorial.popup_fields || [],
          properties: _ctx.poi.properties,
          details: _ctx.websiteDetails,
          geom: _ctx.poi.geometry
        }, null, 8, [
          "fields",
          "properties",
          "details",
          "geom"
        ])
      ]),
      _ctx.poi.properties.image && _ctx.poi.properties.image.length > 0 ? (openBlock(), createBlock(_component_UIPicture, {
        key: 0,
        class: "tw-w-full tw-h-32 md:tw-w-32 md:tw-h-32 tw-z-10",
        src: _ctx.poi.properties.image[0],
        alt: _ctx.$t("poiCard.thumbnail"),
        "media-size": "8rem"
      }, null, 8, [
        "src",
        "alt"
      ])) : createCommentVNode("v-if", true)
    ], 8, _hoisted_1);
  }
  _sfc_main.__file = "components/PoisCard/PoiCardLight.vue";
  PoiCardLight = _export_sfc(_sfc_main, [
    [
      "render",
      _sfc_render
    ],
    [
      "__scopeId",
      "data-v-ca356998"
    ],
    [
      "__file",
      "/home/runner/work/vido/vido/components/PoisCard/PoiCardLight.vue"
    ]
  ]);
});
export {
  PoiCardLight as P,
  __tla
};
