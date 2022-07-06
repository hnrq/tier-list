import { fireEvent, render } from 'solid-testing-library';

import mockTiers from '__mocks__/tiers';
import { SortableProvider } from 'context/sortable';

import Tiers from '.';

vi.mock('context/tierList', () => ({
  useTierList: vi.fn(() => [{ tiers: mockTiers }]),
}));

const renderTiers = () =>
  render(() => (
    <SortableProvider options={{}}>
      <Tiers />
    </SortableProvider>
  ));

describe('<Tiers />', () => {
  it('renders a title', () => {
    const { getByText } = renderTiers();
    expect(getByText('Tiers')).toBe;
  });

  it('renders a button to add a new tier', () => {
    const { getByText } = renderTiers();
    expect(getByText('Add Tier')).toBe;
  });

  it('renders tiers', () => {
    const { getByText } = renderTiers();
    Object.values(mockTiers).forEach((tier) => {
      expect(getByText(tier.title)).toBeInTheDocument();
    });
  });

  describe('New Tier modal', () => {
    it('opens New tier modal when clicking "Add Tier" button', () => {
      const { getByText, getByTestId } = renderTiers();
      fireEvent.click(getByText('Add Tier') as HTMLElement);

      expect(getByTestId('modal__content')).toBeInTheDocument();
    });
  });
});
