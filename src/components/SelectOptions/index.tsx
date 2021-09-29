import { SelectOptionsProps } from "./types";

export const SelectOptions = <V extends Readonly<string[]>>({
  label,
  values,
  selected,
  onSelect,
}: SelectOptionsProps<V>) => (
  <div>
    <span>{label}</span>
    {values.map((name, idx) => (
      <button
        onClick={() => onSelect(name)}
        className={selected === name ? "button-active" : ""}
        key={idx}
      >
        {name}
      </button>
    ))}
  </div>
);
