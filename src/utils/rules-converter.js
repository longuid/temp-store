// @flow

function convert(obj, prefix = '') {
  prefix = prefix ? (prefix + '.') : '';
  return Object.keys(obj).reduce((result, key) => {
    const item = obj[key];
    const path = prefix + key;
    const itemResult = {};
    // 多规则
    if (Array.isArray(item)) {
      itemResult[path] = item.map(d => convert(d, path))
    } else if (typeof item === 'object') {
      // 使用了properties属性，将内容在顶级输出
      if ('properties' in item) {
        // 如果对象本身也需要交验
        if (item.type === 'object') {
          const {properties, ...others} = item;
          itemResult[path] = others;
        }
        Object.assign(itemResult, convert(item.properties, path));
      } else {
        itemResult[path] = item;
      }
    } else {
      // 其他标准属性
      result[key] = item;
    }
    return {
      ...result,
      ...itemResult
    };
  }, {})
}

function isArrayRule(rule) {
  return typeof rule === 'object' && !Array.isArray(rule) && rule.type === 'array'
}

function isValidIndex(index) {
  return Number.isInteger(index) && index >= 0;
}

export function getRuleItemProp(rules, key, index) {
  let itemRules = rules[key];
  let prop = key;
  if (!itemRules) {
    return null;
  }
  // 如果是数组的一项
  if (isArrayRule(itemRules) && isValidIndex(index)) {
    // 优先使用fields的定制配置
    prop = `${key}[${index}]`;
    if (
      ('fields' in itemRules) &&
      (index in itemRules.fields)
    ) {
      itemRules = itemRules.fields[index] || null;
    } else if ('defaultField' in itemRules) {
      itemRules = itemRules.defaultField
    }
  }
  return {
    rules: itemRules,
    prop
  }
}

export function rulesConverter(obj, trigger = ['blur']) {
  const result = convert(obj);
  Object.keys(result).forEach(key => {
    const item = result[key];
    if (!('trigger' in item)) {
      item.trigger = trigger
    }
  });
  return result;
}
