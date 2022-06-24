import { render } from 'solid-testing-library';

import products from '__mocks__/products';
import { SortableProvider } from 'context/sortable';

import Tier, { TierProps } from '.';

const renderTier = (props: Partial<TierProps>) =>
  render(() => (
    <SortableProvider options={{ draggable: '' }}>
      <Tier
        title="A"
        label="Great"
        items={[]}
        renderItem={(item: Element) => <p>{item}</p>}
        {...props}
      />
    </SortableProvider>
  ));

describe('<Tier />', () => {
  it('renders a title', () => {
    const title = 'S';
    const { getByText } = renderTier({ title });

    expect(getByText(title)).toBeInTheDocument();
  });

  it('renders a label', () => {
    const label = 'SUPERB!';
    const { getByText } = renderTier({ label });

    expect(getByText(label)).toBeInTheDocument();
  });

  describe('items', () => {
    it('renders items', () => {
      const { getByText } = renderTier({
        items: Object.values(products).map(({ name }) => name),
      });

      Object.values(products).forEach(({ name }) => {
        expect(getByText(name)).toBeInTheDocument();
      });
    });

    it('optionally renders a custom Item component if renderFunction is provided', () => {
      const testId = 'custom-item';
      const { getAllByTestId } = renderTier({
        items: Object.values(products).map(({ name }) => name),
        renderItem: (item: Element) => <h1 data-testid={testId}>{item}</h1>,
      });

      expect(getAllByTestId(testId)).toHaveLength(Object.keys(products).length);
    });
  });
});
