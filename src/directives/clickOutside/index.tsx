import { Accessor, onCleanup } from 'solid-js';

const clickOutside = (el: HTMLElement, accessor: Accessor<() => void>) => {
  const onClick = (e) => !el.contains(e.target) && accessor()?.();
  document.body.addEventListener('click', onClick);

  onCleanup(() => document.body.removeEventListener('click', onClick));
};

export default clickOutside;
