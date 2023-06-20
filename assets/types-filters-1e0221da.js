class FilterValueDef {
  
  
  constructor(def) {
    this.def = def;
    this.type = def.type;
  }
  toJSON() {
    return { ...this };
  }
}
class FilterValueList extends FilterValueDef {constructor(...args) { super(...args); FilterValueList.prototype.__init.call(this); }
  __init() {this.filterValues = [];}
}
class FilterValueBoolean extends FilterValueDef {constructor(...args2) { super(...args2); FilterValueBoolean.prototype.__init2.call(this); }
  __init2() {this.filterValue = false;}
}
class FilterValueDate extends FilterValueDef {constructor(...args3) { super(...args3); FilterValueDate.prototype.__init3.call(this);FilterValueDate.prototype.__init4.call(this); }
  __init3() {this.filterValueBegin = null;}
  __init4() {this.filterValueEnd = null;}
}
class FilterValueNumberRange extends FilterValueDef {constructor(...args4) { super(...args4); FilterValueNumberRange.prototype.__init5.call(this);FilterValueNumberRange.prototype.__init6.call(this); }
  __init5() {this.filterValueMin = null;}
  __init6() {this.filterValueMax = null;}
}
function isSet(filter) {
  switch (filter.type) {
    case "boolean":
      return filter.filterValue;
    case "checkboxes_list":
    case "multiselection":
      return filter.filterValues.length > 0;
    case "date_range":
      return filter.filterValueBegin !== null || filter.filterValueEnd !== null;
    case "number_range":
      return filter.filterValueMin !== null && filter.filterValueMin !== filter.def.min || filter.filterValueMax !== null && filter.filterValueMax !== filter.def.max;
  }
}
function isMatch(filter, properties) {
  switch (filter.type) {
    case "boolean":
      return Boolean(properties[filter.def.property]);
    case "checkboxes_list":
    case "multiselection":
      const propertyValues = properties[filter.def.property];
      if (propertyValues instanceof Array) {
        return filter.filterValues.some(
          (filterValue) => propertyValues.includes(filterValue)
        );
      } else {
        return filter.filterValues.includes(
          properties[filter.def.property]
        );
      }
    case "date_range":
      return Boolean(
        (!filter.def.property_begin || !filter.filterValueEnd || properties[filter.def.property_begin] <= filter.filterValueEnd) && (!filter.def.property_end || !filter.filterValueBegin || properties[filter.def.property_end] >= filter.filterValueBegin)
      );
    case "number_range":
      return (filter.filterValueMin == null || filter.filterValueMin <= properties[filter.def.property]) && (filter.filterValueMax == null || properties[filter.def.property] <= filter.filterValueMax);
  }
}
function filterValuesIsSet(filterValues) {
  return filterValues.some((filterValue) => isSet(filterValue));
}
function filterValueFactory(filter) {
  switch (filter.type) {
    case "boolean":
      return new FilterValueBoolean(filter);
    case "checkboxes_list":
    case "multiselection":
      return new FilterValueList(filter);
    case "date_range":
      return new FilterValueDate(filter);
    case "number_range":
      return new FilterValueNumberRange(filter);
  }
}

export { FilterValueDate as F, FilterValueNumberRange as a, FilterValueList as b, filterValuesIsSet as c, isMatch as d, filterValueFactory as f, isSet as i };
