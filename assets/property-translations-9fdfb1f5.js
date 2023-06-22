import { aU as defineNuxtPlugin, __tla as __tla_0 } from "./vendor-cc850437.js";
let PropertyTranslationsContextEnum, property_translations_PIWCHHX3IP;
let __tla = Promise.all([
  (() => {
    try {
      return __tla_0;
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
  PropertyTranslationsContextEnum = ((PropertyTranslationsContextEnum2) => {
    PropertyTranslationsContextEnum2["Default"] = "label";
    PropertyTranslationsContextEnum2["Card"] = "label_popup";
    PropertyTranslationsContextEnum2["Details"] = "label_details";
    PropertyTranslationsContextEnum2["List"] = "label_list";
    return PropertyTranslationsContextEnum2;
  })(PropertyTranslationsContextEnum || {});
  const Default = "label";
  property_translations_PIWCHHX3IP = defineNuxtPlugin((nuxtApp) => {
    const pt = {
      propertyTranslations: {},
      set(setPropertyTranslations) {
        pt.propertyTranslations = setPropertyTranslations;
      },
      p(propertyName, context = Default) {
        const pn = pt.propertyTranslations[propertyName];
        return (_optionalChain([
          pn,
          "optionalAccess",
          (_) => _[context]
        ]) ? _optionalChain([
          pn,
          "optionalAccess",
          (_2) => _2[context],
          "optionalAccess",
          (_3) => _3.fr
        ]) : _optionalChain([
          pn,
          "optionalAccess",
          (_4) => _4[Default],
          "optionalAccess",
          (_5) => _5.fr
        ])) || propertyName;
      },
      pv(propertyName, valueName, context = Default) {
        const pn = _optionalChain([
          pt,
          "access",
          (_6) => _6.propertyTranslations,
          "access",
          (_7) => _7[propertyName],
          "optionalAccess",
          (_8) => _8.values,
          "optionalAccess",
          (_9) => _9[valueName]
        ]);
        return (_optionalChain([
          pn,
          "optionalAccess",
          (_10) => _10[context]
        ]) ? _optionalChain([
          pn,
          "optionalAccess",
          (_11) => _11[context],
          "optionalAccess",
          (_12) => _12.fr
        ]) : _optionalChain([
          pn,
          "optionalAccess",
          (_13) => _13[Default],
          "optionalAccess",
          (_14) => _14.fr
        ])) || valueName;
      }
    };
    return {
      provide: {
        propertyTranslations: pt
      }
    };
  });
});
export {
  PropertyTranslationsContextEnum as P,
  __tla,
  property_translations_PIWCHHX3IP as p
};
