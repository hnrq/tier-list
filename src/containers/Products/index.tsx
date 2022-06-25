import { Component, For, onMount } from 'solid-js';

import mockProducts from '__mocks__/products';
import Product from 'components/Product';
import { useSortable } from 'context/sortable';

import './index.scss';

const Products: Component = () => {
  const sortable = useSortable();
  let productsRef;

  onMount(() => {
    sortable().addContainer(productsRef);
  });

  return (
    <div class="products" data-id="unranked" ref={productsRef}>
      <For each={Object.values(mockProducts)}>
        {(product) => <Product draggable {...product} />}
      </For>
    </div>
  );
};

export default Products;
