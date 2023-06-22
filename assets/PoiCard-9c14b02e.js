import { aL as defineStore, aE as defineNuxtComponent, aK as FontAwesomeIcon, aM as mapState, as as _export_sfc, au as resolveComponent, ax as openBlock, ay as createElementBlock, aG as createBaseVNode, b6 as normalizeStyle, aI as toDisplayString, aJ as createCommentVNode, aA as Fragment, av as createBlock, aw as withCtx, aH as createTextVNode, aT as withModifiers, aB as createVNode, aS as normalizeClass, b7 as NuxtLink, aX as mergeProps, __tla as __tla_0 } from "./vendor-cc850437.js";
import { F as Fields, __tla as __tla_1 } from "./Fields-1b400249.js";
import { F as FavoriteIcon, __tla as __tla_2 } from "./FavoriteIcon-8130c3cd.js";
import { T as TeritorioIcon, __tla as __tla_3 } from "./TeritorioIcon-3925ac42.js";
import { i as isIOS, c as coordinatesHref, __tla as __tla_4 } from "./Field-43bb16b8.js";
import { f as favoritesStore, U as UIPicture, __tla as __tla_5 } from "./UIPicture-12029774.js";
import { a as Mode } from "./types-f83cf40c.js";
let PoiCard;
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
  })(),
  (() => {
    try {
      return __tla_4;
    } catch {
    }
  })(),
  (() => {
    try {
      return __tla_5;
    } catch {
    }
  })()
]).then(async () => {
  function _optionalChain(ops) {
    let lastAccessLHS = void 0;
    let value = ops[0];
    let i = 1;
    while (i < ops.length) {
      const op = ops[i];
      const fn = ops[i + 1];
      i += 2;
      if ((op === "optionalAccess" || op === "optionalCall") && value == null) {
        return void 0;
      }
      if (op === "access" || op === "optionalAccess") {
        lastAccessLHS = value;
        value = fn(value);
      } else if (op === "call" || op === "optionalCall") {
        value = fn((...args) => value.call(lastAccessLHS, ...args));
        lastAccessLHS = void 0;
      }
    }
    return value;
  }
  const getInitialMapview = () => ({
    center: {
      lng: 0,
      lat: 0
    }
  });
  const mapStore = defineStore("map", {
    state: () => Object.assign({
      pitch: 0,
      selectedFeature: null,
      mode: Mode.BROWSER
    }, getInitialMapview()),
    getters: {
      isModeExplorer: (state) => state.mode === Mode.EXPLORER,
      isModeFavorites: (state) => state.mode === Mode.FAVORITES,
      isModeExplorerOrFavorites: (state) => state.mode === Mode.EXPLORER || state.mode === Mode.FAVORITES
    },
    actions: {
      setSelectedFeature(feature) {
        if (!feature) {
          this.selectedFeature = null;
        } else {
          const goodFeature = feature;
          const IsJsonString = (str) => {
            try {
              JSON.parse(str);
            } catch (e) {
              return false;
            }
            return true;
          };
          if (_optionalChain([
            feature,
            "optionalAccess",
            (_) => _.properties
          ])) {
            const cleanProperties = {};
            Object.keys(feature.properties).forEach((key) => {
              if (IsJsonString(feature.properties[key])) {
                cleanProperties[key] = JSON.parse(feature.properties[key]);
              } else {
                cleanProperties[key] = feature.properties[key];
              }
            });
            goodFeature.properties = cleanProperties;
          }
          this.selectedFeature = goodFeature;
        }
      }
    }
  });
  const PoiCardContent_vue_vue_type_style_index_0_scoped_26c98935_lang = "";
  const _sfc_main$1 = defineNuxtComponent({
    components: {
      FontAwesomeIcon,
      TeritorioIcon,
      FavoriteIcon,
      Fields
    },
    props: {
      poi: {
        type: Object,
        required: true
      },
      explorerModeEnabled: {
        type: Boolean,
        required: true
      },
      favoritesModeEnabled: {
        type: Boolean,
        required: true
      }
    },
    computed: {
      ...mapState(mapStore, [
        "isModeExplorer"
      ]),
      ...mapState(favoritesStore, [
        "favoritesIds"
      ]),
      device() {
        return this.$device;
      },
      id() {
        return this.poi.properties.metadata.id;
      },
      isModeFavorites() {
        const currentFavorites = this.favoritesIds;
        return currentFavorites.includes(this.id);
      },
      name() {
        var _a, _b, _c, _d;
        return this.poi.properties.name || ((_b = (_a = this.poi.properties.editorial) == null ? void 0 : _a.class_label_popup) == null ? void 0 : _b.fr) || ((_d = (_c = this.poi.properties.editorial) == null ? void 0 : _c.class_label) == null ? void 0 : _d.fr);
      },
      colorLine() {
        var _a;
        return ((_a = this.poi.properties.display) == null ? void 0 : _a.color_line) || "black";
      },
      icon() {
        var _a;
        return (_a = this.poi.properties.display) == null ? void 0 : _a.icon;
      },
      category() {
        var _a, _b, _c, _d;
        return ((_b = (_a = this.poi.properties.editorial) == null ? void 0 : _a.class_label_popup) == null ? void 0 : _b.fr) || ((_d = (_c = this.poi.properties.editorial) == null ? void 0 : _c.class_label) == null ? void 0 : _d.fr);
      },
      description() {
        return this.poi.properties.description;
      },
      unavoidable() {
        var _a;
        return Boolean((_a = this.poi.properties.editorial) == null ? void 0 : _a.unavoidable);
      },
      websiteDetails() {
        const url = this.poi.properties.editorial && this.poi.properties.editorial["website:details"];
        if (!url) {
          return void 0;
        } else if (!url.startsWith("https://") && !url.startsWith("http://")) {
          return url;
        } else {
          const u = new URL(url);
          if (u.hostname !== window.location.hostname) {
            return url;
          } else {
            return url.replace(`${u.protocol}//${u.hostname}${u.port ? ":" + u.port : ""}`, "");
          }
        }
      },
      coordinatesHref() {
        return isIOS !== void 0 ? coordinatesHref(this.poi.geometry, isIOS()) : void 0;
      }
    },
    emits: {
      "zoom-click": (poi) => true,
      "explore-click": (poi) => true,
      "favorite-click": (poi) => true
    },
    methods: {
      onZoomClick() {
        this.trackingPopupEvent("zoom");
        this.$emit("zoom-click", this.poi);
      },
      onExploreClick() {
        if (!this.isModeExplorer) {
          this.trackingPopupEvent("explore");
        }
        this.$emit("explore-click", this.poi);
      },
      onFavoriteClick() {
        if (!this.isModeFavorites) {
          this.trackingPopupEvent("favorite");
        }
        this.$emit("favorite-click", this.poi);
      },
      trackingPopupEvent(event) {
        var _a;
        this.$tracking({
          type: "popup_event",
          event,
          poiId: this.id,
          category: this.category || "",
          title: (_a = this.poi.properties) == null ? void 0 : _a.name
        });
      }
    }
  });
  const _hoisted_1$1 = {
    class: "tw-flex tw-items-center tw-justify-between tw-shrink-0"
  };
  const _hoisted_2$1 = [
    "href"
  ];
  const _hoisted_3 = {
    key: 0,
    class: "tw-flex tw-items-center tw-mt-2 tw-text-sm tw-text-zinc-500 tw-shrink-0"
  };
  const _hoisted_4 = {
    key: 1,
    class: "tw-text-sm tw-flex-grow tw-shrink-0 tw-mt-6"
  };
  const _hoisted_5 = {
    key: 2,
    class: "tw-h-auto tw-flex-grow tw-shrink-0"
  };
  const _hoisted_6 = {
    class: "tw-flex tw-items-center tw-space-x-2 tw-justify-evenly tw-shrink-0 tw-bottom-0 tw-pt-2"
  };
  const _hoisted_7 = [
    "href",
    "title"
  ];
  const _hoisted_8 = {
    class: "tw-text-sm"
  };
  const _hoisted_9 = [
    "title"
  ];
  const _hoisted_10 = {
    class: "tw-text-sm"
  };
  const _hoisted_11 = [
    "title"
  ];
  const _hoisted_12 = {
    class: "tw-text-sm"
  };
  const _hoisted_13 = [
    "title"
  ];
  const _hoisted_14 = {
    class: "tw-text-sm"
  };
  function _sfc_render$1(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_NuxtLink = NuxtLink;
    const _component_TeritorioIcon = resolveComponent("TeritorioIcon");
    const _component_Fields = resolveComponent("Fields");
    const _component_FontAwesomeIcon = resolveComponent("FontAwesomeIcon");
    const _component_FavoriteIcon = resolveComponent("FavoriteIcon");
    return openBlock(), createElementBlock("div", null, [
      createBaseVNode("div", _hoisted_1$1, [
        _ctx.name ? (openBlock(), createElementBlock("h2", {
          key: 0,
          class: "tw-block tw-text-xl tw-font-semibold tw-leading-tight",
          style: normalizeStyle("color:" + _ctx.colorLine)
        }, toDisplayString(_ctx.name), 5)) : createCommentVNode("v-if", true),
        _ctx.websiteDetails !== void 0 ? (openBlock(), createElementBlock(Fragment, {
          key: 1
        }, [
          !_ctx.websiteDetails.startsWith("https://") && !_ctx.websiteDetails.startsWith("http://") ? (openBlock(), createBlock(_component_NuxtLink, {
            key: 0,
            class: "tw-ml-6 tw-px-3 tw-py-1.5 tw-text-xs tw-text-zinc-800 tw-bg-zinc-100 hover:tw-bg-zinc-200 focus:tw-bg-zinc-200 tw-transition tw-transition-colors tw-rounded-md",
            to: _ctx.websiteDetails,
            rel: "noopener noreferrer",
            onClick: _cache[0] || (_cache[0] = withModifiers(($event) => _ctx.trackingPopupEvent("details"), [
              "stop"
            ]))
          }, {
            default: withCtx(() => [
              createTextVNode(toDisplayString(_ctx.$t("poiCard.details")), 1)
            ]),
            _: 1
          }, 8, [
            "to"
          ])) : (openBlock(), createElementBlock("a", {
            key: 1,
            class: "tw-ml-6 tw-px-3 tw-py-1.5 tw-text-xs tw-text-zinc-800 tw-bg-zinc-100 hover:tw-bg-zinc-200 focus:tw-bg-zinc-200 tw-transition tw-transition-colors tw-rounded-md",
            href: _ctx.websiteDetails,
            rel: "noopener noreferrer",
            onClick: _cache[1] || (_cache[1] = withModifiers(($event) => _ctx.trackingPopupEvent("details"), [
              "stop"
            ]))
          }, toDisplayString(_ctx.$t("poiCard.details")), 9, _hoisted_2$1))
        ], 64)) : createCommentVNode("v-if", true)
      ]),
      !_ctx.unavoidable ? (openBlock(), createElementBlock("div", _hoisted_3, [
        _ctx.icon ? (openBlock(), createBlock(_component_TeritorioIcon, {
          key: 0,
          "color-text": _ctx.colorLine,
          class: "tw-mr-2",
          picto: _ctx.icon,
          "use-native-alignment": false
        }, null, 8, [
          "color-text",
          "picto"
        ])) : createCommentVNode("v-if", true),
        createTextVNode(" " + toDisplayString(_ctx.category), 1)
      ])) : createCommentVNode("v-if", true),
      _ctx.unavoidable && Boolean(_ctx.description) ? (openBlock(), createElementBlock("p", _hoisted_4, toDisplayString(_ctx.description), 1)) : (openBlock(), createElementBlock("div", _hoisted_5, [
        createVNode(_component_Fields, {
          fields: _ctx.poi.properties.editorial && _ctx.poi.properties.editorial.popup_fields || [],
          properties: _ctx.poi.properties,
          details: _ctx.websiteDetails,
          geom: _ctx.poi.geometry,
          class: "tw-mt-6 tw-text-sm",
          onClickDetail: _cache[2] || (_cache[2] = ($event) => _ctx.trackingPopupEvent("details"))
        }, null, 8, [
          "fields",
          "properties",
          "details",
          "geom"
        ])
      ])),
      createBaseVNode("div", _hoisted_6, [
        _ctx.device.value.phone && _ctx.coordinatesHref ? (openBlock(), createElementBlock("a", {
          key: 0,
          href: _ctx.coordinatesHref,
          class: "tw-flex tw-flex-col tw-items-center tw-flex-1 tw-h-full tw-p-2 tw-space-y-2 tw-rounded-lg hover:tw-bg-zinc-100",
          title: _ctx.$t("poiCard.findRoute"),
          onClick: _cache[3] || (_cache[3] = ($event) => _ctx.trackingPopupEvent("route"))
        }, [
          createVNode(_component_FontAwesomeIcon, {
            icon: "route",
            color: _ctx.colorLine,
            size: "sm"
          }, null, 8, [
            "color"
          ]),
          createBaseVNode("span", _hoisted_8, toDisplayString(_ctx.$t("poiCard.route")), 1)
        ], 8, _hoisted_7)) : createCommentVNode("v-if", true),
        createBaseVNode("button", {
          type: "button",
          class: "tw-flex tw-flex-1 tw-flex-col tw-items-center tw-space-y-2 tw-rounded-lg tw-p-2 tw-h-full hover:tw-bg-zinc-100",
          title: _ctx.$t("poiCard.zoom"),
          onClick: _cache[4] || (_cache[4] = withModifiers((...args) => _ctx.onZoomClick && _ctx.onZoomClick(...args), [
            "stop"
          ]))
        }, [
          createVNode(_component_FontAwesomeIcon, {
            icon: "plus",
            color: _ctx.colorLine,
            size: "sm"
          }, null, 8, [
            "color"
          ]),
          createBaseVNode("span", _hoisted_10, toDisplayString(_ctx.$t("poiCard.zoom")), 1)
        ], 8, _hoisted_9),
        _ctx.explorerModeEnabled ? (openBlock(), createElementBlock("button", {
          key: 1,
          type: "button",
          class: normalizeClass([
            "tw-flex tw-flex-1 tw-flex-col tw-items-center tw-space-y-2 tw-rounded-lg tw-p-2 tw-h-full",
            _ctx.isModeExplorer && "tw-bg-blue-600 tw-text-white hover:tw-bg-blue-500",
            !_ctx.isModeExplorer && "hover:tw-bg-zinc-100"
          ]),
          title: _ctx.isModeExplorer ? _ctx.$t("poiCard.unactivateExplore") : _ctx.$t("poiCard.activateExplore"),
          onClick: _cache[5] || (_cache[5] = withModifiers((...args) => _ctx.onExploreClick && _ctx.onExploreClick(...args), [
            "stop"
          ]))
        }, [
          createVNode(_component_FontAwesomeIcon, {
            icon: "eye",
            color: _ctx.isModeExplorer ? "white" : _ctx.colorLine,
            size: "sm"
          }, null, 8, [
            "color"
          ]),
          createBaseVNode("span", _hoisted_12, toDisplayString(_ctx.$t("poiCard.explore")), 1)
        ], 10, _hoisted_11)) : createCommentVNode("v-if", true),
        _ctx.favoritesModeEnabled && _ctx.id ? (openBlock(), createElementBlock("button", {
          key: 2,
          type: "button",
          class: "tw-flex tw-flex-col tw-items-center tw-flex-1 tw-h-full tw-p-2 tw-space-y-2 tw-rounded-lg hover:tw-bg-zinc-100",
          title: _ctx.isModeFavorites ? _ctx.$t("poiCard.favoriteOn") : _ctx.$t("poiCard.favoriteOff"),
          onClick: _cache[6] || (_cache[6] = withModifiers((...args) => _ctx.onFavoriteClick && _ctx.onFavoriteClick(...args), [
            "stop"
          ]))
        }, [
          createVNode(_component_FavoriteIcon, {
            "is-active": _ctx.isModeFavorites,
            "color-line": _ctx.colorLine
          }, null, 8, [
            "is-active",
            "color-line"
          ]),
          createBaseVNode("span", _hoisted_14, toDisplayString(_ctx.$t("poiCard.favorite")), 1)
        ], 8, _hoisted_13)) : createCommentVNode("v-if", true)
      ])
    ]);
  }
  _sfc_main$1.__file = "components/PoisCard/PoiCardContent.vue";
  const PoiCardContent = _export_sfc(_sfc_main$1, [
    [
      "render",
      _sfc_render$1
    ],
    [
      "__scopeId",
      "data-v-26c98935"
    ],
    [
      "__file",
      "/home/runner/work/vido/vido/components/PoisCard/PoiCardContent.vue"
    ]
  ]);
  const PoiCard_vue_vue_type_style_index_0_scoped_ff879344_lang = "";
  const _sfc_main = defineNuxtComponent({
    components: {
      PoiCardContent,
      TeritorioIcon,
      UIPicture
    },
    props: {
      poi: {
        type: Object,
        required: true
      },
      explorerModeEnabled: {
        type: Boolean,
        required: true
      },
      favoritesModeEnabled: {
        type: Boolean,
        required: true
      },
      showImage: {
        type: Boolean,
        default: true
      }
    },
    computed: {
      id() {
        return this.poi.properties.metadata.id;
      },
      colorFill() {
        var _a;
        return ((_a = this.poi.properties.display) == null ? void 0 : _a.color_fill) || "black";
      },
      icon() {
        var _a;
        return (_a = this.poi.properties.display) == null ? void 0 : _a.icon;
      }
    }
  });
  const _hoisted_1 = [
    "id"
  ];
  const _hoisted_2 = {
    key: 0,
    class: "md:tw-w-48 tw-h-44 md:tw-h-auto md:tw-max-h-full tw-bg-gray-100 tw-text-gray-100 tw-flex tw-items-center tw-align-middle tw-justify-center tw-relative tw-min-icon-height"
  };
  function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_TeritorioIcon = resolveComponent("TeritorioIcon");
    const _component_UIPicture = resolveComponent("UIPicture");
    const _component_PoiCardContent = resolveComponent("PoiCardContent");
    return openBlock(), createElementBlock("div", {
      id: `PoiCard-${_ctx.id}`,
      class: normalizeClass([
        "poiDescription",
        "tw-z-10 tw-flex tw-flex-col tw-w-full md:tw-max-w-xl tw-mx-0 tw-overflow-y-auto tw-shadow-md tw-pointer-events-auto md:tw-flex-row md:tw-w-auto md:tw-mx-auto md:tw-rounded-xl tw-bg-white"
      ])
    }, [
      _ctx.showImage ? (openBlock(), createElementBlock("div", _hoisted_2, [
        _ctx.icon ? (openBlock(), createBlock(_component_TeritorioIcon, {
          key: 0,
          picto: _ctx.icon,
          "use-native-alignment": false,
          class: "tw-text-8xl tw-align-middle tw-absolute tw-z-0",
          "color-text": _ctx.poi.properties.image && _ctx.poi.properties.image.length > 0 ? "#AAA" : _ctx.colorFill
        }, null, 8, [
          "picto",
          "color-text"
        ])) : createCommentVNode("v-if", true),
        _ctx.poi.properties.image && _ctx.poi.properties.image.length > 0 ? (openBlock(), createBlock(_component_UIPicture, {
          key: 1,
          class: "tw-object-cover tw-h-44 tw-w-full md:tw-w-48 md:tw-h-full tw-z-10",
          src: _ctx.poi.properties.image[0],
          alt: _ctx.$t("poiCard.thumbnail"),
          "media-size": "30rem"
        }, null, 8, [
          "src",
          "alt"
        ])) : createCommentVNode("v-if", true)
      ])) : createCommentVNode("v-if", true),
      createVNode(_component_PoiCardContent, mergeProps({
        poi: _ctx.poi,
        "explorer-mode-enabled": _ctx.explorerModeEnabled,
        "favorites-mode-enabled": _ctx.favoritesModeEnabled,
        class: "tw-px-4 tw-py-5 tw-flex tw-flex-col md:tw-overflow-y-auto tw-flex-grow md:tw-max-h-full tw-box-border tw-w-full md:tw-h-80 md:tw-w-96"
      }, _ctx.$attrs), null, 16, [
        "poi",
        "explorer-mode-enabled",
        "favorites-mode-enabled"
      ])
    ], 8, _hoisted_1);
  }
  _sfc_main.__file = "components/PoisCard/PoiCard.vue";
  PoiCard = _export_sfc(_sfc_main, [
    [
      "render",
      _sfc_render
    ],
    [
      "__scopeId",
      "data-v-ff879344"
    ],
    [
      "__file",
      "/home/runner/work/vido/vido/components/PoisCard/PoiCard.vue"
    ]
  ]);
});
export {
  PoiCard as P,
  __tla
};
