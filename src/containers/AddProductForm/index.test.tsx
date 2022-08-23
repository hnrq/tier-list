import { render, fireEvent, waitFor } from 'solid-testing-library';

import AddProductForm, { AddProductFormProps } from '.';

const renderAddProductForm = (props?: Partial<AddProductFormProps>) =>
  render(() => (
    <AddProductForm
      onSubmit={async () => {
        return;
      }}
      {...props}
    />
  ));

describe('<AddProductForm />', () => {
  it('renders a text field for the product URL', () => {
    const { getByPlaceholderText } = renderAddProductForm();
    expect(getByPlaceholderText('Aliexpress product url')).toBeInTheDocument();
  });
  it('renders a submit button', () => {
    const { getByRole } = renderAddProductForm();
    expect(getByRole('button')).toBeInTheDocument();
  });

  it('calls onSubmit after submitting the form, passing the filled values', async () => {
    const onSubmit = vi.fn();
    const url = 'https://aliexpress.com/product.html';
    const { getByRole, getByPlaceholderText } = renderAddProductForm({
      onSubmit,
    });

    fireEvent.input(
      getByPlaceholderText('Aliexpress product url') as HTMLInputElement,
      {
        target: { value: url },
      }
    );
    fireEvent.click(getByRole('button') as HTMLButtonElement);

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({ url });
    });
  });
});
