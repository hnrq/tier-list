import { Component, For, onMount, createSignal } from 'solid-js';

import fetchProducts from 'api/fetchProducts';
import Product from 'components/Product';
import AddProductForm from 'containers/AddProductForm';
import { useSortable } from 'context/sortable';
import { useTierList } from 'context/tierList';
import clickOutsideDirective from 'directives/clickOutside';
import { addProducts, removeProduct } from 'reducers/tierList/actions';

import './index.scss';

const clickOutside = clickOutsideDirective;

const Products: Component = () => {
  const [showProducts, setShowProducts] = createSignal(false);
  const sortable = useSortable();
  const [tierList, dispatch] = useTierList();
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
        <AddProductForm
          onSubmit={async (value) => {
            fetchProducts(value.url).then((products) => {
              dispatch(addProducts({ products }));
            });
          }}
        />
      </div>
      <div
        class="products__container"
        data-id="unranked"
        ref={productsRef}
        classList={{
          'products__container--no-products':
            tierList.unrankedProducts.length === 0,
        }}
      >
        <For
          each={tierList.unrankedProducts}
          fallback={<div class="products__no-products">No products added.</div>}
        >
          {(product) => (
            <Product
              draggable
              action={{
                label: <small class="material-icons">close</small>,
                onClick: () => {
                  dispatch(removeProduct({ id: product.id, from: 'unranked' }));
                },
              }}
              {...product}
            />
          )}
        </For>
      </div>
    </div>
  );
};

export default Products;
