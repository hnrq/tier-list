import { Component, For, onMount } from 'solid-js';

import mockProducts from '__mocks__/products';
import Product from 'components/Product';
import { useSortable } from 'context/sortable';

const Products: Component = () => {
  const sortable = useSortable();
  let productsRef;

  onMount(() => {
    console.log(sortable);
    sortable().addContainer(productsRef);
  });

  return (
    <div
      ref={productsRef}
      style={{
        display: 'flex',
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

export default Products;
