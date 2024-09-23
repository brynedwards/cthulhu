interface Props {
  id: string;
  value: number;
  min: number;
  max: number;
  disabled: boolean;
  bind: (val: number) => void;
}

export default (props: Props) => {
  let input: HTMLInputElement;
  function onInput(
    e: InputEvent & {
      currentTarget: HTMLInputElement;
      target: HTMLInputElement;
    },
  ) {
    props.bind(parseInt(e.target.value));
  }

  return (
    <input
      value={props.value}
      id={props.id}
      min={props.min}
      max={props.max}
      type="range"
      onInput={onInput}
      disabled={props.disabled}
      ref={input}
    />
  );
};
