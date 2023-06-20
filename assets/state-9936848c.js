import { c as clientSupportPlugins, __tla as __tla_0 } from "./__resolved__virtual__histoire-support-plugins-client-e7af8c94.js";
import { d as defineComponent, r as ref, W as watchEffect, V as markRaw, o as openBlock, q as createBlock, X as mergeProps, Y as resolveDynamicComponent, h as createCommentVNode, E as reactive, v as isRef, a as unref, __tla as __tla_1 } from "./vendor-bd688624.js";
import { h as histoireConfig } from "./config-23d2cc81.js";
let EVENT_SEND, PREVIEW_SETTINGS_SYNC, STATE_SYNC, _sfc_main, applyPreviewSettings, SANDBOX_READY, getContrastColor, toRawDeep;
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
  const __default__ = {
    inheritAttrs: false
  };
  _sfc_main = defineComponent({
    ...__default__,
    __name: "GenericRenderStory",
    props: {
      story: null
    },
    setup(__props) {
      const props = __props;
      const mountComponent = ref(null);
      watchEffect(async () => {
        var _a;
        const clientPlugin = clientSupportPlugins[(_a = props.story.file) == null ? void 0 : _a.supportPluginId];
        if (clientPlugin) {
          try {
            const pluginModule = await clientPlugin();
            mountComponent.value = markRaw(pluginModule.RenderStory);
          } catch (e) {
            console.error(e);
            throw e;
          }
        }
      });
      return (_ctx, _cache) => {
        return mountComponent.value ? (openBlock(), createBlock(resolveDynamicComponent(mountComponent.value), mergeProps({
          key: 0,
          class: "histoire-generic-render-story __histoire-render-story",
          story: __props.story
        }, _ctx.$attrs), null, 16, [
          "story"
        ])) : createCommentVNode("", true);
      };
    }
  });
  STATE_SYNC = "__histoire:state-sync";
  SANDBOX_READY = "__histoire:sandbox-ready";
  EVENT_SEND = "__histoire:event";
  PREVIEW_SETTINGS_SYNC = "__histoire:preview-settings-sync";
  const receivedSettings = reactive({});
  applyPreviewSettings = function(settings) {
    Object.assign(receivedSettings, settings);
    document.documentElement.setAttribute("dir", settings.textDirection);
    const contrastColor = getContrastColor(settings);
    document.documentElement.style.setProperty("--histoire-contrast-color", contrastColor);
    if (histoireConfig.autoApplyContrastColor) {
      document.documentElement.style.color = contrastColor;
    }
  };
  getContrastColor = function(setting) {
    var _a;
    return ((_a = histoireConfig.backgroundPresets.find((preset) => preset.color === setting.backgroundColor)) == null ? void 0 : _a.contrastColor) ?? "unset";
  };
  const isObject = (val) => val !== null && typeof val === "object";
  toRawDeep = function(val, clean = false, seen = /* @__PURE__ */ new WeakMap()) {
    const unwrappedValue = isRef(val) ? unref(val) : val;
    if (typeof unwrappedValue === "symbol") {
      return unwrappedValue.toString();
    }
    if (!isObject(unwrappedValue)) {
      return unwrappedValue;
    }
    if (seen.has(unwrappedValue)) {
      return seen.get(unwrappedValue);
    }
    if (Array.isArray(unwrappedValue)) {
      const result = [];
      seen.set(unwrappedValue, result);
      let list = unwrappedValue.map((value) => toRawDeep(value, clean, seen));
      if (clean) {
        list = list.filter((value) => typeof value !== "function");
      }
      result.push(...list);
      return result;
    } else {
      const result = {};
      seen.set(unwrappedValue, result);
      toRawObject(unwrappedValue, result, clean, seen);
      return result;
    }
  };
  const toRawObject = (obj, target, clean = false, seen = /* @__PURE__ */ new WeakMap()) => {
    Object.keys(obj).forEach((key) => {
      if (clean && typeof obj[key] === "function") {
        return;
      }
      target[key] = toRawDeep(obj[key], clean, seen);
    });
  };
});
export {
  EVENT_SEND as E,
  PREVIEW_SETTINGS_SYNC as P,
  STATE_SYNC as S,
  _sfc_main as _,
  __tla,
  applyPreviewSettings as a,
  SANDBOX_READY as b,
  getContrastColor as g,
  toRawDeep as t
};
