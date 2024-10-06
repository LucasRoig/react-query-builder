"use client";
import { CombinatorOperator } from "@/query-builder/lib";
import Select from "react-select"

const options = [
    { value: 'and' as const, label: 'And' },
    { value: 'or' as const, label: 'Or' },
]

export function CombinatorSelector(props: {
    value: CombinatorOperator,
    onChange: (value: CombinatorOperator) => void
}) {
    return <Select options={options} defaultValue={options[0]} onChange={(v) => {
        v?.value && props.onChange(v?.value)
    }} className=""/>
}