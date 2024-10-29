"use client";

import { useState } from "react";
import { CombinatorSelector } from "./combinator-select";
import { Button } from "./ui/button";
import { TestQueryBuilderType } from "@/query-builder/playground";
import { Combinator, StringCondition } from "@/query-builder/lib";
import { QueryBuilder as TQueryBuilder } from "@/query-builder/lib";
import Select from "react-select"
import { Input } from "./ui/input";


function RuleFieldNameSelector<T extends TQueryBuilder>(props: { fieldName: string, onChange: (fieldName: string) => void }) {
    const options = [
        { value: props.fieldName, label: props.fieldName }
    ]
    return <Select options={options} defaultValue={options[0]} onChange={(v) => {
        v?.value && props.onChange(v?.value)
    }} className="shrink-0" />
}

function RuleOperatorSelector<T extends TQueryBuilder>(props: { operator: string, onChange: (operator: string) => void }) {
    const options = [
        { value: props.operator, label: props.operator }
    ]
    return <Select options={options} defaultValue={options[0]} onChange={(v) => {
        v?.value && props.onChange(v?.value)
    }} className="shrink-0" />
}

function RuleValueSelector<T extends TQueryBuilder>(props: { value: string, onChange: (value: string) => void }) {
    return <Input type="text" value={props.value} onChange={(e) => {
        props.onChange(e.target.value)
    }} className="shrink-1" />
}

function BinaryRule<T extends TQueryBuilder>(props: { rule: StringCondition<T>, onChange: (rule: StringCondition<T>) => void }) {
    return <div className="flex p-4 gap-4">
        <RuleFieldNameSelector fieldName={props.rule.fieldName} onChange={() => { }} />
        <RuleOperatorSelector operator={props.rule.operator} onChange={() => { }} />
        <RuleValueSelector value={props.rule.value} onChange={(v) => { props.onChange({ ...props.rule, value: v }) }} />
    </div>
}

function Group<T extends TQueryBuilder>(props: {
    conditionTree: Combinator<T>;
    onUpdate: (conditionTree: Combinator<T>) => void;
    newRuleProvider: () => StringCondition<T>;
}) {
    const handleAddGroup = () => {
        const newGroup: Combinator<T> = {
            kind: 'combinator',
            operator: 'and',
            conditions: []
        }
        const updateValue = {
            ...props.conditionTree,
            conditions: [...props.conditionTree.conditions, newGroup]
        }
        props.onUpdate(updateValue);
    }
    const handleAddRule = () => {
        const newRule = props.newRuleProvider();
        const updateValue = {
            ...props.conditionTree,
            conditions: [...props.conditionTree.conditions, newRule]
        }
        props.onUpdate(updateValue);
    }
    const handleSubgroupUpdate = (newValue: Combinator<T>, index: number) => {
        console.log("subgroup at index", index, "update with", newValue)
        const updateValue = {
            ...props.conditionTree,
            conditions: [
                ...props.conditionTree.conditions.slice(0, index),
                newValue,
                ...props.conditionTree.conditions.slice(index + 1)
            ]
        }
        props.onUpdate(updateValue);
    }
    const handleRuleChange = (newRule: StringCondition<T>, index: number) => {
        const updateValue = {
            ...props.conditionTree,
            conditions: [
                ...props.conditionTree.conditions.slice(0, index),
                newRule,
                ...props.conditionTree.conditions.slice(index + 1)
            ]
        }
        props.onUpdate(updateValue);
    }
    return (
        <div className="flex flex-col p-4">
            <div className="flex gap-4">
                <CombinatorSelector onChange={operator => props.onUpdate({
                    ...props.conditionTree,
                    operator
                })} value={props.conditionTree.operator} />
                <Button onClick={handleAddRule}>Add Rule</Button>
                <Button onClick={handleAddGroup}>Add Group</Button>
            </div>
            {props.conditionTree.conditions.map((condition, i) => {
                if (condition.kind === 'combinator') {
                    return <Group conditionTree={condition} onUpdate={c => handleSubgroupUpdate(c, i)} newRuleProvider={props.newRuleProvider} />
                } else if (condition.kind === 'stringBinary') {
                    return <BinaryRule rule={condition} onChange={c => handleRuleChange(c, i)} />
                }
            })}
        </div>
    )
}

export function QueryBuilder() {
    const [conditionTree, setConditionTree] = useState<Combinator<TestQueryBuilderType>>({
        kind: 'combinator',
        operator: 'and',
        conditions: []
    })
    const handleUpdate = (conditionTree: Combinator<TestQueryBuilderType>) => {
        console.log(conditionTree)
        setConditionTree(conditionTree)
    }
    const newRuleProvider = (): StringCondition<TestQueryBuilderType> => {
        return {
            kind: 'stringBinary',
            fieldName: 'name',
            operator: 'eq',
            value: ''
        }
    }
    return (
        <div className="flex flex-col border border-black p-8 w-full">
            <Group conditionTree={conditionTree} onUpdate={handleUpdate} newRuleProvider={newRuleProvider} />
        </div>
    )
}