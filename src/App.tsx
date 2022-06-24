import { Component, For, onMount } from 'solid-js';

import { Sortable, Plugins } from '@shopify/draggable';

import mockProducts from '__mocks__/products';
import Product from 'components/Product';

import 'theme/index.scss';

const App: Component = () => {
  let containerRef: HTMLDivElement;

  onMount(() => {
    new Sortable(containerRef, {
      draggable: '.product--draggable',
      plugins: [Plugins.SortAnimation],
      sortAnimation: {
        duration: 200,
        easingFunction: 'ease-in-out',
      },
    });
  });

  return (
    <div
      ref={containerRef}
      style={{
        display: 'flex',
        'flex-direction': 'row',
        'flex-wrap': 'wrap',
        gap: '16px',
      }}
    >
      <For each={mockProducts}>
        {(product) => <Product draggable {...product} />}
      </For>
    </div>
  );
};

export default App;
