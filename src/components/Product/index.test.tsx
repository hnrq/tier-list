import { fireEvent, render } from 'solid-testing-library';

import Product, { ProductProps } from '.';

const renderProduct = (props: Partial<ProductProps>) =>
  render(() => (
    <Product
      id="1"
      images={['https://picsum.photos/200/300']}
      title="Product"
      store="Vendor"
      originalPrice={{ min: 99.99, max: 99.99 }}
      {...props}
    />
  ));

describe('<Product />', () => {
  it('renders a product image', () => {
    const image = 'https://image.url/';
    const { getByRole } = renderProduct({ images: [image] });

    expect(getByRole('img')).toHaveAttribute('src', image);
  });

  it('renders the product title', () => {
    const title = 'Product title';
    const { getByText } = renderProduct({ title });

    expect(getByText(title)).toBeInTheDocument();
  });

  it('renders the store name', () => {
    const store = 'Product store';
    const { getByText } = renderProduct({ store });

    expect(getByText(store)).toBeInTheDocument();
  });

  describe('price', () => {
    it('renders the dollar price', () => {
      const price = 10.99;
      const { getByText } = renderProduct({
        originalPrice: { min: price, max: price },
      });

      expect(getByText(price.toString().split('.')[0])).toBeInTheDocument();
    });

    it('renders the dollar price', () => {
      const price = 10.99;
      const { getByText } = renderProduct({
        originalPrice: { min: price, max: price },
      });

      expect(getByText(price.toString().split('.')[0])).toBeInTheDocument();
    });
  });

  describe('action', () => {
    it('renders', () => {
      const action = { label: 'Action', onClick: vi.fn() };
      const { getByText } = renderProduct({ action });
      expect(getByText(action.label)).toBeInTheDocument();
    });

    it('fires a callback on click', () => {
      const action = { label: 'Action', onClick: vi.fn() };
      const { getByText } = renderProduct({ action });
      fireEvent.click(getByText(action.label) as HTMLButtonElement);
      expect(action.onClick).toHaveBeenCalled();
    });
  });
});
