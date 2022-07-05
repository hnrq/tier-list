import { JSX, ParentProps } from 'solid-js';

import { fireEvent, render } from 'solid-testing-library';

import Modal, { ModalProps } from '.';

const renderModal = (props?: Partial<ParentProps<ModalProps>>) =>
  render(() => <Modal open {...props} />);

describe('<Modal />', () => {
  it('renders a backdrop', () => {
    const { getByTestId } = renderModal();
    expect(getByTestId('modal__backdrop')).toBeInTheDocument();
  });

  it('renders children', () => {
    const children = (<h1>content</h1>) as JSX.Element;
    renderModal({ children });

    expect(children).toBeInTheDocument();
  });

  it('does not render anything if props.open = false', () => {
    const { queryByTestId } = renderModal({ open: false });
    expect(queryByTestId('modal__content')).not.toBeInTheDocument();
  });

  it('renders content with a sizing provided through the props.size', () => {
    const size = 'lg';
    const { getByTestId } = renderModal({ size });

    expect(getByTestId('modal__content')).toHaveClass(`container-${size}`);
  });

  it('calls onClose callback prop when clicking backdrop', () => {
    it('renders content with a sizing provided through the size prop', () => {
      const onClose = vi.fn();
      const { getByTestId } = renderModal({ onClose });
      fireEvent.click(getByTestId('backdrop') as HTMLElement);

      expect(onClose).toHaveBeenCalled();
    });
  });
});
