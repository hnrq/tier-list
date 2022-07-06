import { render } from 'solid-testing-library';

import { useForm } from 'hooks/useForm';

import TextField, { TextFieldProps } from '.';

const renderTextField = (props: Partial<TextFieldProps>) => {
  const { validate } = useForm();

  return render(() => (
    <TextField validate={validate} validations={[]} {...props} />
  ));
};

describe('<TextField />', () => {
  it('renders a helper text', () => {
    const helperText = 'Wrong text';
    const { getByText } = renderTextField({ helperText });
    expect(getByText(helperText)).toBeInTheDocument();
  });

  it('adds .text-field__helper-text--error class to helper text if props.error === true', () => {
    const helperText = 'Wrong text';
    const { getByText } = renderTextField({ helperText, error: true });
    expect(getByText(helperText)).toHaveClass('text-field__helper-text--error');
  });
});
