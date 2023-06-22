import { aE as defineNuxtComponent, aK as FontAwesomeIcon, as as _export_sfc, au as resolveComponent, ax as openBlock, ay as createElementBlock, aG as createBaseVNode, aF as renderSlot, aB as createVNode, aS as normalizeClass, b6 as normalizeStyle, aA as Fragment, az as renderList, av as createBlock, aw as withCtx, aH as createTextVNode, aI as toDisplayString, aJ as createCommentVNode, at as defineComponent, aC as normalizeProps, aD as guardReactiveProps, __tla as __tla_0 } from "./vendor-cc850437.js";
import { F as Field, a as isFiledEmpty, __tla as __tla_1 } from "./Field-43bb16b8.js";
import { F as FieldsHeader, __tla as __tla_2 } from "./RoutesField-0c089ce5.js";
import { P as PropertyTranslationsContextEnum, __tla as __tla_3 } from "./property-translations-9fdfb1f5.js";
import { __tla as __tla_4 } from "./Phone-52480e95.js";
import { __tla as __tla_5 } from "./DateRange-b424399d.js";
import { __tla as __tla_6 } from "./Stars-c6e8b43a.js";
let FieldsGroup_story;
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
  })(),
  (() => {
    try {
      return __tla_6;
    } catch {
    }
  })()
]).then(async () => {
  const Block_vue_vue_type_style_index_0_scoped_37d53f8e_lang = "";
  const _sfc_main$2 = defineNuxtComponent({
    components: {
      FontAwesomeIcon
    },
    props: {
      colorFill: {
        type: String,
        required: true
      },
      icon: {
        type: String,
        required: true
      }
    }
  });
  const _hoisted_1$1 = {
    class: "tw-relative tw-z-10"
  };
  function _sfc_render$2(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_FontAwesomeIcon = resolveComponent("FontAwesomeIcon");
    return openBlock(), createElementBlock("div", {
      class: normalizeClass([
        "block-block",
        "tw-relative tw-detail-left-block tw-flex tw-flex-col tw-justify-start tw-z-0"
      ]),
      style: normalizeStyle(`
      background-color: ${_ctx.colorFill};
    `)
    }, [
      createBaseVNode("div", _hoisted_1$1, [
        renderSlot(_ctx.$slots, "default", {
          id: "block-content"
        }, void 0, true)
      ]),
      createVNode(_component_FontAwesomeIcon, {
        prefix: "fa",
        icon: _ctx.icon,
        class: normalizeClass([
          "block-block-icon",
          "tw-absolute tw-z-0"
        ])
      }, null, 8, [
        "icon"
      ])
    ], 4);
  }
  _sfc_main$2.__file = "components/PoisDetails/Block.vue";
  const Block = _export_sfc(_sfc_main$2, [
    [
      "render",
      _sfc_render$2
    ],
    [
      "__scopeId",
      "data-v-37d53f8e"
    ],
    [
      "__file",
      "/home/runner/work/vido/vido/components/PoisDetails/Block.vue"
    ]
  ]);
  const FieldsGroup_vue_vue_type_style_index_0_scoped_80a8464d_lang = "";
  const _sfc_main$1 = defineNuxtComponent({
    name: "FieldsGroup",
    components: {
      Block,
      FieldsHeader,
      Field
    },
    props: {
      recursionStack: {
        type: Array,
        default: () => []
      },
      group: {
        type: Object,
        required: true
      },
      properties: {
        type: Object,
        required: true
      },
      geom: {
        type: Object,
        required: true
      },
      colorFill: {
        type: String,
        required: true
      }
    },
    data() {
      return {
        empty: true
      };
    },
    computed: {
      context() {
        return PropertyTranslationsContextEnum.Details;
      }
    },
    methods: {
      fieldTranslateK(field) {
        return this.$propertyTranslations.p(field, this.context);
      },
      isListEmpty(fileds, properties, geom) {
        return !fileds || fileds.reduce((sum, value) => sum && (value.group !== void 0 ? this.isListEmpty(value.fields, properties, geom) : isFiledEmpty(value, properties, geom)), true);
      }
    }
  });
  const _hoisted_1 = {
    key: 0,
    class: "block"
  };
  const _hoisted_2 = {
    key: 0
  };
  function _sfc_render$1(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_FieldsHeader = resolveComponent("FieldsHeader");
    const _component_FieldsGroup = resolveComponent("FieldsGroup", true);
    const _component_Block = resolveComponent("Block");
    const _component_Field = resolveComponent("Field");
    return openBlock(), createElementBlock("div", null, [
      (openBlock(true), createElementBlock(Fragment, null, renderList(_ctx.group.fields, (field) => {
        return openBlock(), createElementBlock(Fragment, {
          key: field.group
        }, [
          field.group !== void 0 && !_ctx.isListEmpty(field.fields, _ctx.properties, _ctx.geom) ? (openBlock(), createElementBlock("div", _hoisted_1, [
            field.display_mode === "standard" ? (openBlock(), createElementBlock("div", _hoisted_2, [
              _ctx.fieldTranslateK(field.group) ? (openBlock(), createBlock(_component_FieldsHeader, {
                key: 0,
                "recursion-stack": _ctx.recursionStack
              }, {
                default: withCtx(() => [
                  createTextVNode(toDisplayString(_ctx.fieldTranslateK(field.group)), 1)
                ]),
                _: 2
              }, 1032, [
                "recursion-stack"
              ])) : createCommentVNode("v-if", true),
              createVNode(_component_FieldsGroup, {
                id: `FieldsGroup-${_ctx.recursionStack.join("-")}-${field.group}`,
                "recursion-stack": [
                  ..._ctx.recursionStack,
                  field.group
                ],
                group: field,
                properties: _ctx.properties,
                geom: _ctx.geom,
                "color-fill": _ctx.colorFill
              }, null, 8, [
                "id",
                "recursion-stack",
                "group",
                "properties",
                "geom",
                "color-fill"
              ])
            ])) : field.display_mode === "card" ? (openBlock(), createBlock(_component_Block, {
              key: 1,
              "color-fill": _ctx.colorFill,
              icon: field.icon
            }, {
              default: withCtx(() => [
                _ctx.fieldTranslateK(field.group) ? (openBlock(), createBlock(_component_FieldsHeader, {
                  key: 0,
                  "recursion-stack": _ctx.recursionStack
                }, {
                  default: withCtx(() => [
                    createTextVNode(toDisplayString(_ctx.fieldTranslateK(field.group)), 1)
                  ]),
                  _: 2
                }, 1032, [
                  "recursion-stack"
                ])) : createCommentVNode("v-if", true),
                createVNode(_component_FieldsGroup, {
                  id: `FieldsGroup-${_ctx.recursionStack.join("-")}-${field.group}`,
                  "recursion-stack": [
                    ..._ctx.recursionStack,
                    field.group
                  ],
                  group: field,
                  properties: _ctx.properties,
                  geom: _ctx.geom,
                  "color-fill": _ctx.colorFill
                }, null, 8, [
                  "id",
                  "recursion-stack",
                  "group",
                  "properties",
                  "geom",
                  "color-fill"
                ])
              ]),
              _: 2
            }, 1032, [
              "color-fill",
              "icon"
            ])) : createCommentVNode("v-if", true)
          ])) : field.group === void 0 ? (openBlock(), createBlock(_component_Field, {
            key: 1,
            id: `Field_-${_ctx.recursionStack.join("-")}-${field.field}`,
            context: _ctx.context,
            "recursion-stack": _ctx.recursionStack,
            field,
            properties: _ctx.properties,
            geom: _ctx.geom,
            class: "field"
          }, null, 8, [
            "id",
            "context",
            "recursion-stack",
            "field",
            "properties",
            "geom"
          ])) : createCommentVNode("v-if", true)
        ], 64);
      }), 128))
    ]);
  }
  _sfc_main$1.__file = "components/PoisDetails/FieldsGroup.vue";
  const FieldsGroup = _export_sfc(_sfc_main$1, [
    [
      "render",
      _sfc_render$1
    ],
    [
      "__scopeId",
      "data-v-80a8464d"
    ],
    [
      "__file",
      "/home/runner/work/vido/vido/components/PoisDetails/FieldsGroup.vue"
    ]
  ]);
  const _sfc_main = defineComponent({
    __name: "FieldsGroup.story",
    setup(__props, { expose }) {
      expose();
      const defaultProps = {
        group: {
          group: "",
          display_mode: "standard",
          icon: "",
          fields: [
            {
              group: "contact",
              display_mode: "standard",
              icon: "phone",
              fields: [
                {
                  field: "name"
                }
              ]
            }
          ]
        },
        colorFill: "#f76Ffe",
        properties: {
          metadata: {
            id: 0
          },
          name: "foo"
        },
        geom: {
          type: "Point",
          coordinates: [
            0,
            0
          ]
        }
      };
      const description = "Itin\xE9raire tr\xE8s int\xE9ressant, d'une part pour sa vari\xE9t\xE9 paysag\xE8re accentu\xE9e par la travers\xE9e fr\xE9quente de cours d'eau et d'autre part, par la qualit\xE9 du patrimoine b\xE2ti : maisons traditionnelles landaises, \xE9glise en garluche. \n\nDistance : 10,2 km - Dur\xE9e : 4h45 - Animaux tenus en laisse  - Sentier p\xE9destre et VTT \nFiche rando disponible dans le topoguide du D\xE9partement des Landes du Pays de Born n\xB015 (en vente : 2 \u20AC)";
      const props = {
        Sandart: {
          ...defaultProps
        },
        Empty: {
          ...defaultProps,
          properties: {
            metadata: {
              id: 0
            }
          }
        },
        Label: {
          ...defaultProps,
          group: {
            ...defaultProps.group,
            fields: [
              {
                ...defaultProps.group.fields[0],
                fields: [
                  {
                    label: true,
                    field: "name"
                  }
                ]
              }
            ]
          }
        },
        Card: {
          ...defaultProps,
          group: {
            ...defaultProps.group,
            fields: [
              {
                ...defaultProps.group.fields[0],
                display_mode: "card"
              }
            ]
          }
        },
        Many: {
          ...defaultProps,
          group: {
            ...defaultProps.group,
            fields: [
              {
                ...defaultProps.group.fields[0],
                fields: [
                  {
                    field: "phone"
                  },
                  {
                    field: "route"
                  },
                  {
                    field: "short_description"
                  }
                ]
              }
            ]
          },
          properties: {
            metadata: {
              id: 0
            },
            phone: [
              "+33676544"
            ],
            mobile: [
              "+339750987766"
            ],
            "route:hiking:difficulty": "easy",
            "route:hiking:duration": 285,
            "route:hiking:length": 10.2,
            "route:mtb:difficulty": "easy",
            "route:mtb:duration": 90,
            "route:mtb:length": 10.2,
            "route:gpx_trace": "https://cdt40.tourinsoft.com/upload/15.8.gpx",
            "route:pdf": "https://cdt40.tourinsoft.com/upload/ITIAQU040V502MFU.pdf",
            description
          },
          details: true
        }
      };
      const __returned__ = {
        defaultProps,
        description,
        props,
        FieldsGroup
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
      title: "PoisDetails/FieldsGroup"
    }, {
      default: withCtx(() => [
        (openBlock(), createElementBlock(Fragment, null, renderList($setup.props, (p, name) => {
          return createVNode(_component_Variant, {
            key: name,
            title: name.replace(/([A-Z])/g, " $1").trim()
          }, {
            default: withCtx(() => [
              createVNode($setup["FieldsGroup"], normalizeProps(guardReactiveProps(p)), null, 16)
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
  _sfc_main.__file = "components/PoisDetails/FieldsGroup.story.vue";
  FieldsGroup_story = _export_sfc(_sfc_main, [
    [
      "render",
      _sfc_render
    ],
    [
      "__file",
      "/home/runner/work/vido/vido/components/PoisDetails/FieldsGroup.story.vue"
    ]
  ]);
});
export {
  __tla,
  FieldsGroup_story as default
};
