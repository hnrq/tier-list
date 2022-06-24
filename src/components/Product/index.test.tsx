import { render } from 'solid-testing-library';

import Product, { ProductProps } from '.';

const renderProduct = (props: Partial<ProductProps>) =>
  render(() => (
    <Product
      id="1"
      image="https://picsum.photos/200/300"
      name="Product"
      vendor="Vendor"
      price={99.99}
      {...props}
    />
  ));

describe('<Product />', () => {
  it('renders a product image', () => {
    const image = 'https://image.url/';
    const { getByRole } = renderProduct({ image });

    expect(getByRole('img')).toHaveAttribute('src', image);
  });

  it('renders the product name', () => {
    const name = 'Product name';
    const { getByText } = renderProduct({ name });

    expect(getByText(name)).toBeInTheDocument();
  });

  it('renders the vendor name', () => {
    const vendor = 'Product vendor';
    const { getByText } = renderProduct({ vendor });

    expect(getByText(vendor)).toBeInTheDocument();
  });

  describe('price', () => {
    it('renders the dollar price', () => {
      const price = 10.99;
      const { getByText } = renderProduct({ price });

      expect(getByText(price.toString().split('.')[0])).toBeInTheDocument();
    });

    it('renders the cents', () => {
      const price = 10.99;
      const { getByText } = renderProduct({ price });

      expect(
        getByText(`.${price.toString().split('.')[1]}`)
      ).toBeInTheDocument();
    });
  });
});
