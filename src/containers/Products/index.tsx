import { Component, For, onMount } from 'solid-js';

import Product from 'components/Product';
import { useSortable } from 'context/sortable';
import { useTierList } from 'context/tierList';

import './index.scss';

const Products: Component = () => {
  const sortable = useSortable();
  const [tierList] = useTierList();
  let productsRef;

  onMount(() => {
    sortable().addContainer(productsRef);
  });

  return (
    <div class="products" data-id="unranked" ref={productsRef}>
      <For each={Object.values(tierList.unrankedProducts)}>
        {(product) => <Product draggable {...product} />}
      </For>
    </div>
  );
};

export default Products;
