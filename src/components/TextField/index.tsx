import { Component, JSX, Show, splitProps } from 'solid-js';

import classNames from 'classnames';

import './index.scss';

export interface TextFieldProps
  extends Partial<JSX.InputHTMLAttributes<HTMLInputElement>> {
  helperText?: string;
  error?: boolean;
  validate?: (element: HTMLInputElement) => {
    onBlur: (e: Event) => void;
    onInput: (e: InputEvent) => void;
  };
}

const TextField: Component<TextFieldProps> = (props) => {
  const [_splitted, rest] = splitProps(props, [
    'helperText',
    'error',
    'class',
    'validate',
  ]);
  let inputRef;

  return (
    <div class={classNames('text-field', props.class)}>
      <input
        ref={inputRef}
        class="text-field__input"
        {...rest}
        {...props.validate(inputRef)}
      />
      <Show when={props.helperText}>
        <span
          class="text-field__helper-text"
          classList={{ 'text-field__helper-text--error': props.error }}
        >
          {props.helperText}
        </span>
      </Show>
    </div>
  );
};

export default TextField;
