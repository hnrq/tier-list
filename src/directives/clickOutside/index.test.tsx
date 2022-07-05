import { render, fireEvent } from 'solid-testing-library';

import * as directive from '.';

const clickOutside = directive.default;

declare module 'solid-js' {
  namespace JSX {
    interface Directives {
      clickOutside: () => void;
    }
  }
}

describe('directives/clickOutside()', () => {
  it('calls onOutsideClick callback when clicking outside the element', () => {
    const onClickOutside = vi.fn();
    const screen = render(() => (
      <div data-testid="element" use:clickOutside={onClickOutside} />
    ));

    fireEvent.click(screen.baseElement);

    expect(onClickOutside).toHaveBeenCalled();
  });
});
