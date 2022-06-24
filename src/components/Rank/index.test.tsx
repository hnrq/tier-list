import { render } from 'solid-testing-library';

import products from '__mocks__/products';
import { SortableProvider } from 'context/sortable';

import Rank, { RankProps } from '.';

const renderRank = (props: Partial<RankProps>) =>
  render(() => (
    <SortableProvider options={{ draggable: '' }}>
      <Rank
        title="A"
        label="Great"
        items={[]}
        renderItem={(item: Element) => <p>{item}</p>}
        {...props}
      />
    </SortableProvider>
  ));

describe('<Rank />', () => {
  it('renders a title', () => {
    const title = 'S';
    const { getByText } = renderRank({ title });

    expect(getByText(title)).toBeInTheDocument();
  });

  it('renders a label', () => {
    const label = 'SUPERB!';
    const { getByText } = renderRank({ label });

    expect(getByText(label)).toBeInTheDocument();
  });

  describe('items', () => {
    it('renders items', () => {
      const { getByText } = renderRank({
        items: products.map(({ name }) => name),
      });

      products.forEach(({ name }) => {
        expect(getByText(name)).toBeInTheDocument();
      });
    });

    it('optionally renders a custom Item component if renderFunction is provided', () => {
      const testId = 'custom-item';
      const { getAllByTestId } = renderRank({
        items: products.map(({ name }) => name),
        renderItem: (item: Element) => <h1 data-testid={testId}>{item}</h1>,
      });

      expect(getAllByTestId(testId)).toHaveLength(products.length);
    });
  });
});
