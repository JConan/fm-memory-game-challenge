interface Props<V extends Readonly<string[]>, K = V[number]> {
  label: string;
  values: V;
  selected: K;
  onSelect: (value: K) => void;
}

export const SelectOptions = <V extends Readonly<string[]>>({
  label,
  values,
  selected,
  onSelect,
}: Props<V>) => (
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
