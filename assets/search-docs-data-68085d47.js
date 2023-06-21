import { V as markRaw, __tla as __tla_0 } from "./vendor-ec6df5a6.js";
let onUpdate, searchData;
let __tla = Promise.all([
  (() => {
    try {
      return __tla_0;
    } catch {
    }
  })()
]).then(async () => {
  let searchData$1 = {
    "index": {
      "reg": "{}",
      "text.cfg": '{"doc":0,"opt":1}',
      "text.map": "[{},{},{},{},{},{},{},{},{}]",
      "text.ctx": "[{}]"
    },
    "idMap": {}
  };
  searchData = markRaw(searchData$1);
  onUpdate = function(cb) {
  };
});
export {
  __tla,
  onUpdate,
  searchData
};
