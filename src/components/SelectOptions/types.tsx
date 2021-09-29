export interface SelectOptionsProps<
  V extends Readonly<string[]>,
  K = V[number]
> {
  label: string;
  values: V;
  selected: K;
  onSelect: (value: K) => void;
}
