import { Component, createSignal } from 'solid-js';

import TextField from 'components/TextField';
import { useForm } from 'hooks/useForm';
import { isValidUrl } from 'utils';

import './index.scss';

interface AddProductFormFields {
  url: string;
}

export interface AddProductFormProps {
  onSubmit: (value: AddProductFormFields) => Promise<void>;
}

const AddProductForm: Component<AddProductFormProps> = (props) => {
  const { validate, formSubmit, errors, reset } = useForm();
  const [submitting, setSubmitting] = createSignal<boolean>(false);

  return (
    <form
      class="add-product-form"
      // eslint-disable-next-line solid/reactivity
      use:formSubmit={async (values) => {
        setSubmitting(true);
        await props.onSubmit(values);
        setSubmitting(false);
        reset();
      }}
    >
      <TextField
        placeholder="Aliexpress product url"
        name="url"
        autocomplete="off"
        validate={validate([
          ({ value }) => !value && 'url is required',
          ({ value }) => !isValidUrl(value) && 'Invalid url',
        ])}
        disabled={submitting()}
        helperText={errors['url']}
        error={Boolean(errors['url'])}
      />
      <button
        class="button button--contained button--full-width button--large"
        type="submit"
        disabled={submitting()}
      >
        <span class="material-icons">add</span>
      </button>
    </form>
  );
};

export default AddProductForm;
