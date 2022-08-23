import { render, fireEvent } from 'solid-testing-library';

import mockProducts from '__mocks__/products';
import { SortableProvider } from 'context/sortable';

import Products from '.';

vi.mock('context/tierList', () => ({
  useTierList: vi.fn(() => [{ unrankedProducts: mockProducts }]),
}));

const renderProducts = () =>
  render(() => (
    <SortableProvider options={{}}>
      <Products />
    </SortableProvider>
  ));

describe('<Products />', () => {
  it('renders a title', () => {
    const { getByText } = renderProducts();
    expect(getByText('Products')).toBeInTheDocument();
  });

  it('renders products from reducer', () => {
    const { getByText } = renderProducts();

    mockProducts.forEach((product) => {
      expect(getByText(product.title)).toBeInTheDocument();
    });
  });

  it('renders a button for toggling collapse in Products Menu', () => {
    const { getByText } = renderProducts();
    expect(getByText('Show Products')).toBeInTheDocument();
  });

  it("toggles button text between 'Show Products' and 'Hide Products'", async () => {
    const { getByText, findByText } = renderProducts();
    fireEvent.click(getByText('Show Products') as HTMLElement);

    expect(await findByText('Hide Products')).toBeInTheDocument();
  });

  it('toggles container state when clicking outside of it', async () => {
    const { getByText, findByText, container } = renderProducts();
    fireEvent.click(getByText('Show Products') as HTMLElement);

    expect(await findByText('Hide Products')).toBeInTheDocument();

    fireEvent.click(container);

    expect(await findByText('Show Products')).toBeInTheDocument();
  });
});
