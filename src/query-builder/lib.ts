type StringField<N extends string> = {
  name: N;
  type: 'string';
}

export class QueryBuilder<Fields extends object = {}> {
  private fields: Fields;

  constructor(fields: Fields) {
    this.fields = fields ?? {};
  }
  stringField<N extends string>(name: N) {
    return new QueryBuilder<Fields & { [K in N]: StringField<K> }>({
      ...this.fields,
      [name]: { name, type: 'string' }
    } as Fields & { [K in N]: StringField<K> });
  }
}

export type StringFieldsName<T extends QueryBuilder> = T extends QueryBuilder<infer R> ? {
  [K in keyof R]: R[K] extends StringField<infer N> ? N : never;
}[keyof R] : never;

export type StringCondition<T extends QueryBuilder> = StringBinaryCondition<T> | StringArrayCondition<T>;

export type StringBinaryCondition<T extends QueryBuilder> = {
  fieldName: StringFieldsName<T>;
  operator: 'eq' | 'neq' | 'contains' | 'startsWith' | 'endsWith';
  value: string;
}

export type StringArrayCondition<T extends QueryBuilder> = {
  fieldName: StringFieldsName<T>;
  operator: 'in' | 'notIn';
  values: string[];
}

export type CombinatorOperator = 'and' | 'or';
export type Combinator<T extends QueryBuilder> = {
  operator: CombinatorOperator;
  conditions: ConditionTree<T>[];
}

export type ConditionTree<T extends QueryBuilder> = StringCondition<T> | Combinator<T>;