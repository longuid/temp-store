export declare interface PlainObject {
  [key: string]: any;
}

// 规则转换器
export declare function getRuleItemProp(rules: PlainObject, key: string, index?: number): PlainObject;

export declare function rulesConverter(rules: PlainObject, trigger: string[]): PlainObject;