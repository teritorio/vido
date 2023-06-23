import { aE as defineNuxtComponent, as as _export_sfc, au as resolveComponent, ax as openBlock, ay as createElementBlock, aA as Fragment, az as renderList, av as createBlock, __tla as __tla_0 } from "./vendor-fe86adbc.js";
import { F as Field, __tla as __tla_1 } from "./Field-ceb20a59.js";
import { P as PropertyTranslationsContextEnum, __tla as __tla_2 } from "./property-translations-1fdfea06.js";
let Fields;
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
  })()
]).then(async () => {
  const _sfc_main = defineNuxtComponent({
    components: {
      Field
    },
    props: {
      fields: {
        type: Array,
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
    computed: {
      context() {
        return PropertyTranslationsContextEnum.Card;
      }
    }
  });
  function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_Field = resolveComponent("Field");
    return openBlock(), createElementBlock("div", null, [
      (openBlock(true), createElementBlock(Fragment, null, renderList(_ctx.fields, (field) => {
        return openBlock(), createBlock(_component_Field, {
          key: field.field,
          context: _ctx.context,
          "recursion-stack": [
            field.field
          ],
          field,
          properties: _ctx.properties,
          details: _ctx.details,
          geom: _ctx.geom,
          class: "tw-mt-2"
        }, null, 8, [
          "context",
          "recursion-stack",
          "field",
          "properties",
          "details",
          "geom"
        ]);
      }), 128))
    ]);
  }
  _sfc_main.__file = "components/PoisCard/Fields.vue";
  Fields = _export_sfc(_sfc_main, [
    [
      "render",
      _sfc_render
    ],
    [
      "__file",
      "/home/runner/work/vido/vido/components/PoisCard/Fields.vue"
    ]
  ]);
});
export {
  Fields as F,
  __tla
};
