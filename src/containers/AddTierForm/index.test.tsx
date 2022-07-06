import { render, fireEvent, waitFor } from 'solid-testing-library';

import AddTierForm, { AddTierFormProps } from '.';

const renderAddTierForm = (props?: Partial<AddTierFormProps>) =>
  render(() => (
    <AddTierForm
      onSubmit={() => {
        return;
      }}
      {...props}
    />
  ));

describe('<AddTierForm />', () => {
  it('renders a title', () => {
    const { getByText } = renderAddTierForm();
    expect(getByText('Add Tier')).toBeInTheDocument();
  });

  it('renders a text field for the newly added tier title', () => {
    const { getByPlaceholderText } = renderAddTierForm();
    expect(getByPlaceholderText('Tier title')).toBeInTheDocument();
  });

  it('renders a text field for the newly added tier label', () => {
    const { getByPlaceholderText } = renderAddTierForm();
    expect(getByPlaceholderText('Tier label')).toBeInTheDocument();
  });

  it('renders a submit button', () => {
    const { getByText } = renderAddTierForm();
    expect(getByText('Add Tier')).toBeInTheDocument();
  });

  it('calls onSubmit after submitting the form, passing the filled values', async () => {
    const onSubmit = vi.fn();
    const title = 'SSS';
    const label = 'Perfect';
    const { getByText, getByPlaceholderText } = renderAddTierForm({
      onSubmit,
    });

    fireEvent.input(getByPlaceholderText('Tier title') as HTMLInputElement, {
      target: { value: title },
    });
    fireEvent.input(getByPlaceholderText('Tier label') as HTMLInputElement, {
      target: { value: label },
    });
    fireEvent.click(getByText('Create Tier') as HTMLButtonElement);

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({ title, label });
    });
  });
});
