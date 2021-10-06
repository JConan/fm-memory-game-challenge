import { SelectOptionsProps } from "./types";
import "./style.scss";

export const SelectOptions = <V extends Readonly<string[] | number[]>>({
  label,
  values,
  selected,
  onSelect,
}: SelectOptionsProps<V>) => (
  <div className="select-options-container">
    <span>{label}</span>
    <div className="select-options">
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
  </div>
);
