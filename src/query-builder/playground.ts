import { match } from "ts-pattern";
import { ConditionTree, QueryBuilder, StringCondition, StringFieldsName } from "./lib";

const qb = new QueryBuilder({}).stringField('name').stringField('age');

type stringFields = StringFieldsName<typeof qb>;

type stringCondition = StringCondition<typeof qb>;
// declare const decStringCondition: StringCondition<typeof qb>;

// if (decStringCondition.operator === 'in') {
//   decStringCondition.values
// }

// if (decStringCondition.operator === 'eq') {
//   decStringCondition.value
// }

// declare const conditionTree: ConditionTree<typeof qb>;

// if (conditionTree.operator === 'and') {
//   conditionTree.conditions
// }

// if (conditionTree.operator === 'in') {
//   conditionTree.values
// }

// if (conditionTree.operator === 'eq') {
//   conditionTree.value
// }

function queryTreeVisitor(conditionTree: ConditionTree<typeof qb>): string {
  return match(conditionTree)
    .with({operator: 'and'}, q => `AND(${q.conditions.map(queryTreeVisitor).join(', ')})`)
    .with({operator: 'or'}, q => `OR(${q.conditions.map(queryTreeVisitor).join(', ')})`)
    .with({operator: 'eq'}, q => `${q.fieldName} = ${q.value}`)
    .with({operator: 'neq'}, q => `${q.fieldName} != ${q.value}`)
    .with({operator: 'contains'}, q => `${q.fieldName} LIKE '%${q.value}%'`)
    .with({operator: 'startsWith'}, q => `${q.fieldName} LIKE '${q.value}%'`)
    .with({operator: 'endsWith'}, q => `${q.fieldName} LIKE '%${q.value}'`)
    .with({operator: 'in'}, q => `${q.fieldName} IN (${q.values.map(v => `'${v}'`).join(', ')})`)
    .with({operator: 'notIn'}, q => `${q.fieldName} NOT IN (${q.values.map(v => `'${v}'`).join(', ')})`)
    .exhaustive();
}

const tree = {
  operator: 'and',
  conditions: [
    {
      operator: 'or',
      conditions: [
        {
          operator: 'eq',
          fieldName: 'name',
          value: 'John'
        },
        {
          operator: 'eq',
          fieldName: 'age',
          value: '20'
        }
      ]
    },
    {
      operator: 'and',
      conditions: [
        {
          operator: 'eq',
          fieldName: 'name',
          value: 'John'
        },
        {
          operator: 'eq',
          fieldName: 'age',
          value: '20'
        }
      ]
    }
  ]
} satisfies ConditionTree<typeof qb>;

export type TestQueryBuilderType = typeof qb;
export const queryString = queryTreeVisitor(tree);