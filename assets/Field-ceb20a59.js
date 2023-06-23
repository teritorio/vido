import { aE as defineNuxtComponent, as as _export_sfc, ax as openBlock, ay as createElementBlock, aF as renderSlot, aG as createBaseVNode, aI as toDisplayString, aJ as createCommentVNode, au as resolveComponent, av as createBlock, aw as withCtx, aH as createTextVNode, aK as FontAwesomeIcon, aB as createVNode, aL as defineStore, aM as mapState, aN as enGB, aO as formatRelative, aP as fr, aQ as es, aR as OpeningHours$1, aA as Fragment, az as renderList, aS as normalizeClass, aT as withModifiers, __tla as __tla_0 } from "./vendor-fe86adbc.js";
import { E as ExternalLink, P as Phone, __tla as __tla_1 } from "./Phone-61a68ce3.js";
import { D as DateRange, i as isDateRangeEmpty, __tla as __tla_2 } from "./DateRange-541430bf.js";
import { P as PropertyTranslationsContextEnum, __tla as __tla_3 } from "./property-translations-1fdfea06.js";
import { F as FieldsHeader, R as RoutesField, i as isRoutesFieldEmpty, __tla as __tla_4 } from "./RoutesField-bbb40be4.js";
import { S as Stars, __tla as __tla_5 } from "./Stars-184461e1.js";
let Field, isFiledEmpty, coordinatesHref, isIOS;
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
  const addressFields = [
    "addr:housenumber",
    "addr:street",
    "addr:postcode",
    "addr:city"
  ];
  function isAddressFieldEmpty(properties) {
    return addressFields.reduce((sum, value) => sum || value in properties, false);
  }
  const _sfc_main$6 = defineNuxtComponent({
    props: {
      properties: {
        type: Object,
        default: null
      }
    },
    computed: {
      address() {
        return addressFields.map((field) => this.properties[field]).map((f) => (f || "").toString().trim()).filter((f) => f).join(" ");
      }
    }
  });
  const _hoisted_1$5 = {
    key: 0
  };
  function _sfc_render$6(_ctx, _cache, $props, $setup, $data, $options) {
    return _ctx.address ? (openBlock(), createElementBlock("div", _hoisted_1$5, [
      renderSlot(_ctx.$slots, "default"),
      createBaseVNode("span", null, toDisplayString(_ctx.address), 1)
    ])) : createCommentVNode("v-if", true);
  }
  _sfc_main$6.__file = "components/Fields/AddressField.vue";
  const AddressField = _export_sfc(_sfc_main$6, [
    [
      "render",
      _sfc_render$6
    ],
    [
      "__file",
      "/home/runner/work/vido/vido/components/Fields/AddressField.vue"
    ]
  ]);
  coordinatesHref = function(geometry, isIOS2) {
    if (isIOS2 !== void 0 && geometry.type === "Point") {
      const lat = geometry.coordinates[1];
      const lng = geometry.coordinates[0];
      const latLng = `${lat},${lng}`;
      return isIOS2 ? `maps://?q=${latLng}` : `geo:${latLng}?q=${latLng}`;
    } else {
      return void 0;
    }
  };
  isIOS = function() {
    return [
      "iPad Simulator",
      "iPhone Simulator",
      "iPod Simulator",
      "iPad",
      "iPhone",
      "iPod"
    ].includes(navigator.platform) || navigator.userAgent.includes("Mac") && "ontouchend" in document;
  };
  function isCoordinatesEmpty(geom) {
    return !(geom && geom.type === "Point" && geom.coordinates);
  }
  const _sfc_main$5 = defineNuxtComponent({
    components: {
      ExternalLink
    },
    props: {
      geom: {
        type: Object,
        required: true
      }
    },
    data() {
      return {
        href: void 0
      };
    },
    mounted() {
      this.href = isIOS !== void 0 ? coordinatesHref(this.geom, isIOS()) : void 0;
    }
  });
  const _hoisted_1$4 = {
    key: 0
  };
  const _hoisted_2$2 = {
    key: 1
  };
  function _sfc_render$5(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_ExternalLink = resolveComponent("ExternalLink");
    return _ctx.geom.type === "Point" ? (openBlock(), createElementBlock("div", _hoisted_1$4, [
      renderSlot(_ctx.$slots, "default"),
      _ctx.href ? (openBlock(), createBlock(_component_ExternalLink, {
        key: 0,
        href: _ctx.href,
        target: "_blank"
      }, {
        default: withCtx(() => [
          createTextVNode(toDisplayString(_ctx.geom.coordinates[1].toFixed(6)) + ",\xA0" + toDisplayString(_ctx.geom.coordinates[0].toFixed(6)), 1)
        ]),
        _: 1
      }, 8, [
        "href"
      ])) : (openBlock(), createElementBlock("span", _hoisted_2$2, toDisplayString(_ctx.geom.coordinates[1].toFixed(6)) + ",\xA0" + toDisplayString(_ctx.geom.coordinates[0].toFixed(6)), 1))
    ])) : createCommentVNode("v-if", true);
  }
  _sfc_main$5.__file = "components/Fields/Coordinates.vue";
  const Coordinates = _export_sfc(_sfc_main$5, [
    [
      "render",
      _sfc_render$5
    ],
    [
      "__file",
      "/home/runner/work/vido/vido/components/Fields/Coordinates.vue"
    ]
  ]);
  const _sfc_main$4 = defineNuxtComponent({
    components: {
      FontAwesomeIcon
    },
    props: {
      url: {
        type: String,
        default: null
      }
    }
  });
  const _hoisted_1$3 = [
    "href"
  ];
  function _sfc_render$4(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_FontAwesomeIcon = resolveComponent("FontAwesomeIcon");
    return _ctx.url ? (openBlock(), createElementBlock("a", {
      key: 0,
      href: _ctx.url,
      target: "_blank"
    }, [
      createVNode(_component_FontAwesomeIcon, {
        icon: "fa-brands fa-facebook",
        size: "lg"
      })
    ], 8, _hoisted_1$3)) : createCommentVNode("v-if", true);
  }
  _sfc_main$4.__file = "components/Fields/Facebook.vue";
  const Facebook = _export_sfc(_sfc_main$4, [
    [
      "render",
      _sfc_render$4
    ],
    [
      "__file",
      "/home/runner/work/vido/vido/components/Fields/Facebook.vue"
    ]
  ]);
  const _sfc_main$3 = defineNuxtComponent({
    components: {
      FontAwesomeIcon
    },
    props: {
      url: {
        type: String,
        default: null
      }
    }
  });
  const _hoisted_1$2 = [
    "href"
  ];
  function _sfc_render$3(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_FontAwesomeIcon = resolveComponent("FontAwesomeIcon");
    return _ctx.url ? (openBlock(), createElementBlock("a", {
      key: 0,
      href: _ctx.url,
      target: "_blank"
    }, [
      createVNode(_component_FontAwesomeIcon, {
        icon: "fa-brands fa-instagram",
        size: "lg"
      })
    ], 8, _hoisted_1$2)) : createCommentVNode("v-if", true);
  }
  _sfc_main$3.__file = "components/Fields/Instagram.vue";
  const Instagram = _export_sfc(_sfc_main$3, [
    [
      "render",
      _sfc_render$3
    ],
    [
      "__file",
      "/home/runner/work/vido/vido/components/Fields/Instagram.vue"
    ]
  ]);
  const siteStore = defineStore("site", {
    state: () => ({
      locale: null
    })
  });
  const DateFormatLocales = {
    en: enGB,
    fr,
    es
  };
  const _sfc_main$2 = defineNuxtComponent({
    props: {
      date: {
        type: [
          Date,
          String
        ],
        required: true
      }
    },
    computed: {
      ...mapState(siteStore, [
        "locale"
      ]),
      formatLocale() {
        return {
          locale: this.locale && (DateFormatLocales == null ? void 0 : DateFormatLocales[this.locale]) || enGB
        };
      }
    },
    methods: {
      displayTime() {
        const today = new Date();
        return formatRelative(new Date(this.date), today, this.formatLocale);
      }
    }
  });
  function _sfc_render$2(_ctx, _cache, $props, $setup, $data, $options) {
    return openBlock(), createElementBlock("span", null, toDisplayString(_ctx.displayTime()), 1);
  }
  _sfc_main$2.__file = "components/UI/RelativeDate.vue";
  const RelativeDate = _export_sfc(_sfc_main$2, [
    [
      "render",
      _sfc_render$2
    ],
    [
      "__file",
      "/home/runner/work/vido/vido/components/UI/RelativeDate.vue"
    ]
  ]);
  const PointTime = [
    /^collection_times$/,
    /^service_times$/
  ];
  const SupportedOsmKeys = [
    ...PointTime,
    /^opening_hours$/,
    /^opening_hours:.+/,
    /.+:opening_hours$/,
    /.+:opening_hours:.+/,
    /^smoking_hours$/,
    /^happy_hours$/,
    /^lit$/
  ];
  function isSupportedOsmTags(keys, key) {
    return keys.some((regexKey) => regexKey.test(key));
  }
  function isOpeningHoursSupportedOsmTags(key) {
    return isSupportedOsmTags(SupportedOsmKeys, key);
  }
  const _sfc_main$1 = defineNuxtComponent({
    components: {
      RelativeDate
    },
    props: {
      context: {
        type: String,
        required: true
      },
      tagKey: {
        type: String,
        required: true
      },
      openingHours: {
        type: String,
        required: true
      },
      baseDate: {
        type: Date,
        default: () => new Date()
      }
    },
    computed: {
      ...mapState(siteStore, [
        "locale"
      ]),
      isPointTime() {
        return isSupportedOsmTags(PointTime, this.tagKey);
      },
      isCompact() {
        return this.context === PropertyTranslationsContextEnum.Card;
      },
      pretty() {
        const oh = this.OpeningHoursFactory();
        if (oh) {
          let prettyString;
          try {
            prettyString = oh.prettifyValue({
              conf: {
                locale: this.locale || "en",
                rule_sep_string: "\n",
                print_semicolon: false
              }
            }).replace(/(^\w|\s\w)/g, (c) => c.toUpperCase()).split("\n");
          } catch (e) {
            console.log("Vido error:", e);
            return void 0;
          }
          if (!this.variable) {
            return [
              [
                void 0,
                prettyString
              ]
            ];
          } else {
            const ret = [];
            prettyString.map((row) => row.indexOf(": ") >= 0 ? [
              row.slice(0, row.indexOf(": ")),
              row.slice(row.indexOf(": ") + 1 + 1)
            ] : [
              void 0,
              row
            ]).forEach(([month, date]) => {
              const i = ret.findIndex((r) => r[0] == month);
              if (i >= 0) {
                ret[i][1].push(date);
              } else {
                ret.push([
                  month,
                  [
                    date
                  ]
                ]);
              }
            });
            return ret;
          }
        } else {
          return void 0;
        }
      },
      variable() {
        const oh = this.OpeningHoursFactory();
        try {
          return !Boolean(oh == null ? void 0 : oh.isWeekStable());
        } catch (e) {
          console.log("Vido error:", e);
          return false;
        }
      },
      nextChange() {
        const oh = this.OpeningHoursFactory();
        if (oh) {
          try {
            const nextChange = oh.getNextChange(this.baseDate);
            if (nextChange) {
              return {
                type: oh.getState(this.baseDate) ? "opened" : "openAt",
                nextChange
              };
            }
          } catch (e) {
            console.log("Vido error:", e);
            return void 0;
          }
        }
        return void 0;
      }
    },
    methods: {
      OpeningHoursFactory() {
        try {
          const optionalConf = {
            tag_key: this.tagKey
          };
          return new OpeningHours$1(this.openingHours, {
            lon: (this.$settings.bbox_line.coordinates[0][1] + this.$settings.bbox_line.coordinates[1][1]) / 2,
            lat: (this.$settings.bbox_line.coordinates[0][0] + this.$settings.bbox_line.coordinates[1][0]) / 2,
            address: {
              country_code: this.$settings.default_country,
              state: this.$settings.default_country_state_opening_hours
            }
          }, optionalConf);
        } catch (e) {
          console.log("Vido error:", e);
        }
      }
    }
  });
  const _hoisted_1$1 = {
    key: 0
  };
  const _hoisted_2$1 = {
    hidden: ""
  };
  const _hoisted_3$1 = {
    key: 0,
    id: "next",
    class: "tw-text-emerald-500"
  };
  const _hoisted_4$1 = {
    key: 0,
    id: "opened",
    class: "tw-text-emerald-500"
  };
  const _hoisted_5$1 = {
    key: 1,
    id: "openAt",
    class: "tw-text-red-500"
  };
  const _hoisted_6$1 = createBaseVNode("br", null, null, -1);
  const _hoisted_7$1 = {
    key: 0
  };
  const _hoisted_8 = {
    key: 1
  };
  const _hoisted_9 = {
    key: 2
  };
  const _hoisted_10 = {
    key: 3
  };
  function _sfc_render$1(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_RelativeDate = resolveComponent("RelativeDate");
    return _ctx.openingHours ? (openBlock(), createElementBlock("div", _hoisted_1$1, [
      createBaseVNode("span", _hoisted_2$1, toDisplayString(_ctx.openingHours), 1),
      _ctx.nextChange ? (openBlock(), createElementBlock(Fragment, {
        key: 0
      }, [
        _ctx.isPointTime ? (openBlock(), createElementBlock("p", _hoisted_3$1, [
          createTextVNode(toDisplayString(_ctx.$t("openingHours.next")) + " ", 1),
          createVNode(_component_RelativeDate, {
            date: _ctx.nextChange.nextChange
          }, null, 8, [
            "date"
          ])
        ])) : (openBlock(), createElementBlock(Fragment, {
          key: 1
        }, [
          _ctx.nextChange.type === "opened" ? (openBlock(), createElementBlock("p", _hoisted_4$1, [
            createTextVNode(toDisplayString(_ctx.$t("openingHours.opened")) + " ", 1),
            _ctx.nextChange.nextChange ? (openBlock(), createElementBlock(Fragment, {
              key: 0
            }, [
              createTextVNode(" - " + toDisplayString(_ctx.$t("openingHours.closeAt")) + " ", 1),
              createVNode(_component_RelativeDate, {
                date: _ctx.nextChange.nextChange
              }, null, 8, [
                "date"
              ])
            ], 64)) : createCommentVNode("v-if", true)
          ])) : _ctx.nextChange.type === "openAt" ? (openBlock(), createElementBlock("p", _hoisted_5$1, [
            createTextVNode(toDisplayString(_ctx.$t("openingHours.closed")) + " ", 1),
            _ctx.nextChange.nextChange ? (openBlock(), createElementBlock(Fragment, {
              key: 0
            }, [
              createTextVNode(" - " + toDisplayString(_ctx.$t("openingHours.openAt")) + " ", 1),
              createVNode(_component_RelativeDate, {
                date: _ctx.nextChange.nextChange
              }, null, 8, [
                "date"
              ])
            ], 64)) : createCommentVNode("v-if", true)
          ])) : createCommentVNode("v-if", true)
        ], 64))
      ], 64)) : createCommentVNode("v-if", true),
      !_ctx.isCompact ? (openBlock(), createElementBlock(Fragment, {
        key: 1
      }, [
        _hoisted_6$1,
        _ctx.pretty && !_ctx.pretty[0][0] && _ctx.pretty[0][1].length == 1 ? (openBlock(), createElementBlock("div", _hoisted_7$1, toDisplayString(_ctx.pretty[0][1][0]), 1)) : _ctx.pretty && !_ctx.pretty[0][0] ? (openBlock(), createElementBlock("ul", _hoisted_8, [
          (openBlock(true), createElementBlock(Fragment, null, renderList(_ctx.pretty[0][1], (row, i) => {
            return openBlock(), createElementBlock("li", {
              key: i
            }, toDisplayString(row), 1);
          }), 128))
        ])) : _ctx.pretty ? (openBlock(), createElementBlock("ul", _hoisted_9, [
          (openBlock(true), createElementBlock(Fragment, null, renderList(_ctx.pretty, ([month, dates]) => {
            return openBlock(), createElementBlock("li", {
              key: month
            }, [
              createTextVNode(toDisplayString(month) + " ", 1),
              createBaseVNode("ul", null, [
                (openBlock(true), createElementBlock(Fragment, null, renderList(dates, (row, i) => {
                  return openBlock(), createElementBlock("li", {
                    key: i
                  }, toDisplayString(row), 1);
                }), 128))
              ])
            ]);
          }), 128))
        ])) : createCommentVNode("v-if", true),
        _ctx.variable ? (openBlock(), createElementBlock("p", _hoisted_10, toDisplayString(_ctx.$t("openingHours.variableWeek")), 1)) : createCommentVNode("v-if", true)
      ], 64)) : createCommentVNode("v-if", true)
    ])) : createCommentVNode("v-if", true);
  }
  _sfc_main$1.__file = "components/Fields/OpeningHours.vue";
  const OpeningHours = _export_sfc(_sfc_main$1, [
    [
      "render",
      _sfc_render$1
    ],
    [
      "__file",
      "/home/runner/work/vido/vido/components/Fields/OpeningHours.vue"
    ]
  ]);
  const Field_vue_vue_type_style_index_0_scoped_32605bb6_lang = "";
  isFiledEmpty = function(field, properties, geom) {
    if (field.field == "route") {
      return isRoutesFieldEmpty(properties);
    } else if (field.field === "addr") {
      return isAddressFieldEmpty(properties);
    } else if (field.field == "start_end_date") {
      return isDateRangeEmpty(properties);
    } else if (field.field === "coordinates") {
      return isCoordinatesEmpty(geom);
    } else {
      return !(field.field in properties);
    }
  };
  const _sfc_main = defineNuxtComponent({
    components: {
      FontAwesomeIcon,
      FieldsHeader,
      OpeningHours,
      RoutesField,
      AddressField,
      DateRange,
      Coordinates,
      Phone,
      Facebook,
      Instagram,
      ExternalLink,
      Stars
    },
    emits: {
      "click-details": () => true
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
      field: {
        type: Object,
        required: true
      },
      properties: {
        type: Object,
        required: true
      },
      details: {
        type: String,
        default: null
      },
      geom: {
        type: Object,
        required: true
      }
    },
    data() {
      return {
        textLimit: 130
      };
    },
    computed: {
      shortDescription() {
        var _a, _b;
        return (_b = (_a = this.properties) == null ? void 0 : _a.description) == null ? void 0 : _b.replace(/(<([^>]+)>)/gi, "");
      }
    },
    methods: {
      fieldTranslateK(field) {
        return this.$propertyTranslations.p(field, this.context);
      },
      propTranslateV(field) {
        return this.$propertyTranslations.pv(field, this.properties[field], this.context);
      },
      propTranslateVs(field, value) {
        return this.$propertyTranslations.pv(field, value, this.context);
      },
      isOpeningHoursSupportedOsmTags(key) {
        return isOpeningHoursSupportedOsmTags(key);
      }
    }
  });
  const _hoisted_1 = {
    key: 4,
    class: "inline"
  };
  const _hoisted_2 = [
    "href"
  ];
  const _hoisted_3 = {
    key: 5
  };
  const _hoisted_4 = [
    "innerHTML"
  ];
  const _hoisted_5 = {
    key: 5
  };
  const _hoisted_6 = [
    "href"
  ];
  const _hoisted_7 = {
    key: 11
  };
  function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_FieldsHeader = resolveComponent("FieldsHeader");
    const _component_RoutesField = resolveComponent("RoutesField");
    const _component_AddressField = resolveComponent("AddressField");
    const _component_DateRange = resolveComponent("DateRange");
    const _component_Coordinates = resolveComponent("Coordinates");
    const _component_Phone = resolveComponent("Phone");
    const _component_ExternalLink = resolveComponent("ExternalLink");
    const _component_Facebook = resolveComponent("Facebook");
    const _component_Instagram = resolveComponent("Instagram");
    const _component_Stars = resolveComponent("Stars");
    const _component_FontAwesomeIcon = resolveComponent("FontAwesomeIcon");
    const _component_OpeningHours = resolveComponent("OpeningHours");
    return _ctx.field.field == "route" ? (openBlock(), createBlock(_component_RoutesField, {
      key: 0,
      class: "field_content",
      context: _ctx.context,
      "recursion-stack": _ctx.recursionStack,
      properties: _ctx.properties
    }, {
      default: withCtx(() => [
        _ctx.field.label ? (openBlock(), createBlock(_component_FieldsHeader, {
          key: 0,
          "recursion-stack": _ctx.recursionStack,
          class: normalizeClass(`field_header_level_${_ctx.recursionStack.length}`)
        }, {
          default: withCtx(() => [
            createTextVNode(toDisplayString(_ctx.fieldTranslateK(_ctx.field.field)), 1)
          ]),
          _: 1
        }, 8, [
          "recursion-stack",
          "class"
        ])) : createCommentVNode("v-if", true)
      ]),
      _: 1
    }, 8, [
      "context",
      "recursion-stack",
      "properties"
    ])) : _ctx.field.field === "addr" ? (openBlock(), createBlock(_component_AddressField, {
      key: 1,
      properties: _ctx.properties
    }, {
      default: withCtx(() => [
        _ctx.field.label ? (openBlock(), createBlock(_component_FieldsHeader, {
          key: 0,
          "recursion-stack": _ctx.recursionStack,
          class: normalizeClass(`field_header_level_${_ctx.recursionStack.length}`)
        }, {
          default: withCtx(() => [
            createTextVNode(toDisplayString(_ctx.fieldTranslateK(_ctx.field.field)), 1)
          ]),
          _: 1
        }, 8, [
          "recursion-stack",
          "class"
        ])) : createCommentVNode("v-if", true)
      ]),
      _: 1
    }, 8, [
      "properties"
    ])) : _ctx.field.field === "start_end_date" ? (openBlock(), createBlock(_component_DateRange, {
      key: 2,
      start: _ctx.properties.start_date,
      end: _ctx.properties.end_date,
      class: normalizeClass(`field_content_level_${_ctx.recursionStack.length}`)
    }, {
      default: withCtx(() => [
        _ctx.field.label ? (openBlock(), createBlock(_component_FieldsHeader, {
          key: 0,
          "recursion-stack": _ctx.recursionStack,
          class: normalizeClass(`field_header_level_${_ctx.recursionStack.length}`)
        }, {
          default: withCtx(() => [
            createTextVNode(toDisplayString(_ctx.fieldTranslateK(_ctx.field.field)), 1)
          ]),
          _: 1
        }, 8, [
          "recursion-stack",
          "class"
        ])) : createCommentVNode("v-if", true)
      ]),
      _: 1
    }, 8, [
      "start",
      "end",
      "class"
    ])) : _ctx.field.field === "coordinates" ? (openBlock(), createBlock(_component_Coordinates, {
      key: 3,
      geom: _ctx.geom
    }, {
      default: withCtx(() => [
        _ctx.field.label ? (openBlock(), createBlock(_component_FieldsHeader, {
          key: 0,
          "recursion-stack": _ctx.recursionStack,
          class: normalizeClass(`field_header_level_${_ctx.recursionStack.length}`)
        }, {
          default: withCtx(() => [
            createTextVNode(toDisplayString(_ctx.fieldTranslateK(_ctx.field.field)), 1)
          ]),
          _: 1
        }, 8, [
          "recursion-stack",
          "class"
        ])) : createCommentVNode("v-if", true)
      ]),
      _: 1
    }, 8, [
      "geom"
    ])) : _ctx.field.field == "short_description" && _ctx.shortDescription ? (openBlock(), createElementBlock("div", _hoisted_1, [
      _ctx.field.label ? (openBlock(), createBlock(_component_FieldsHeader, {
        key: 0,
        "recursion-stack": void 0,
        class: normalizeClass(`field_header_level_${_ctx.recursionStack.length}`)
      }, {
        default: withCtx(() => [
          createTextVNode(toDisplayString(_ctx.fieldTranslateK(_ctx.field.field)), 1)
        ]),
        _: 1
      }, 8, [
        "class"
      ])) : createCommentVNode("v-if", true),
      createTextVNode(" " + toDisplayString(_ctx.shortDescription.substring(0, _ctx.textLimit)) + " ", 1),
      _ctx.shortDescription.length > _ctx.textLimit ? (openBlock(), createElementBlock(Fragment, {
        key: 1
      }, [
        createTextVNode("\u2026")
      ], 64)) : createCommentVNode("v-if", true),
      Boolean(_ctx.details) && _ctx.shortDescription.length > _ctx.textLimit ? (openBlock(), createElementBlock("a", {
        key: 2,
        class: "tw-underline",
        href: _ctx.details,
        rel: "noopener noreferrer",
        target: "_blank",
        onClick: _cache[0] || (_cache[0] = withModifiers(($event) => _ctx.$emit("click-details"), [
          "stop"
        ]))
      }, toDisplayString(_ctx.$t("poiCard.seeDetail")), 9, _hoisted_2)) : createCommentVNode("v-if", true)
    ])) : _ctx.properties[_ctx.field.field] ? (openBlock(), createElementBlock("div", _hoisted_3, [
      _ctx.field.label ? (openBlock(), createBlock(_component_FieldsHeader, {
        key: 0,
        "recursion-stack": _ctx.recursionStack,
        class: normalizeClass(`field_header_level_${_ctx.recursionStack.length}`)
      }, {
        default: withCtx(() => [
          createTextVNode(toDisplayString(_ctx.fieldTranslateK(_ctx.field.field)), 1)
        ]),
        _: 1
      }, 8, [
        "recursion-stack",
        "class"
      ])) : createCommentVNode("v-if", true),
      createBaseVNode("div", {
        class: normalizeClass(`inline field_content_level_${_ctx.recursionStack.length}`)
      }, [
        _ctx.field.field == "description" ? (openBlock(), createElementBlock("div", {
          key: 0,
          class: "tw-prose",
          innerHTML: _ctx.properties.description
        }, null, 8, _hoisted_4)) : _ctx.field.field === "phone" || _ctx.field.field === "mobile" ? (openBlock(true), createElementBlock(Fragment, {
          key: 1
        }, renderList(_ctx.properties[_ctx.field.field], (phone) => {
          return openBlock(), createBlock(_component_Phone, {
            key: "phone_" + phone,
            number: phone
          }, null, 8, [
            "number"
          ]);
        }), 128)) : _ctx.field.field == "website" ? (openBlock(true), createElementBlock(Fragment, {
          key: 2
        }, renderList(_ctx.properties[_ctx.field.field], (item) => {
          return openBlock(), createBlock(_component_ExternalLink, {
            key: "website_" + item,
            href: item,
            target: "_blank"
          }, {
            default: withCtx(() => [
              createTextVNode(toDisplayString(item), 1)
            ]),
            _: 2
          }, 1032, [
            "href"
          ]);
        }), 128)) : _ctx.field.field == "email" ? (openBlock(true), createElementBlock(Fragment, {
          key: 3
        }, renderList(_ctx.properties[_ctx.field.field], (item) => {
          return openBlock(), createBlock(_component_ExternalLink, {
            key: "email_" + item,
            href: `mailto:${item}`,
            icon: "envelope"
          }, {
            default: withCtx(() => [
              createTextVNode(toDisplayString(item), 1)
            ]),
            _: 2
          }, 1032, [
            "href"
          ]);
        }), 128)) : _ctx.field.field == "download" ? (openBlock(true), createElementBlock(Fragment, {
          key: 4
        }, renderList(_ctx.properties[_ctx.field.field], (item) => {
          return openBlock(), createBlock(_component_ExternalLink, {
            key: "download_" + item,
            href: item,
            icon: "arrow-circle-down"
          }, {
            default: withCtx(() => [
              createTextVNode(toDisplayString(item.split("/").pop()), 1)
            ]),
            _: 2
          }, 1032, [
            "href"
          ]);
        }), 128)) : Array.isArray(_ctx.properties[_ctx.field.field]) && _ctx.properties[_ctx.field.field].length > 0 ? (openBlock(), createElementBlock("ul", _hoisted_5, [
          (openBlock(true), createElementBlock(Fragment, null, renderList(_ctx.properties[_ctx.field.field], (item) => {
            return openBlock(), createElementBlock("li", {
              key: _ctx.field.field + "_" + item
            }, toDisplayString(_ctx.propTranslateVs(_ctx.field.field, item)), 1);
          }), 128))
        ])) : _ctx.field.field === "facebook" ? (openBlock(), createBlock(_component_Facebook, {
          key: 6,
          url: _ctx.properties[_ctx.field.field]
        }, null, 8, [
          "url"
        ])) : _ctx.field.field === "instagram" ? (openBlock(), createBlock(_component_Instagram, {
          key: 7,
          url: _ctx.properties[_ctx.field.field]
        }, null, 8, [
          "url"
        ])) : _ctx.field.field === "stars" ? (openBlock(), createBlock(_component_Stars, {
          key: 8,
          stars: _ctx.properties[_ctx.field.field]
        }, null, 8, [
          "stars"
        ])) : _ctx.field.field == "route:gpx_trace" || _ctx.field.field == "route:pdf" ? (openBlock(), createElementBlock("a", {
          key: 9,
          href: _ctx.properties[_ctx.field.field]
        }, [
          createVNode(_component_FontAwesomeIcon, {
            prefix: "fa",
            icon: "arrow-circle-down"
          }),
          createTextVNode(" " + toDisplayString(_ctx.fieldTranslateK(_ctx.field.field)), 1)
        ], 8, _hoisted_6)) : _ctx.isOpeningHoursSupportedOsmTags(_ctx.field.field) ? (openBlock(), createBlock(_component_OpeningHours, {
          key: 10,
          "opening-hours": _ctx.properties[_ctx.field.field],
          context: _ctx.context,
          "tag-key": _ctx.field.field
        }, null, 8, [
          "opening-hours",
          "context",
          "tag-key"
        ])) : (openBlock(), createElementBlock("span", _hoisted_7, toDisplayString(_ctx.propTranslateV(_ctx.field.field)), 1))
      ], 2)
    ])) : createCommentVNode("v-if", true);
  }
  _sfc_main.__file = "components/Fields/Field.vue";
  Field = _export_sfc(_sfc_main, [
    [
      "render",
      _sfc_render
    ],
    [
      "__scopeId",
      "data-v-32605bb6"
    ],
    [
      "__file",
      "/home/runner/work/vido/vido/components/Fields/Field.vue"
    ]
  ]);
});
export {
  Field as F,
  __tla,
  isFiledEmpty as a,
  coordinatesHref as c,
  isIOS as i
};
