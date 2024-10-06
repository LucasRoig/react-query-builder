"use client";

import { useState } from "react";
import { CombinatorSelector } from "./combinator-select";
import { Button } from "./ui/button";
import { TestQueryBuilderType } from "@/query-builder/playground";
import { Combinator } from "@/query-builder/lib";
import { QueryBuilder as TQueryBuilder } from "@/query-builder/lib";

function Group<T extends TQueryBuilder>(props: {
    conditionTree: Combinator<T>
    onUpdate: (conditionTree: Combinator<T>) => void
}) {
    const handleAddGroup = () => {
        const newGroup: Combinator<T> = {
            operator: 'and',
            conditions: []
        }
        const updateValue = {
            ...props.conditionTree,
            conditions: [...props.conditionTree.conditions, newGroup]
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
    return (
        <div className="flex flex-col p-4">
            <div className="flex gap-4">
                <CombinatorSelector onChange={operator => props.onUpdate({
                    ...props.conditionTree,
                    operator
                })} value={props.conditionTree.operator} />
                <Button>Add Rule</Button>
                <Button onClick={handleAddGroup}>Add Group</Button>
            </div>
            {props.conditionTree.conditions.map((condition, i) => {
                if (condition.operator === 'and' || condition.operator === 'or') {
                    return <Group conditionTree={condition} onUpdate={c => handleSubgroupUpdate(c, i)} />
                }
            })}
        </div>
    )
}

export function QueryBuilder() {
    const [conditionTree, setConditionTree] = useState<Combinator<TestQueryBuilderType>>({
        operator: 'and',
        conditions: []
    })
    const handleUpdate = (conditionTree: Combinator<TestQueryBuilderType>) => {
        console.log(conditionTree)
        setConditionTree(conditionTree)
    }
    return (
        <div className="flex flex-col border border-black p-8 w-full">
            <Group conditionTree={conditionTree} onUpdate={handleUpdate} />
        </div>
    )
}