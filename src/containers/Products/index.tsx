import { Component, For, onMount, createSignal } from 'solid-js';

import Product from 'components/Product';
import { useSortable } from 'context/sortable';
import { useTierList } from 'context/tierList';
import clickOutsideDirective from 'directives/clickOutside';

import './index.scss';

declare module 'solid-js' {
  namespace JSX {
    interface Directives {
      clickOutside: () => void;
    }
  }
}

const clickOutside = clickOutsideDirective;

const Products: Component = () => {
  const [showProducts, setShowProducts] = createSignal(false);
  const sortable = useSortable();
  const [tierList] = useTierList();
  let productsRef;

  onMount(() => {
    sortable().addContainer(productsRef);
  });

  return (
    <div
      class="products"
      use:clickOutside={() => setShowProducts(false)}
      classList={{ open: showProducts() }}
    >
      <button
        class="button products__toggle"
        onClick={() => setShowProducts((show) => !show)}
      >
        {showProducts() ? 'Hide' : 'Show'} Products
      </button>
      <div class="products__header">
        <h2 class="products__title">Products</h2>
        <button class="button button--link">Add Products</button>
      </div>
      <div class="products__container" data-id="unranked" ref={productsRef}>
        <For each={tierList.unrankedProducts}>
          {(product) => <Product draggable {...product} />}
        </For>
      </div>
    </div>
  );
};

export default Products;
