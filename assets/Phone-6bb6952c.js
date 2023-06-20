import { aE as defineNuxtComponent, aK as FontAwesomeIcon, as as _export_sfc, au as resolveComponent, ax as openBlock, ay as createElementBlock, aB as createVNode, aF as renderSlot, aJ as createCommentVNode, av as createBlock, aw as withCtx, aH as createTextVNode, aI as toDisplayString, __tla as __tla_0 } from "./vendor-c1ea6bed.js";
let ExternalLink, Phone;
let __tla = Promise.all([
  (() => {
    try {
      return __tla_0;
    } catch {
    }
  })()
]).then(async () => {
  const _sfc_main$1 = defineNuxtComponent({
    components: {
      FontAwesomeIcon
    },
    props: {
      href: {
        type: String,
        required: true
      },
      title: {
        type: String,
        default: null
      },
      target: {
        type: String,
        default: "_blank"
      },
      rel: {
        type: String,
        default: null
      },
      icon: {
        type: String,
        default: null
      }
    },
    computed: {
      iconDefault() {
        if (this.icon) {
          return this.icon;
        } else if (this.href.startsWith("tel:")) {
          return "phone";
        } else {
          return "external-link-alt";
        }
      }
    }
  });
  const _hoisted_1$1 = [
    "href",
    "target",
    "rel",
    "title"
  ];
  function _sfc_render$1(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_FontAwesomeIcon = resolveComponent("FontAwesomeIcon");
    return _ctx.href ? (openBlock(), createElementBlock("a", {
      key: 0,
      href: _ctx.href,
      target: _ctx.target,
      rel: _ctx.rel,
      title: _ctx.title,
      class: "tw-flex tw-flex-row tw-items-center tw-gap-x-2.5 tw-underline tw-underline-offset-4"
    }, [
      createVNode(_component_FontAwesomeIcon, {
        icon: _ctx.iconDefault,
        color: "inherit",
        size: "sm"
      }, null, 8, [
        "icon"
      ]),
      renderSlot(_ctx.$slots, "default")
    ], 8, _hoisted_1$1)) : createCommentVNode("v-if", true);
  }
  _sfc_main$1.__file = "components/UI/ExternalLink.vue";
  ExternalLink = _export_sfc(_sfc_main$1, [
    [
      "render",
      _sfc_render$1
    ],
    [
      "__file",
      "/home/runner/work/vido/vido/components/UI/ExternalLink.vue"
    ]
  ]);
  const _sfc_main = defineNuxtComponent({
    components: {
      ExternalLink
    },
    props: {
      number: {
        type: String,
        default: null
      }
    },
    computed: {
      numberFormated() {
        return this.number.replaceAll(" ", "\xA0");
      },
      phone() {
        return this.$device.value.phone;
      }
    }
  });
  const _hoisted_1 = {
    key: 1
  };
  function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_ExternalLink = resolveComponent("ExternalLink");
    return _ctx.phone ? (openBlock(), createBlock(_component_ExternalLink, {
      key: 0,
      href: `tel:${_ctx.number}`,
      title: _ctx.$t("fields.phone.callNumber")
    }, {
      default: withCtx(() => [
        createTextVNode(toDisplayString(_ctx.numberFormated), 1)
      ]),
      _: 1
    }, 8, [
      "href",
      "title"
    ])) : (openBlock(), createElementBlock("span", _hoisted_1, toDisplayString(_ctx.numberFormated), 1));
  }
  _sfc_main.__file = "components/Fields/Phone.vue";
  Phone = _export_sfc(_sfc_main, [
    [
      "render",
      _sfc_render
    ],
    [
      "__file",
      "/home/runner/work/vido/vido/components/Fields/Phone.vue"
    ]
  ]);
});
export {
  ExternalLink as E,
  Phone as P,
  __tla
};
