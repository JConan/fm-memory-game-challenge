export interface SelectOptionsProps<
  V extends Readonly<string[] | number[]>,
  K = V[number]
> {
  label: string;
  values: V;
  selected: K;
  onSelect: ((value: K) => void) | ((value: K) => Promise<void>);
}
