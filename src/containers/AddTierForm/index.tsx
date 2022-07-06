import { Component, Show } from 'solid-js';

import classNames from 'classnames';

import TextField from 'components/TextField';
import { useForm } from 'hooks/useForm';

import './index.scss';

interface AddTierFormFields {
  title: string;
  label: string;
}

export interface AddTierFormProps {
  onSubmit: (value: AddTierFormFields) => void;
}

const AddTierForm: Component<AddTierFormProps> = (props) => {
  const { validate, formSubmit, errors } = useForm();
  return (
    <form class="add-tier-form mb-3" use:formSubmit={props.onSubmit}>
      <h2 class="add-tier-form__title">Add Tier</h2>
      <TextField
        class="mb-2"
        placeholder="Tier title"
        name="title"
        autocomplete="off"
        validate={validate([
          ({ value }) => !value && 'Title is required',
          ({ value }) =>
            value.length > 3 && 'Title should have less than 3 characters',
        ])}
        helperText={errors['title']}
        error={Boolean(errors['title'])}
      />
      <TextField
        class="mb-3"
        placeholder="Tier label"
        name="label"
        autocomplete="off"
        validate={validate([({ value }) => !value && 'Label is required'])}
        helperText={errors['label']}
        error={Boolean(errors['label'])}
      />
      <button
        class="button button--contained button--full-width button--large"
        type="submit"
      >
        Create Tier
      </button>
    </form>
  );
};

export default AddTierForm;
