import { Accessor } from 'solid-js';

import { createStore, SetStoreFunction } from 'solid-js/store';

export type validateFn = (element: HTMLInputElement) => string;

export interface ConfigProps {
  element: HTMLInputElement;
  validators: Array<validateFn>;
}

const checkValid = async (
  { element, validators = [] }: ConfigProps,
  setErrors: SetStoreFunction<Record<string, string>>
) => {
  element.setCustomValidity('');
  element.checkValidity();
  let message = element.validationMessage;
  if (!message) {
    for (const validator of validators) {
      const text = await validator(element);
      if (text) {
        element.setCustomValidity(text);
        break;
      }
    }
    message = element.validationMessage;
  }
  if (message) setErrors({ [element.name]: message });
};

export const useForm = () => {
  const [errors, setErrors] = createStore<Record<string, string>>({});
  const fields = {};

  const reset = () => {
    for (const field in fields) {
      fields[field].element.value = '';
    }
  };

  const validate =
    (validators?: validateFn[]) => (element: HTMLInputElement) => {
      fields[element.name] = { element, validators };
      return {
        onBlur: (evt) =>
          checkValid({ element: evt.currentTarget, validators }, setErrors),
        onInput: (evt) => {
          if (!errors[evt.currentTarget.name]) return;
          setErrors({ [evt.currentTarget.name]: undefined });
        },
      };
    };

  const formSubmit = (
    ref: HTMLFormElement,
    accessor?: Accessor<(value: Record<string, string>) => void>
  ) => {
    const callback =
      accessor() ||
      (() => {
        return;
      });
    ref.setAttribute('novalidate', '');
    ref.onsubmit = async (e: SubmitEvent) => {
      e.preventDefault();
      let errored = false;

      for (const k in fields) {
        const field = fields[k];
        await checkValid(field, setErrors);
        if (!errored && field.element.validationMessage) {
          field.element.focus();
          errored = true;
        }
      }
      if (!errored) {
        const formData = new FormData(ref);
        const formProps = Object.fromEntries(formData);
        callback(formProps as Record<string, string>);
      }
    };
  };

  return { validate, formSubmit, errors, reset };
};
